import {
  css,
  html,
  shadow,
  Auth,
  Observer,
  define,
  Form,
  InputArray,
} from "@calpoly/mustang";
import reset from "./reset.css.js";

export class UserProfile extends HTMLElement {
  static uses = define({
    "mu-form": Form.Element,
    "input-array": InputArray.Element,
  });
  static template = html`
    <template>
      <section class="view">
        <main class="center-container">
          <section class="userProfile">
            <div class="userPhoto-container">
              <slot name="profilePic"></slot>
            </div>
            <h2><slot name="name">User Name</slot></h2>
            <section class="userDescription">
              <dl>
                <dt>Contact Information</dt>
                <dd><slot name="contactInfo">ContactInfo</slot></dd>
              </dl>
              <button id="edit">Edit</button>
            </section>
          </section>
        </main>
      </section>
      <mu-form class="edit">
        <label>
          <span>User Name</span>
          <input name="name" />
        </label>
        <label>
          <span>Contact Information</span>
          <input name="contactInfo" />
        </label>
      </mu-form>
    </template>
  `;

  static styles = css`
    .userProfile {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: var(--color-eggplant);
      padding: var(--content-size-xlarge);
      width: 80%;
      max-width: 600px;
      margin-bottom: var(--content-size-medium);
    }

    .userPhoto-container {
      width: 15rem;
      height: 15rem;
    }

    .userDescription dl {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-gap: 0.5rem;
      width: 100%;
    }

    .userDescription dt {
      text-align: right;
      font-weight: bold;
    }

    .userDescription dd {
      text-align: left;
      margin: 0;
    }

    a {
      color: var(--color-link);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .center-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    :host {
      display: contents;
    }
    :host([mode="edit"]),
    :host([mode="new"]) {
      --display-view-none: none;
    }
    :host([mode="view"]) {
      --display-editor-none: none;
    }
    section.view {
      display: var(--display-view-none, grid);
      grid-template-columns: subgrid;
      gap: inherit;
      gap: var(--size-spacing-medium) var(--size-spacing-xlarge);
      align-items: end;
      grid-column: 1 / -1;
    }
    mu-form.edit {
      display: var(--display-editor-none, grid);
      grid-column: 1/-1;
      grid-template-columns: subgrid;
    }
  `;

  _authObserver = new Observer(this, "blazing:auth");

  get src() {
    return this.getAttribute("src");
  }

  get authorization() {
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${this._user.token}`,
      }
    );
  }

  connectedCallback() {
    this._authObserver.observe(({ user }) => {
      this._user = user;
      if (this.src) this.hydrate(this.src);
    });

    if (!this.mode) {
      this.mode = "view"; // Default to 'view' mode
    }
  }

  get form() {
    return this.shadowRoot.querySelector("mu-form.edit");
  }

  get mode() {
    return this.getAttribute("mode");
  }

  set mode(m) {
    this.setAttribute("mode", m);
  }

  get editButton() {
    return this.shadowRoot.getElementById("edit");
  }

  submit(url, json) {
    fetch(url, {
      headers: { "Content-Type": "application/json", ...this.authorization },
      method: "PUT",
      body: JSON.stringify(json),
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        this.renderSlots(json);
        this.form.init = json;
        this.mode = "view";
      })
      .catch((error) =>
        console.log(`Failed to render data on submit ${url}:`, error)
      );
  }

  hydrate(url) {
    fetch(url, {
      headers: { "Content-Type": "application/json", ...this.authorization },
      method: "GET",
    })
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => {
        this.renderSlots(json);
        this.form.init = json; // populate mu-form
      })
      .catch((error) => console.log(`Failed to render data ${url}:`, error));
  }

  renderSlots(json) {
    const entries = Object.entries(json);
    const toSlot = ([key, value]) => {
      if (key == "profilePic") {
        return html`<img
          slot="profilePic"
          src="../assets/${value}"
          alt=${value}
        />`;
      }
      return html`<span slot="${key}">${value}</span>`;
    };

    const fragment = entries.map(toSlot);
    this.replaceChildren(...fragment);
  }

  _authObserver = new Observer(this, "blazing:auth");

  constructor() {
    super();
    shadow(this)
      .template(UserProfile.template)
      .styles(reset.styles, UserProfile.styles);

    this.addEventListener("mu-form:submit", (event) => {
      this.submit(this.src, event.detail);
    });

    this.editButton.addEventListener("click", () => (this.mode = "edit"));
  }
}
