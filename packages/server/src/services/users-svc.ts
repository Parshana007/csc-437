import { User } from "../models/user";

const users = {
  userList: [
    {
      name: "Sam",
      contactInfo: "samsullivan@calpoly.edu",
      profilePic: "user.png",
      profileLink: "../users/Sam.html",
    } as User,
    {
      name: "Sally",
      contactInfo: "sallysmith@calpoly.edu",
      profilePic: "user.png",
      profileLink: "../users/Sally.html",
    } as User,
  ],
};

export function getUser(name: string): User {
  const user = users.userList.find((user) => user.name === name);
  if (!user) {
    throw new Error(`User with name "${name}" not found`);
  }
  return user;
}
