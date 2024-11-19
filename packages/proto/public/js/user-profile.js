import { css, html, shadow, Auth, Observer } from "@calpoly/mustang";
import reset from "./reset.css.js";

export class UserProfile extends HTMLElement {
  static template = html`
    <template>
      <mu-auth provides="blazing:auth">
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
            </section>
          </section>
        </main>
      </mu-auth>
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
    if (this.src) this.hydrate(this.src);

    define({
      "mu-auth": Auth.Provider,
    });

    this._authObserver.observe(({ user }) => {
      this._user = user;
    });
  }

  hydrate(url) {
    fetch(url, { headers: this.authorization })
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => this.renderSlots(json))
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
  }
}
