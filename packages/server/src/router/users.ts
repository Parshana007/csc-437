import express, { Request, Response } from "express";
import Users from "../services/users-svc";
import { User } from "models";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Users.index()
    .then((list: User[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newUser = req.body;

  Users.create(newUser)
    .then((user: User) => res.status(201).json(user))
    .catch((err) => res.status(500).send(err));
});

router.get("/:userName", (req: Request, res: Response) => {
  const { userName } = req.params;
  Users.get(userName)
    .then((user: User) => res.json(user))
    .catch((err) => res.status(404).send(err));
});

router.put("/:userName", (req: Request, res: Response) => {
  const { userName } = req.params;
  const newUser = req.body;

  Users.update(userName, newUser)
    .then((user: User) => res.json(user))
    .catch((err) => res.status(404).end());
});

router.delete("/:userName", (req: Request, res: Response) => {
  const { userName } = req.params;

  Users.remove(userName)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
