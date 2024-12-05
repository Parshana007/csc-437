import express, { Request, Response } from "express";
import Listings from "../services/listings-svc";
import { Listing } from "models";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Listings.index()
    .then((list: Listing[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newListing = req.body;

  Listings.create(newListing)
    .then((user: Listing) => res.status(201).json(user))
    .catch((err) => res.status(500).send(err));
});

router.get("/:listing", (req: Request, res: Response) => {
  const { listing } = req.params;
  Listings.get(listing)
    .then((listing: Listing) => res.json(listing))
    .catch((err) => res.status(404).send(err));
});

router.put("/:listingId", (req: Request, res: Response) => {
  const { listingId } = req.params;
  const newListing = req.body;

  Listings.update(listingId, newListing)
    .then((listing: Listing) => res.json(listing))
    .catch((err) => res.status(404).end());
});

router.delete("/:listingId", (req: Request, res: Response) => {
  const { listingId } = req.params;

  Listings.remove(listingId)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
