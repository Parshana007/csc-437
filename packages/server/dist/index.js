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
var import_users_svc = __toESM(require("./services/users-svc"));
var import_listings_svc = __toESM(require("./services/listings-svc"));
var import_users = __toESM(require("./routes/users"));
var import_listings = __toESM(require("./routes/listings"));
var import_mongo = require("./services/mongo");
var import_auth = __toESM(require("./routes/auth"));
var import_auth2 = require("./pages/auth");
var import_promises = __toESM(require("node:fs/promises"));
var import_path = __toESM(require("path"));
var import_express = __toESM(require("express"));
(0, import_mongo.connect)("UniMarket");
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
app.use(import_express.default.json());
app.use(import_express.default.static(staticDir));
app.use("/api/listings", import_auth.authenticateUser, import_listings.default);
app.use("/api/users", import_auth.authenticateUser, import_users.default);
app.use("/auth", import_auth.default);
app.get("/login", (req, res) => {
  const page = new import_auth2.LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});
app.get("/register", (req, res) => {
  const page = new import_auth2.RegistrationPage();
  res.set("Content-Type", "text/html").send(page.render());
});
app.get("/hello", (req, res) => {
  res.send("Hello, World");
});
app.get("/listings", (req, res) => {
  import_listings_svc.default.getAllListings().then((listings2) => {
    const data = { listings: listings2 };
    const page = new import_marketPlacePage.MarketPlacePage(data);
    res.set("Content-Type", "text/html").send(page.render());
  }).catch((err) => {
    console.error("Error fetching listings:", err);
    res.status(500).send("Error fetching listings");
  });
});
app.get("/listings/:listing", (req, res) => {
  const { listing } = req.params;
  import_listings_svc.default.get(listing).then((data) => {
    const page = new import_listingPage.ListingPage(data);
    res.set("Content-Type", "text/html").send(page.render());
  });
});
app.get("/users/:userId", (req, res) => {
  const { userId } = req.params;
  import_users_svc.default.get(userId).then((data) => {
    const page = new import_userPage.UserPage(data);
    res.set("Content-Type", "text/html").send(page.render());
  });
});
app.use("/app", (req, res) => {
  const indexHtml = import_path.default.resolve(staticDir, "index.html");
  import_promises.default.readFile(indexHtml, { encoding: "utf8" }).then(
    (html) => res.send(html)
  );
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
