import { define, Dropdown, Events, Auth, Observer } from "@calpoly/mustang";
import { LitElement, css, html } from "lit";
import { state } from "lit/decorators.js";
import reset from "../styles/reset.css";

function toggleDarkMode(ev: InputEvent) {
  const target = ev.target as HTMLInputElement;
  const checked = target.checked;

  Events.relay(ev, "dark-mode", { checked });
}

function signOut(ev: MouseEvent) {
  Events.relay(ev, "auth:message", ["auth/signout"]);
}

export class UniMarketNav extends LitElement {
  static uses = define({
    "drop-down": Dropdown.Element,
  });

  @state()
  userid: string = "user";

  _authObserver = new Observer<Auth.Model>(this, "blazing:auth");

  connectedCallback() {
    super.connectedCallback();

    this._authObserver.observe(({ user }) => {
      console.log("user", user);
      if (user && user.username !== this.userid) {
        console.log("Updating userid from", this.userid, "to", user.username);
        this.userid = user.username;
      }
    });
  }

  static initializeOnce() {
    function toggleDarkMode(page: HTMLElement, checked: boolean) {
      page.classList.toggle("dark-mode", checked);
    }

    document.body.addEventListener("dark-mode", (event) =>
      toggleDarkMode(
        event.currentTarget as HTMLElement,
        (event as CustomEvent).detail?.checked
      )
    );
  }

  protected render() {
    return html`
      <header>
        <a href="/listings">
          <h1 class="navBar">
            <svg class="icon-market">
              <use href="../assets/icons.svg#icon-market" />
            </svg>
            <span>UniMarket</span>
          </h1>
        </a>
        <a slot="actuator">
          Hello,
          <span id="userid">${this.userid}</span>
        </a>
        <li class="when-signed-in">
          <a id="signout" @click=${signOut}>Sign Out</a>
        </li>
        <li class="when-signed-out">
          <a href="/login">Sign In</a>
        </li>
        <drop-down>
          <label @change=${toggleDarkMode}>
            <input type="checkbox" />
            Dark Mode
          </label>
        </drop-down>
      </header>
    `;
  }

  static styles = [
    reset.styles,
    css`
      .navBar {
        display: flex;
        align-items: center;
        flex-direction: row;
        gap: 0.5em;
      }

      .icon-market {
        width: 1.5em;
        height: 1.5em;
        margin: 0;
        padding-left: var(--content-size-small);
        fill: var(--color-white);
      }

      header h1 {
        font-size: var(--size-type-xxlarge);
        font-family: var(--font-family-display);
        padding: 0.5rem;
        width: 100%;
        margin: 0;
      }

      header {
        background-color: var(--color-eggplant);
        color: var(--color-white);
        margin: 0;
        margin-bottom: var(--content-size-small);
      }

      a {
        color: var(--color-link);
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
    `,
  ];
}
