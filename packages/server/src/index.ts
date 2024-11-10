// src/index.ts
import { MarketPlacePage } from "./pages/marketPlacePage";
import { UserPage } from "./pages/userPage";
import { Listing } from "models";
import { ListingPage } from "./pages/listingPage"
import Users from "./services/users-svc";
import Listings from "./services/listings-svc"
import users from "./routes/users"
import listings from "./routes/listings"
import { connect } from "./services/mongo";
connect("UniMarket");

import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.json());

app.use(express.static(staticDir));

app.use("/api/listings", listings);
app.use("/api/users", users);

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get("/listings", (req: Request, res: Response) => {
  Listings.getAllListings().then((listings: Listing[]) => {
    const data = { listings }; // Ensure data is structured correctly
    const page = new MarketPlacePage(data);
    res
      .set("Content-Type", "text/html")
      .send(page.render());
  }).catch((err) => {
    console.error('Error fetching listings:', err);
    res.status(500).send('Error fetching listings');
  });
});

app.get("/listings/:listing", (req: Request, res: Response) => {
  const { listing } = req.params;
  Listings.get(listing).then((data: any) => {
    const page = new ListingPage(data);
    res
      .set("Content-Type", "text/html")
      .send(page.render());
  });
});

app.get("/users/:userName", (req: Request, res: Response) => {
  const { userName } = req.params;
  Users.get(userName).then((data: any) => {
    const page = new UserPage(data);
    res
      .set("Content-Type", "text/html")
      .send(page.render());
  });

});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
