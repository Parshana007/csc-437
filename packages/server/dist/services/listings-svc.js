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
  getAllListings: () => getAllListings,
  getListing: () => getListing
});
module.exports = __toCommonJS(listings_svc_exports);
const marketListings = {
  listings: [
    {
      name: "Coffee Table",
      description: "IKEA white laminate coffee table. Top opens up for storage. 45.5\u201D l x 27.5\u201D w x 16\u201D h",
      price: 60,
      listedDate: /* @__PURE__ */ new Date("2024-09-28"),
      condition: "Used - Almost New",
      pickUpLocation: {
        name: "Library",
        locationType: "address"
      },
      seller: {
        name: "Sam",
        contactInfo: "samsullivan@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sam.html"
      },
      featuredImage: "/packages/proto/public/assets/coffeeTable.jpg"
    },
    {
      name: "Computer",
      description: "Dell Inspiron laptop. 15.6\u201D screen, 8GB RAM, 512GB SSD, Windows 11.",
      price: 350,
      listedDate: /* @__PURE__ */ new Date("2024-10-05"),
      condition: "Used - Good",
      pickUpLocation: {
        name: "Library",
        locationType: "address"
      },
      seller: {
        name: "Sam",
        contactInfo: "samsullivan@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sam.html"
      },
      featuredImage: "/packages/proto/public/assets/computer.jpg"
    },
    {
      name: "Couch",
      description: "3-seater fabric couch. Light grey, comfortable, in great condition.",
      price: 120,
      listedDate: /* @__PURE__ */ new Date("2024-10-10"),
      condition: "Used - Almost New",
      pickUpLocation: {
        name: "Student Union",
        locationType: "address"
      },
      seller: {
        name: "Sally",
        contactInfo: "sallysmith@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sally.html"
      },
      featuredImage: "/packages/proto/public/assets/couch.jpg"
    },
    {
      name: "Desk",
      description: "Wooden desk with 3 drawers. 48\u201D x 24\u201D, perfect for home office.",
      price: 80,
      listedDate: /* @__PURE__ */ new Date("2024-10-12"),
      condition: "Used - Good",
      pickUpLocation: {
        name: "123 Main St, San Luis Obispo",
        locationType: "address"
      },
      seller: {
        name: "Sam",
        contactInfo: "samsullivan@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sam.html"
      },
      featuredImage: "/packages/proto/public/assets/desk.jpg"
    },
    {
      name: "Headphones",
      description: "Sony noise-canceling wireless headphones, barely used.",
      price: 90,
      listedDate: /* @__PURE__ */ new Date("2024-10-15"),
      condition: "Used - Almost New",
      pickUpLocation: {
        name: "101 Maple Rd, San Luis Obispo",
        locationType: "address"
      },
      seller: {
        name: "Sally",
        contactInfo: "sallysmith@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sally.html"
      },
      featuredImage: "/packages/proto/public/assets/headphones.jpg"
    },
    {
      name: "Lights",
      description: "Set of 3 vintage-style table lamps. Good working condition.",
      price: 30,
      listedDate: /* @__PURE__ */ new Date("2024-10-18"),
      condition: "Used - Good",
      pickUpLocation: {
        locationType: "disclosed in communication"
      },
      seller: {
        name: "Sam",
        contactInfo: "samsullivan@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sam.html"
      },
      featuredImage: "/packages/proto/public/assets/lights.jpg"
    },
    {
      name: "Microwave",
      description: "Samsung countertop microwave, 700W, clean and functional.",
      price: 45,
      listedDate: /* @__PURE__ */ new Date("2024-10-20"),
      condition: "Used - Good",
      pickUpLocation: {
        name: "123 Main St, San Luis Obispo",
        locationType: "address"
      },
      seller: {
        name: "Sally",
        contactInfo: "sallysmith@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sally.html"
      },
      featuredImage: "/packages/proto/public/assets/microwave.jpg"
    },
    {
      name: "Painting",
      description: "Abstract painting on canvas. 24\u201D x 36\u201D frame included.",
      price: 150,
      listedDate: /* @__PURE__ */ new Date("2024-10-22"),
      condition: "Used - Almost New",
      pickUpLocation: {
        name: "Dexter Lawn",
        locationType: "address"
      },
      seller: {
        name: "Sam",
        contactInfo: "samsullivan@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sam.html"
      },
      featuredImage: "/packages/proto/public/assets/painting.jpg"
    },
    {
      name: "Pillow",
      description: "Set of 2 plush throw pillows, soft and in excellent condition.",
      price: 15,
      listedDate: /* @__PURE__ */ new Date("2024-10-25"),
      condition: "Used - Good",
      pickUpLocation: {
        name: "PCV",
        locationType: "disclosed in communication"
      },
      seller: {
        name: "Sally",
        contactInfo: "sallysmith@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sally.html"
      },
      featuredImage: "/packages/proto/public/assets/pillow.jpg"
    },
    {
      name: "Pot",
      description: "Large ceramic plant pot, no cracks or chips.",
      price: 20,
      listedDate: /* @__PURE__ */ new Date("2024-10-28"),
      condition: "Used - Good",
      pickUpLocation: {
        name: "Bonderson Parking Lot",
        locationType: "address"
      },
      seller: {
        name: "Sam",
        contactInfo: "samsullivan@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sam.html"
      },
      featuredImage: "/packages/proto/public/assets/pot.jpg"
    },
    {
      name: "Printer",
      description: "HP LaserJet printer, color printing, recently serviced.",
      price: 100,
      listedDate: /* @__PURE__ */ new Date("2024-10-30"),
      condition: "Used - Good",
      pickUpLocation: {
        name: "UU",
        locationType: "disclosed in communication"
      },
      seller: {
        name: "Sally",
        contactInfo: "sallysmith@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sally.html"
      },
      featuredImage: "/packages/proto/public/assets/printer.jpg"
    },
    {
      name: "Sweater",
      description: "Wool sweater, navy blue, size M, gently worn.",
      price: 25,
      listedDate: /* @__PURE__ */ new Date("2024-11-01"),
      condition: "Used - Almost New",
      pickUpLocation: {
        name: "UU",
        locationType: "address"
      },
      seller: {
        name: "Sam",
        contactInfo: "samsullivan@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sam.html"
      },
      featuredImage: "/packages/proto/public/assets/sweater.jpg"
    },
    {
      name: "Table",
      description: "Wooden dining table, 5' x 3', perfect for a small apartment.",
      price: 150,
      listedDate: /* @__PURE__ */ new Date("2024-11-03"),
      condition: "Used - Good",
      pickUpLocation: {
        name: "Front Porch",
        locationType: "address"
      },
      seller: {
        name: "Sally",
        contactInfo: "sallysmith@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sally.html"
      },
      featuredImage: "/packages/proto/public/assets/diningTable.jpg"
    },
    {
      name: "TV",
      description: "Samsung 55\u201D smart TV, excellent condition, remote included.",
      price: 300,
      listedDate: /* @__PURE__ */ new Date("2024-11-05"),
      condition: "Used - Almost New",
      pickUpLocation: {
        locationType: "disclosed in communication"
      },
      seller: {
        name: "Sam",
        contactInfo: "samsullivan@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sam.html"
      },
      featuredImage: "/packages/proto/public/assets/tv.jpg"
    },
    {
      name: "Twin Bed",
      description: "Twin-size platform bed frame, metal, with headboard.",
      price: 50,
      listedDate: /* @__PURE__ */ new Date("2024-11-08"),
      condition: "Used - Good",
      pickUpLocation: {
        name: "Kennedy Library",
        locationType: "address"
      },
      seller: {
        name: "Sally",
        contactInfo: "sallysmith@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sally.html"
      },
      featuredImage: "/packages/proto/public/assets/twinBed.jpg"
    },
    {
      name: "Washer",
      description: "Compact washing machine, great for apartments, works perfectly.",
      price: 120,
      listedDate: /* @__PURE__ */ new Date("2024-11-10"),
      condition: "Used - Almost New",
      pickUpLocation: {
        name: "Dexter Lawn",
        locationType: "address"
      },
      seller: {
        name: "Sam",
        contactInfo: "samsullivan@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sam.html"
      },
      featuredImage: "/packages/proto/public/assets/washer.jpg"
    }
  ]
};
function getListing(name) {
  return marketListings.listings.find((listing) => listing.name === name) || null;
}
function getAllListings() {
  return marketListings.listings;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getAllListings,
  getListing
});
