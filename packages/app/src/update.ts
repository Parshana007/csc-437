import { Auth, Update } from "@calpoly/mustang";
import { User, Listing } from "server/models";
import { Msg } from "./messages";
import { Model } from "./model";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "profile/save":
      console.log("Applying selected profile to model:", message[1]);
      console.log("User", user);
      saveProfile(message[1], user)
        .then((profile) => {
          if (profile) {
            console.log("Applying profile to model:", profile);
            apply((model) => ({ ...model, user: profile }));
          } else {
            console.warn("No profile data returned from saveProfile");
          }
        })
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      break;
    case "profile/select":
      selectProfile(message[1], user).then((profile) => {
        if (profile) {
          console.log("Applying profile to model:", profile);
          apply((model) => ({ ...model, user: profile }));
        } else {
          console.warn("No profile data returned from selectProfile");
        }
      });
      break;
    case "listing/save":
      console.log("Applying selected saveListing to model:", message[1]);
      console.log("User", user);
      saveListing(message[1], user)
        .then((listing) => {
          if (listing) {
            console.log("Applying saveListing to model:", listing);
            apply((model) => ({ ...model, listing: listing }));
          } else {
            console.warn("No listing data returned from saveListing");
          }
        })
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      break;
    case "listing/select":
      selectListing(message[1], user).then((listing) => {
        if (listing) {
          console.log("Applying selectListing to model:", listing);
          apply((model) => ({ ...model, listing: listing }));
        } else {
          console.warn("No profile data returned from selectListing");
        }
      });
      break;
    // put the rest of your cases here
    // default:
    //   const unhandled: never = message[0];
    //   throw new Error(`Unhandled Auth message "${unhandled}"`);
  }
}

function saveProfile(
  msg: {
    userid: string;
    user: User;
  },
  user: Auth.User
) {
  return fetch(`/api/users/${msg.userid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user),
    },
    body: JSON.stringify(msg.user),
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      else throw new Error(`Failed to save profile for ${msg.userid}`);
    })
    .then((json: unknown) => {
      console.log("JSON for save profile", json);
      if (json) return json as User;
      return undefined;
    });
}

function selectProfile(msg: { userid: string }, user: Auth.User) {
  return fetch(`/api/users/${msg.userid}`, {
    headers: Auth.headers(user),
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Fetched profile JSON:", json);
        return json as User;
      }
    });
}

function saveListing(
  msg: {
    listingid: string;
    listing: Listing;
  },
  user: Auth.User
) {
  return fetch(`/api/listings/${msg.listingid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user),
    },
    body: JSON.stringify(msg.listing),
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      else throw new Error(`Failed to save profile for ${msg.listingid}`);
    })
    .then((json: unknown) => {
      console.log("JSON for save profile", json);
      if (json) return json as Listing;
      return undefined;
    });
}

function selectListing(msg: { listingid: string }, user: Auth.User) {
  return fetch(`/api/listings/${msg.listingid}`, {
    headers: Auth.headers(user),
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        console.log("Fetched profile JSON Listing:", json);
        return json as Listing;
      }
    });
}
