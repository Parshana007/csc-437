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
var listings_exports = {};
__export(listings_exports, {
  default: () => listings_default
});
module.exports = __toCommonJS(listings_exports);
var import_express = __toESM(require("express"));
var import_listings_svc = __toESM(require("../services/listings-svc"));
const router = import_express.default.Router();
router.get("/", (_, res) => {
  import_listings_svc.default.index().then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.post("/", (req, res) => {
  const newListing = req.body;
  import_listings_svc.default.create(newListing).then((user) => res.status(201).json(user)).catch((err) => res.status(500).send(err));
});
router.get("/:listing", (req, res) => {
  const { listing } = req.params;
  import_listings_svc.default.get(listing).then((listing2) => res.json(listing2)).catch((err) => res.status(404).send(err));
});
router.put("/:listingName", (req, res) => {
  const { listingName } = req.params;
  const newListing = req.body;
  import_listings_svc.default.update(listingName, newListing).then((listing) => res.json(listing)).catch((err) => res.status(404).end());
});
router.delete("/:listingName", (req, res) => {
  const { listingName } = req.params;
  import_listings_svc.default.remove(listingName).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
var listings_default = router;
