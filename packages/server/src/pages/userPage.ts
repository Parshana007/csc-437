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
        import { UserProfile } from "../js/user-profile.js";

        define({
            "user-profile": UserProfile,
        });`,
      ],
    });
  }

  renderBody() {
    const { name, contactInfo, profilePic } = this.data;
    return html`
      <uni-market-nav></uni-market-nav>
      <user-profile src="/api/users/Sam"></user-profile>
    `;
  }
}
