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
        import { ListingHeader } from "../js/listing-header.js";
        import { UnimarketListings } from "../js/uni-market-listings.js";

        define({
            "listing-header": ListingHeader,
            "uni-market-listings": UnimarketListings
        });`,
      ],
    });
  }

  renderBody() {
    return html`<uni-market-nav href="/listings"></uni-market-nav>
      <uni-market-listings src="/api/listings"></uni-market-listings> `;
  }
}
