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

        define({
            "listing-header": ListingHeader,
        });`,
      ],
    });
  }

  renderBody() {
    const { listings } = this.data;
    const listingList = listings.map((item) => this.renderListing(item));
    return html` <section class="listings">${listingList}</section> `;
  }

  renderListing(list: Listing) {
    const { name, price, featuredImage } = list;

    return html`
      <listing-header>
        <img slot="image" src="./assets/${featuredImage}" alt="${name}" />
        <span slot="listingName">
          <a href="./listing/${name.replace(/\s+/g, "")}.html">${name}</a>
        </span>
        <span slot="price">Price: $${price}</span>
      </listing-header>
    `;
  }
}
