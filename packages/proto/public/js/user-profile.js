import { css, html, shadow } from "@calpoly/mustang";
import reset from "./reset.css.js";

export class UserProfile extends HTMLElement {
  static template = html`
    <template>
      <main class="center-container">
        <section class="userProfile">
          <div class="userPhoto-container">
            <slot name="userPhoto"></slot>
          </div>
          <h2><slot name="userName">User Name</slot></h2>
          <section class="userDescription">
            <dl>
              <dt>Contact Information</dt>
              <dd><slot name="contactInfo">ContactInfo</slot></dd>
            </dl>
          </section>
        </section>
      </main>
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

  constructor() {
    super();
    shadow(this).template(UserProfile.template).styles(reset.styles, UserProfile.styles);
  }
}
