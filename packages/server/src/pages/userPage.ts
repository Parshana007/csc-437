import { css, html } from "@calpoly/mustang/server";
import { Listing } from "../models";
import renderPage from "./renderPage"; // generic page renderer
import { User } from "models/user";

export class UserPage {
  data: User;

  constructor(data: User) {
    this.data = data;
  }

  render() {
    return renderPage({
      body: this.renderBody(),
      stylesheets: ["/styles/user.css"],
      scripts: [
        `import { define } from "@calpoly/mustang";
        import { UserProfile } from "/scripts/user-profile.js";

        define({
            "user-profile": UserProfile,
        });`,
      ],
    });
  }

  renderBody() {
    const { _id } = this.data;
    const idString = _id?.toString() || "unknown";
    return html`
      <mu-auth provides="blazing:auth">
        <uni-market-nav></uni-market-nav>
        <user-profile src="/api/users/${idString}"></user-profile>
      </mu-auth>
    `;
  }
}
