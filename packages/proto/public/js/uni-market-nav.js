import { css, html, shadow, Observer, Events } from "@calpoly/mustang";
import reset from "./reset.css.js";

export class UniMarketNav extends HTMLElement {
  static template = html`
    <template>
      <header>
        <a href="#">
          <h1 class="navBar">
            <svg class="icon-market">
              <use href="../icons/icons.svg#icon-market" />
            </svg>
            <span>UniMarket</span>
          </h1>
        </a>
        <a slot="actuator">
          Hello,
          <span id="userid"></span>
        </a>
        <li class="when-signed-in">
          <a id="signout" href="/login">Sign Out</a>
        </li>
        <li class="when-signed-out">
          <a href="/login">Sign In</a>
        </li>
        <drop-down>
          <label
            onchange="relayEvent(
            event,
            'dark-mode',
            {checked: event.target.checked})"
          >
            <input type="checkbox" autocomplete="off" />
            Dark mode
          </label>
        </drop-down>
      </header>
    </template>
  `;

  static styles = css`
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
  `;

  _authObserver = new Observer(this, "blazing:auth");

  // runs each time the component is added to the dom
  connectedCallback() {
    // Get the href from the element (ex. <uni-market-nav href="../index.html"> </uni-market-nav>)
    const href = this.getAttribute("href") || "#";
    // find an a tag in the shadow-DOM and replace with the new href
    this.shadowRoot.querySelector("a").setAttribute("href", href);

    this._authObserver.observe(({ user }) => {
      if (user && user.username !== this.userid) {
        this.userid = user.username;
      }
    });
  }

  get userid() {
    return this._userid.textContent;
  }

  set userid(id) {
    if (id === "anonymous") {
      this._userid.textContent = "";
      this._signout.disabled = true;
    } else {
      this._userid.textContent = id;
      this._signout.disabled = false;
    }
  }

  constructor() {
    super();
    shadow(this)
      .template(UniMarketNav.template)
      .styles(reset.styles, UniMarketNav.styles);

    this._userid = this.shadowRoot.querySelector("#userid");
    this._signout = this.shadowRoot.querySelector("#signout");

    this._signout.addEventListener("click", (event) =>
      Events.relay(event, "auth:message", ["auth/signout"])
    );
  }
}
