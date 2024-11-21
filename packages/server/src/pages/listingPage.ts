import { css, html } from "@calpoly/mustang/server";
import { Listing } from "../models";
import renderPage from "./renderPage"; // generic page renderer

export class ListingPage {
  data: Listing;

  constructor(data: Listing) {
    this.data = data;
  }

  render() {
    return renderPage({
      body: this.renderBody(),
      stylesheets: ["/styles/listing.css"],
      scripts: [
        `import { define } from "@calpoly/mustang";
        import { UniListing } from "../js/uni-listing.js";

        define({
            "uni-listing": UniListing,
        });`,
      ],
    });
  }

  renderBody() {
    const { name } = this.data;

    return html`
      <mu-auth provides="blazing:auth">
        <uni-market-nav href="/listings"> </uni-market-nav>
        <uni-listing href="/listings" src="/api/listings/${name}">
        </uni-listing>
      </mu-auth>
    `;
  }
}
