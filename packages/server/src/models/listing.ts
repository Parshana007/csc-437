import { PickupLocation } from "./geo";
import { User } from "./user"

export interface Listing {
  name: string;
  description: string;
  price: number;
  listedDate: Date;
  condition: Condition;
  pickUpLocation: PickupLocation;
  seller: User; /*TODO: Just the name appears with the link to userspage*/
  featuredImage: string; /* Consider changing this to get a list of images?*/
}

export type Condition =
  | "New"
  | "Used - Almost New"
  | "Used - Good"
  | "Used - Fair"
  | "Refurbished"
  | "For Parts or Repair";

