import { User, Listing } from "server/models";

export interface Model {
  user?: User;
  listing?: Listing ;
}

export const init: Model = {};