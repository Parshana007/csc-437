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
    const {
      name,
      description,
      price,
      listedDate,
      condition,
      pickUpLocation,
      seller,
      featuredImage,
    } = this.data;

    const formattedDate = listedDate.toLocaleDateString();

    let locationText = "";
    if (pickUpLocation.locationType === "address") {
      locationText = pickUpLocation.address || "Address not provided";
    } else if (pickUpLocation.locationType === "disclosed in communication") {
      locationText = "Location disclosed in communication";
    }

    return html`<uni-listing>
      <span slot="title">${name}</span>
      <img
        slot="image"
        src="../assets/${featuredImage}"
        alt="IKEA white laminate coffee table"
      />
      <span slot="description">${description}</span>
      <span slot="price">$${price}</span>
      <span slot="listed-date">${formattedDate}</span>
      <span slot="condition">${condition}</span>
      <span slot="location">${locationText}</span>
      <span slot="seller"><a href="../users/${seller.name}">Sam</a></span>
    </uni-listing>`;
  }
}
