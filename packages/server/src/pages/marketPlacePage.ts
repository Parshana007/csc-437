import { css, html } from "@calpoly/mustang/server";
import { Listing } from "../models";
import renderPage from "./renderPage"; // generic page renderer
import { MarketListings } from "models/marketListings";

export class MarketPlacePage {
  data: MarketListings;

  constructor(data: MarketListings) {
    this.data = data;
  }

  render() {
    return renderPage({
      body: this.renderBody(),
      stylesheets: ["/styles/page.css"],
      scripts: [
        `import { define } from "@calpoly/mustang";
        import { ListingHeader } from "../scripts/listing-header.js";
        import { UnimarketListings } from "../scripts/uni-market-listings.js";

        define({
            "listing-header": ListingHeader,
            "uni-market-listings": UnimarketListings
        });`,
      ],
    });
  }

  renderBody() {
    return html`
      <mu-auth provides="blazing:auth">
        <uni-market-nav></uni-market-nav>
        <uni-market-listings src="/api/listings"></uni-market-listings>
      </mu-auth>
    `;
  }
}
