import express, { Request, Response } from "express";
import Users from "../services/users-svc";
import { UserPage } from "../pages/userPage";
import { User } from "models";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Users.index()
    .then((list: User[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:userName", (req: Request, res: Response) => {
  const { userName } = req.params;
  Users.get(userName)
    .then((user: User) => res.json(user))
    .catch((err) => res.status(404).send(err));
});

export default router;