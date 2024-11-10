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
var users_svc_exports = {};
__export(users_svc_exports, {
  default: () => users_svc_default
});
module.exports = __toCommonJS(users_svc_exports);
var import_mongoose = require("mongoose");
const UserSchema = new import_mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contactInfo: { type: String, required: true, trim: true },
    profilePic: { type: String, required: true, trim: true }
  },
  { collection: "market_users" }
);
const UserModel = (0, import_mongoose.model)("Profile", UserSchema);
function index() {
  return UserModel.find();
}
function get(userName) {
  return UserModel.find({ name: userName }).then((list) => list[0]).catch((err) => {
    throw `${userName} Not Found`;
  });
}
function create(json) {
  const u = new UserModel(json);
  return u.save();
}
function update(userName, user) {
  return UserModel.findOneAndUpdate({ name: userName }, user, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${userName} not updated`;
    else return updated;
  });
}
function remove(userName) {
  return UserModel.findOneAndDelete({ name: userName }).then((deleted) => {
    if (!deleted) throw `${userName} not deleted`;
  });
}
var users_svc_default = { index, get, create, update, remove };
