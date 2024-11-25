import { Listing } from "../models/listing";
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
    pickUpLocation: { type: String, required: true, trim: true },
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

function get(listingId: String): Promise<Listing> {
  return ListingModel.find({ _id: listingId })
    .then((list) => list[0])
    .catch((err) => {
      throw `${listingId} Not Found`;
    });
}

function create(json: User): Promise<Listing> {
  const l = new ListingModel(json);
  return l.save();
}

function update(listingId: String, listing: Listing): Promise<Listing> {
  return ListingModel.findOneAndUpdate({ _id: listingId }, listing, {
    new: true,
  }).then((updated) => {
    if (!updated) throw `${listingId} not updated`;
    else return updated as Listing;
  });
}

function remove(listingId: String): Promise<void> {
  return ListingModel.findOneAndDelete({ _id: listingId }).then(
    (deleted) => {
      if (!deleted) throw `${listingId} not deleted`;
    }
  );
}

export default { index, get, create, update, remove, getAllListings };
