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
  getUser: () => getUser
});
module.exports = __toCommonJS(users_svc_exports);
const users = {
  userList: [
    {
      name: "Sam",
      contactInfo: "samsullivan@calpoly.edu",
      profilePic: "user.png",
      profileLink: "../users/Sam.html"
    },
    {
      name: "Sally",
      contactInfo: "sallysmith@calpoly.edu",
      profilePic: "user.png",
      profileLink: "../users/Sally.html"
    }
  ]
};
function getUser(name) {
  const user = users.userList.find((user2) => user2.name === name);
  if (!user) {
    throw new Error(`User with name "${name}" not found`);
  }
  return user;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getUser
});
