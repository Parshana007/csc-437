import { define, View, Form } from "@calpoly/mustang";
import { css, html } from "lit";
import { state, property } from "lit/decorators.js";
import { User } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../styles/reset.css";
import { Types } from "mongoose";

export class UserViewProfile extends View<Model, Msg> {
  static uses = define({
    "mu-form": Form.Element,
  });
  @property()
  userid?: string;

  @property({ reflect: true })
  mode = "view";

  @state()
  get user(): User | undefined {
    return this.model.user;
  }

  constructor() {
    super("blazing:model");

    this.addEventListener("mu-form:submit", (event) => {
      const customEvent = event as CustomEvent<{
        _id: string;
        contactInfo: string;
        name: string;
        profilePic: string;
      }>;
      this.handleFormSubmit(customEvent.detail);
    });
  }

  handleFormSubmit(formData: {
    _id: string;
    contactInfo: string;
    name: string;
    profilePic: string;
  }) {
    console.log("Form data:", formData);
    this.dispatchMessage([
      "profile/save",
      {
        userid: formData._id,
        user: {
          ...formData,
          _id: new Types.ObjectId(formData._id), // Convert _id to ObjectId
        },
        onSuccess: () => {
          console.log("Profile saved successfully!");
          this.mode = "view"; // Return to view mode
        },
        onFailure: (error: Error) => {
          console.error("Failed to save profile:", error);
        },
      },
    ]);
  }

  attributeChangedCallback(
    name: string,
    old: string | null,
    value: string | null
  ) {
    console.log(`Attribute changed: ${name}, Old: ${old}, New: ${value}`);
    super.attributeChangedCallback(name, old, value);

    if (name === "userid" && old !== value && value)
      this.dispatchMessage(["profile/select", { userid: value }]);
  }

  protected render() {
    const { name, contactInfo, profilePic } = this.user || {};
    console.log("this.user", this.user);

    return html`
      <section class="view">
        <main class="center-container">
          <section class="userProfile">
            <div class="userPhoto-container">
              <img src="/assets/${profilePic}" alt=${name} />
            </div>
            <h2>${name}</h2>
            <section class="userDescription">
              <dl>
                <dt>Contact Information</dt>
                <dd>${contactInfo}</dd>
              </dl>
              <button
                class="edit"
                id="edit"
                @click=${() => (this.mode = "edit")}
              >
                Edit
              </button>
            </section>
          </section>
        </main>
      </section>
      <mu-form class="edit" .init=${this.user}>
        <main class="center-container">
          <section class="formContent">
            <label>
              <span>User Name</span>
              <input name="name" />
            </label>
            <label>
              <span>Contact Information</span>
              <input name="contactInfo" />
            </label>
          </section>
        </main>
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

      .userPhoto-container img {
        width: 15rem;
        height: 15rem;
      }

      .userDescription {
        display: flex;
        align-items: center;
        flex-direction: column;
      }

      .center-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .formContent {
        display: flex;
        flex-direction: column;
        background-color: var(--color-eggplant);
        padding: var(--content-size-xlarge);
        gap: 5px;
        width: 80%;
        max-width: 600px;
        margin-bottom: var(--content-size-medium);
      }

      button {
        background-color: var(--color-sage);
        border-radius: 8px;
        border-style: none;
        box-sizing: border-box;
        color: #ffffff;
        cursor: pointer;
        display: inline-block;
        font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial,
          sans-serif;
        font-size: 14px;
        font-weight: 500;
        height: 40px;
        line-height: 20px;
        list-style: none;
        margin: 0;
        outline: none;
        padding: 10px 16px;
        position: relative;
        text-align: center;
        text-decoration: none;
        transition: color 100ms;
        vertical-align: baseline;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        margin-top: 10px;
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
