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
      if (user) {
        if (user.username === "anonymous") {
          // Redirect anonymous users to the login page
          console.log("User is anonymous. Redirecting to /login.");
          window.location.href = "/login";
        } else if (user.username !== this.userid) {
          console.log("Updating userid from", this.userid, "to", user.username);
          this.userid = user.username;
        }
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
        <main class="navBar">
          <a href="/app">
            <h1 class="navTitle">
              <svg class="icon-market">
                <use href="/assets/icons.svg#icon-market" />
              </svg>
              <span>UniMarket</span>
            </h1>
          </a>
          <section class="navInfo">
            <a slot="actuator">
              Hello,
              <span id="userid">${this.userid}</span>
            </a>
            <div class="dropdown">
              <button class="dropbtn">Menu</button>
              <!-- Conditionally render Sign Out/Sign In links -->
              <div class="dropdown-content">
                ${this.userid !== "anonymous"
                  ? html`
                      <li class="when-signed-in">
                        <a id="signout" @click=${signOut}>Sign Out</a>
                      </li>
                    `
                  : html`
                      <li class="when-signed-out">
                        <a href="/login">Sign In</a>
                      </li>
                    `}
                <label @change=${toggleDarkMode}>
                  <input type="checkbox" />
                  Dark Mode
                </label>
              </div>
            </div>
          </section>
        </main>
      </header>
    `;
  }

  static styles = [
    reset.styles,
    css`
      .navTitle {
        display: flex;
        align-items: center;
        flex-direction: row;
        gap: 0.5em;
      }

      .navBar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      .navInfo {
        display: flex;
        flex-direction: column;
        align-self: center;
        margin-right: 10px;
      }

      .dropbtn {
        background-color: var(--color-sage);
        color: white;
        font-size: 16px;
        border: none;
        cursor: pointer;
        padding-left: 20px;
        padding-right: 20px;
      }

      .dropdown {
        position: relative;
        display: inline-block;
        align-self: center;
      }

      /* Dropdown Content (Hidden by Default) */
      .dropdown-content {
        display: none;
        position: absolute;
        background-color: var(--color-eggplant);
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
      }

      /* Show the dropdown menu on hover */
      .dropdown:hover .dropdown-content {
        display: block;
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
