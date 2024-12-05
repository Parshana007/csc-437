import { User, Listing } from "server/models";

export type Msg =
  | [
      "profile/save",
      {
        userid: string;
        user: User;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | ["profile/select", { userid: string }]
  | [
    "listing/save",
    {
      listingid: string;
      listing: Listing;
      onSuccess?: () => void;
      onFailure?: (err: Error) => void;
    }
  ]
| ["listing/select", { listingid: string }];
