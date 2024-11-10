import { User } from "../models/user";
import { Schema, model } from "mongoose";

const UserSchema = new Schema<User>(
    {
      name: { type: String, required: true, trim: true},
      contactInfo: {type: String, required: true, trim: true}, 
      profilePic: {type: String, required: true, trim: true}, 
      profileLink: {type: String, required: true, trim: true}, 
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
  
  export default { index, get };