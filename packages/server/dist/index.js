"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_marketPlacePage = require("./pages/marketPlacePage");
var import_userPage = require("./pages/userPage");
var import_listingPage = require("./pages/listingPage");
var import_listings_svc = require("./services/listings-svc");
var import_users_svc = require("./services/users-svc");
var import_express = __toESM(require("express"));
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
app.use(import_express.default.static(staticDir));
app.get("/hello", (req, res) => {
  res.send("Hello, World");
});
app.get("/listings", (req, res) => {
  const data = { listings: (0, import_listings_svc.getAllListings)() };
  const page = new import_marketPlacePage.MarketPlacePage(data);
  res.set("Content-Type", "text/html").send(page.render());
});
app.get("/listings/:listing", (req, res) => {
  const { listing } = req.params;
  const data = (0, import_listings_svc.getListing)(listing);
  const page = new import_listingPage.ListingPage(data);
  res.set("Content-Type", "text/html").send(page.render());
});
app.get("/users/:userName", (req, res) => {
  const { userName } = req.params;
  const data = (0, import_users_svc.getUser)(userName);
  const page = new import_userPage.UserPage(data);
  res.set("Content-Type", "text/html").send(page.render());
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});