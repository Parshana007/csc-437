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

router.put("/:listingName", (req: Request, res: Response) => {
  const { listingName } = req.params;
  const newListing = req.body;
  console.log("listingName", listingName);
  console.log("newListing", newListing);

  Listings.update(listingName, newListing)
    .then((listing: Listing) => res.json(listing))
    .catch((err) => res.status(404).end());
});

export default router;
