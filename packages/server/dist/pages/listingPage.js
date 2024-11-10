"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var listingPage_exports = {};
__export(listingPage_exports, {
  ListingPage: () => ListingPage
});
module.exports = __toCommonJS(listingPage_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class ListingPage {
  data;
  constructor(data) {
    this.data = data;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      stylesheets: ["/styles/listing.css"],
      scripts: [
        `import { define } from "@calpoly/mustang";
        import { UniListing } from "../js/uni-listing.js";

        define({
            "uni-listing": UniListing,
        });`
      ]
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
      featuredImage
    } = this.data;
    const formattedDate = listedDate.toLocaleDateString();
    let locationText = "";
    if (pickUpLocation.locationType === "address") {
      locationText = pickUpLocation.address || "Address not provided";
    } else if (pickUpLocation.locationType === "disclosed in communication") {
      locationText = "Location disclosed in communication";
    }
    return import_server.html`<uni-market-nav></uni-market-nav>
    <uni-listing>
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
        <span slot="seller"><a href="../users/${seller.name}">${seller.name}</a></span>
      </uni-listing>`;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ListingPage
});
