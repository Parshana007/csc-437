import { User } from "../models/user";
import { Schema, model } from "mongoose";

const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true, trim: true },
    contactInfo: { type: String, required: true, trim: true },
    profilePic: { type: String, required: true, trim: true },
  },
  { collection: "market_users" }
);

const UserModel = model<User>("Profile", UserSchema);

function index(): Promise<User[]> {
  return UserModel.find();
}

function get(userId: String): Promise<User> {
  return UserModel.find({ _id: userId })
    .then((list) => list[0])
    .catch((err) => {
      throw `${userId} Not Found`;
    });
}

function create(json: User): Promise<User> {
  const u = new UserModel(json);
  return u.save();
}

function update(userId: String, user: User): Promise<User> {
  return UserModel.findOneAndUpdate({ _id: userId }, user, {
    new: true,
  }).then((updated) => {
    if (!updated) throw `${userId} not updated`;
    else return updated as User;
  });
}

function remove(userId: String): Promise<void> {
  return UserModel.findOneAndDelete({ _id: userId }).then((deleted) => {
    if (!deleted) throw `${userId} not deleted`;
  });
}

export default { index, get, create, update, remove };
