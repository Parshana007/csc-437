import { User } from "server/models";

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
  | ["profile/select", { userid: string }];
