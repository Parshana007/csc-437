import { Listing } from "../models/listing";
import { PickupLocation } from "../models/geo";
import { Condition } from "../models/listing";
import { Schema, model } from "mongoose";

const PickupLocationSchema = new Schema<PickupLocation>({
    name: { type: String, trim: true },
    address: { type: String, trim: true },
    locationType: { type: String, enum: ["address", "disclosed in communication"], required: true },
  });

const ListingSchema = new Schema<Listing>(
  {
    name: { type: String, required: true},
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
        "For Parts or Repair",
      ],
      required: true,
    },
    pickUpLocation: { type: PickupLocationSchema, required: true },
    seller: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    featuredImage: { type: String, required: true, trim: true },
  },
  { collection: "market_listings" }
);

const ListingModel = model<Listing>("market_listings", ListingSchema);

function index(): Promise<Listing[]> {
  return ListingModel.find();
}

// function getAllListings(): Promise<Listing[]> {
//     return ListingModel.find()
// }

function get(listingName: String): Promise<Listing> {
  return ListingModel.find({ name: listingName })
    .then((list) => list[0])
    .catch((err) => {
      throw `${listingName} Not Found`;
    });
}

export default { index, get};












const marketListings = {
  listings: [
    {
      name: "Coffee Table",
      description:
        "IKEA white laminate coffee table. Top opens up for storage. 45.5” l x 27.5” w x 16” h",
      price: 60,
      listedDate: new Date("2024-09-28"),
      condition: "Used - Almost New" as Condition,
      pickUpLocation: {
        name: "Library",
        locationType: "address",
      } as PickupLocation,
      seller: {
        name: "Sam",
        contactInfo: "samsullivan@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sam.html",
      },
      featuredImage: "coffeeTable.jpg",
    },
    {
      name: "Computer",
      description:
        "Dell Inspiron laptop. 15.6” screen, 8GB RAM, 512GB SSD, Windows 11.",
      price: 350,
      listedDate: new Date("2024-10-05"),
      condition: "Used - Good" as Condition,
      pickUpLocation: {
        name: "Library",
        locationType: "address",
      } as PickupLocation,
      seller: {
        name: "Sam",
        contactInfo: "samsullivan@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sam.html",
      },
      featuredImage: "computer.jpg",
    },
    {
      name: "Couch",
      description:
        "3-seater fabric couch. Light grey, comfortable, in great condition.",
      price: 120,
      listedDate: new Date("2024-10-10"),
      condition: "Used - Almost New" as Condition,
      pickUpLocation: {
        name: "Student Union",
        locationType: "address",
      } as PickupLocation,
      seller: {
        name: "Sally",
        contactInfo: "sallysmith@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sally.html",
      },
      featuredImage: "couch.jpg",
    },
    {
      name: "Desk",
      description:
        "Wooden desk with 3 drawers. 48” x 24”, perfect for home office.",
      price: 80,
      listedDate: new Date("2024-10-12"),
      condition: "Used - Good" as Condition,
      pickUpLocation: {
        name: "123 Main St, San Luis Obispo",
        locationType: "address",
      } as PickupLocation,
      seller: {
        name: "Sam",
        contactInfo: "samsullivan@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sam.html",
      },
      featuredImage: "desk.jpg",
    },
    {
      name: "Headphones",
      description: "Sony noise-canceling wireless headphones, barely used.",
      price: 90,
      listedDate: new Date("2024-10-15"),
      condition: "Used - Almost New" as Condition,
      pickUpLocation: {
        name: "101 Maple Rd, San Luis Obispo",
        locationType: "address",
      } as PickupLocation,
      seller: {
        name: "Sally",
        contactInfo: "sallysmith@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sally.html",
      },
      featuredImage: "headphones.jpg",
    },
    {
      name: "Lights",
      description:
        "Set of 3 vintage-style table lamps. Good working condition.",
      price: 30,
      listedDate: new Date("2024-10-18"),
      condition: "Used - Good" as Condition,
      pickUpLocation: {
        locationType: "disclosed in communication",
      } as PickupLocation,
      seller: {
        name: "Sam",
        contactInfo: "samsullivan@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sam.html",
      },
      featuredImage: "lights.jpg",
    },
    {
      name: "Microwave",
      description: "Samsung countertop microwave, 700W, clean and functional.",
      price: 45,
      listedDate: new Date("2024-10-20"),
      condition: "Used - Good" as Condition,
      pickUpLocation: {
        name: "123 Main St, San Luis Obispo",
        locationType: "address",
      } as PickupLocation,
      seller: {
        name: "Sally",
        contactInfo: "sallysmith@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sally.html",
      },
      featuredImage: "microwave.jpg",
    },
    {
      name: "Painting",
      description: "Abstract painting on canvas. 24” x 36” frame included.",
      price: 150,
      listedDate: new Date("2024-10-22"),
      condition: "Used - Almost New" as Condition,
      pickUpLocation: {
        name: "Dexter Lawn",
        locationType: "address",
      } as PickupLocation,
      seller: {
        name: "Sam",
        contactInfo: "samsullivan@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sam.html",
      },
      featuredImage: "painting.jpg",
    },
    {
      name: "Pillow",
      description:
        "Set of 2 plush throw pillows, soft and in excellent condition.",
      price: 15,
      listedDate: new Date("2024-10-25"),
      condition: "Used - Good" as Condition,
      pickUpLocation: {
        name: "PCV",
        locationType: "disclosed in communication",
      } as PickupLocation,
      seller: {
        name: "Sally",
        contactInfo: "sallysmith@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sally.html",
      },
      featuredImage: "pillow.jpg",
    },
    {
      name: "Pot",
      description: "Large ceramic plant pot, no cracks or chips.",
      price: 20,
      listedDate: new Date("2024-10-28"),
      condition: "Used - Good" as Condition,
      pickUpLocation: {
        name: "Bonderson Parking Lot",
        locationType: "address",
      } as PickupLocation,
      seller: {
        name: "Sam",
        contactInfo: "samsullivan@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sam.html",
      },
      featuredImage: "cookingPot.jpg",
    },
    {
      name: "Printer",
      description: "HP LaserJet printer, color printing, recently serviced.",
      price: 100,
      listedDate: new Date("2024-10-30"),
      condition: "Used - Good" as Condition,
      pickUpLocation: {
        name: "UU",
        locationType: "disclosed in communication",
      } as PickupLocation,
      seller: {
        name: "Sally",
        contactInfo: "sallysmith@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sally.html",
      },
      featuredImage: "printer.jpg",
    },
    {
      name: "Sweater",
      description: "Wool sweater, navy blue, size M, gently worn.",
      price: 25,
      listedDate: new Date("2024-11-01"),
      condition: "Used - Almost New" as Condition,
      pickUpLocation: {
        name: "UU",
        locationType: "address",
      } as PickupLocation,
      seller: {
        name: "Sam",
        contactInfo: "samsullivan@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sam.html",
      },
      featuredImage: "sweater.jpg",
    },
    {
      name: "Table",
      description:
        "Wooden dining table, 5' x 3', perfect for a small apartment.",
      price: 150,
      listedDate: new Date("2024-11-03"),
      condition: "Used - Good" as Condition,
      pickUpLocation: {
        name: "Front Porch",
        locationType: "address",
      } as PickupLocation,
      seller: {
        name: "Sally",
        contactInfo: "sallysmith@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sally.html",
      },
      featuredImage: "diningTable.jpg",
    },
    {
      name: "TV",
      description:
        "Samsung 55” smart TV, excellent condition, remote included.",
      price: 300,
      listedDate: new Date("2024-11-05"),
      condition: "Used - Almost New" as Condition,
      pickUpLocation: {
        locationType: "disclosed in communication",
      } as PickupLocation,
      seller: {
        name: "Sam",
        contactInfo: "samsullivan@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sam.html",
      },
      featuredImage: "tv.jpg",
    },
    {
      name: "Twin Bed",
      description: "Twin-size platform bed frame, metal, with headboard.",
      price: 50,
      listedDate: new Date("2024-11-08"),
      condition: "Used - Good" as Condition,
      pickUpLocation: {
        name: "Kennedy Library",
        locationType: "address",
      } as PickupLocation,
      seller: {
        name: "Sally",
        contactInfo: "sallysmith@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sally.html",
      },
      featuredImage: "loftbed.jpg",
    },
    {
      name: "Washer",
      description:
        "Compact washing machine, great for apartments, works perfectly.",
      price: 120,
      listedDate: new Date("2024-11-10"),
      condition: "Used - Almost New" as Condition,
      pickUpLocation: {
        name: "Dexter Lawn",
        locationType: "address",
      } as PickupLocation,
      seller: {
        name: "Sam",
        contactInfo: "samsullivan@calpoly.edu",
        profilePic: "../assets/user.png",
        profileLink: "../users/Sam.html",
      },
      featuredImage: "washer.jpg",
    },
  ],
};

// export function getListing(name: string): Listing {
//   const listing = marketListings.listings.find(
//     (listing) => listing.name === name
//   );
//   if (!listing) {
//     throw new Error(`Listing with name "${name}" not found`);
//   }
//   return listing;
// }

// // Function to get all listings
// export function getAllListings(): Listing[] {
//   return marketListings.listings;
// }
