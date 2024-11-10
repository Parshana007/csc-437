import { Listing } from "../models/listing";
import { PickupLocation } from "../models/geo";
import { Condition } from "../models/listing";
import { Schema, model } from "mongoose";
import { User } from "../models/user";

const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true, trim: true },
    contactInfo: { type: String, required: true, trim: true },
    profilePic: { type: String, required: true, trim: true },
  },
  { collection: "market_users" }
);

const PickupLocationSchema = new Schema<PickupLocation>({
  name: { type: String, trim: true },
  address: { type: String, trim: true },
  locationType: {
    type: String,
    enum: ["address", "disclosed in communication"],
    required: true,
  },
});

const ListingSchema = new Schema<Listing>(
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
        "For Parts or Repair",
      ],
      required: true,
    },
    pickUpLocation: { type: PickupLocationSchema, required: true },
    seller: { type: UserSchema, ref: "Profile", required: true },
    featuredImage: { type: String, required: true, trim: true },
  },
  { collection: "market_listings" }
);

const ListingModel = model<Listing>("Listings", ListingSchema);

function index(): Promise<Listing[]> {
  return ListingModel.find();
}

function getAllListings(): Promise<Listing[]> {
  return ListingModel.find();
}

function get(listingName: String): Promise<Listing> {
  return ListingModel.find({ name: listingName })
    .then((list) => list[0])
    .catch((err) => {
      throw `${listingName} Not Found`;
    });
}

function create(json: User): Promise<Listing> {
  const l = new ListingModel(json);
  return l.save();
}

function update(listingName: String, listing: Listing): Promise<Listing> {
  return ListingModel.findOneAndUpdate({ name: listingName }, listing, {
    new: true,
  }).then((updated) => {
    if (!updated) throw `${listingName} not updated`;
    else return updated as Listing;
  });
}

function remove(listingName: String): Promise<void> {
  return ListingModel.findOneAndDelete({ name: listingName }).then((deleted) => {
    if (!deleted) throw `${listingName} not deleted`;
  });
}

export default { index, get, create, update, remove, getAllListings };
