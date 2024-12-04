import {
  Auth,
  Observer,
  define,
  Form,
} from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { User } from "server/models";
import reset from "../styles/reset.css";

export class UserProfile extends LitElement {
  static uses = define({
    "mu-form": Form.Element,
  });

  @property()
  userid?: string;

  @state()
  user?: User;

  @property({ reflect: true })
  mode = "view";

  _authObserver = new Observer<Auth.Model>(this, "blazing:auth");

  _user = new Auth.User();

  get src() {
    return `/api/users/${this.userid}`;
  }

  connectedCallback() {
    super.connectedCallback();
    console.log("UnimarketListings connected");
    this._authObserver.observe(({ user }) => {
      console.log("Auth observer fired:", user);
      if (user) {
        this._user = user;
      }
      this.hydrate(this.src);
    });
  }

  hydrate(url: string) {
    console.log("Fetching listings from:", url);
    fetch(url, {
      headers: Auth.headers(this._user),
    })
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .catch((error) => console.log(`Failed to render data ${url}:`, error))
      .then((json: unknown) => {
        if (json) {
          console.log("User: ", json);
          this.user = json as User;
        }
        // this.renderSlots(json);
        // this.form.init = json; // populate mu-form
      })
      .catch((err) => console.log("Failed to convert user data:", err));
  }

  submit(url: string, json: string) {
    fetch(url, {
      headers: Auth.headers(this._user),
      method: "PUT",
      body: JSON.stringify(json),
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json) {
          console.log("User: ", json);
          this.user = json as User;
        }
        // this.renderSlots(json);
        // this.form.init = json;
        this.mode = "view";
      })
      .catch((error) =>
        console.log(`Failed to render data on submit ${url}:`, error)
      );
  }

  protected render() {
    const { name, contactInfo, profilePic } = this.user || {};

    return html`
      <section class="view">
        <main class="center-container">
          <section class="userProfile">
            <div class="userPhoto-container">
              <img src="/assets/${profilePic}" alt=${name}/>
            </div>
            <h2>${name}</h2>
            <section class="userDescription">
              <dl>
                <dt>Contact Information</dt>
                <dd>${contactInfo}</dd>
              </dl>
              <button id="edit" @click=${() => (this.mode = "edit")}>
                Edit
              </button>
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
    `;
  }

  static styles = [
    reset.styles,
    css`
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
    `,
  ];
}
