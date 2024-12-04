import { css, html, shadow, Observer, Events } from "@calpoly/mustang";
// import reset from "../styles/";

export class UniMarketNav extends HTMLElement {
  static template = html`
    <template>
      <header>
        <main class="navBar">
          <a href="/app">
            <h1 class="navBar">
              <svg class="icon-market">
                <use href="/assets/icons.svg#icon-market" />
              </svg>
              <span>UniMarket</span>
            </h1>
          </a>
          <section class="navInfo">
            <a slot="actuator">
              Hello,
              <span id="userid"></span>
            </a>
            <div class="dropdown">
              <button class="dropbtn">Menu</button>
              <!-- Conditionally render Sign Out/Sign In links -->
              <div class="dropdown-content">
                <label
                  onchange="relayEvent(
            event,
            'dark-mode',
            {checked: event.target.checked})"
                >
                  <input type="checkbox" autocomplete="off" />
                  Dark mode
                </label>
              </div>
            </div>
          </section>
        </main>
      </header>
    </template>
  `;

  static styles = css`
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
  `;

  _authObserver = new Observer(this, "blazing:auth");

  // runs each time the component is added to the dom
  connectedCallback() {
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
      .styles(UniMarketNav.styles);

    this._userid = this.shadowRoot.querySelector("#userid");
    this._signout = this.shadowRoot.querySelector("#signout");

    this._signout.addEventListener("click", (event) =>
      Events.relay(event, "auth:message", ["auth/signout"])
    );
  }
}
