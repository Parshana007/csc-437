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

function get(userName: String): Promise<User> {
  return UserModel.find({ name: userName })
    .then((list) => list[0])
    .catch((err) => {
      throw `${userName} Not Found`;
    });
}

function create(json: User): Promise<User> {
  const u = new UserModel(json);
  return u.save();
}

function update(userName: String, user: User): Promise<User> {
  return UserModel.findOneAndUpdate({ name: userName }, user, {
    new: true,
  }).then((updated) => {
    if (!updated) throw `${userName} not updated`;
    else return updated as User;
  });
}

function remove(userName: String): Promise<void> {
  return UserModel.findOneAndDelete({ name: userName }).then((deleted) => {
    if (!deleted) throw `${userName} not deleted`;
  });
}

export default { index, get, create, update, remove };
