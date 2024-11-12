"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var listings_svc_exports = {};
__export(listings_svc_exports, {
  default: () => listings_svc_default
});
module.exports = __toCommonJS(listings_svc_exports);
var import_mongoose = require("mongoose");
const UserSchema = new import_mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contactInfo: { type: String, required: true, trim: true },
    profilePic: { type: String, required: true, trim: true }
  },
  { collection: "market_users" }
);
const ListingSchema = new import_mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    listedDate: { type: Date, required: true, trim: true },
    condition: {
      type: String,
      enum: [
        "New",
        "Used - Almost New",
        "Used - Good",
        "Used - Fair",
        "Refurbished",
        "For Parts or Repair"
      ],
      required: true
    },
    pickUpLocation: { type: String, required: true, trim: true },
    seller: { type: UserSchema, ref: "Profile", required: true },
    featuredImage: { type: String, required: true, trim: true }
  },
  { collection: "market_listings" }
);
const ListingModel = (0, import_mongoose.model)("Listings", ListingSchema);
function index() {
  return ListingModel.find();
}
function getAllListings() {
  return ListingModel.find();
}
function get(listingName) {
  return ListingModel.find({ name: listingName }).then((list) => list[0]).catch((err) => {
    throw `${listingName} Not Found`;
  });
}
function create(json) {
  const l = new ListingModel(json);
  return l.save();
}
function update(listingName, listing) {
  return ListingModel.findOneAndUpdate({ name: listingName }, listing, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${listingName} not updated`;
    else return updated;
  });
}
function remove(listingName) {
  return ListingModel.findOneAndDelete({ name: listingName }).then(
    (deleted) => {
      if (!deleted) throw `${listingName} not deleted`;
    }
  );
}
var listings_svc_default = { index, get, create, update, remove, getAllListings };
