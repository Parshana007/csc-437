import { Types } from "mongoose";

export interface User {
    _id?: Types.ObjectId;
    name: string;
    contactInfo: string; /*Email format ending in .edu*/
    profilePic: string;
}