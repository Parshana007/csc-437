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
var marketPlacePage_exports = {};
__export(marketPlacePage_exports, {
  MarketPlacePage: () => MarketPlacePage
});
module.exports = __toCommonJS(marketPlacePage_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class MarketPlacePage {
  data;
  constructor(data) {
    this.data = data;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      stylesheets: ["/styles/page.css"],
      scripts: [
        `import { define } from "@calpoly/mustang";
        import { ListingHeader } from "../js/listing-header.js";

        define({
            "listing-header": ListingHeader,
        });`
      ]
    });
  }
  renderBody() {
    const { listings } = this.data;
    const listingList = listings.map((item) => this.renderListing(item));
    return import_server.html` <section class="listings">${listingList}</section> `;
  }
  renderListing(list) {
    const { name, price, featuredImage } = list;
    return import_server.html`
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MarketPlacePage
});
