// src/index.ts
import { MarketPlacePage } from "./pages/marketPlacePage";
import { UserPage } from "./pages/userPage";
import { Listing } from "models";
import { ListingPage } from "./pages/listingPage";
import Users from "./services/users-svc";
import Listings from "./services/listings-svc";
import users from "./routes/users";
import listings from "./routes/listings";
import { connect } from "./services/mongo";
import auth, { authenticateUser } from "./routes/auth";
import { LoginPage, RegistrationPage } from "./pages/auth";
import fs from "node:fs/promises";
import path from "path";
connect("UniMarket");

import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.json());

app.use(express.static(staticDir));

app.use("/api/listings", authenticateUser, listings);
app.use("/api/users", authenticateUser, users);

app.use("/auth", auth);

app.get("/login", (req: Request, res: Response) => {
  const page = new LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});
app.get("/register", (req: Request, res: Response) => {
  const page = new RegistrationPage();
  res.set("Content-Type", "text/html").send(page.render());
});

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get("/listings", (req: Request, res: Response) => {
  Listings.getAllListings()
    .then((listings: Listing[]) => {
      const data = { listings }; // Ensure data is structured correctly
      const page = new MarketPlacePage(data);
      res.set("Content-Type", "text/html").send(page.render());
    })
    .catch((err) => {
      console.error("Error fetching listings:", err);
      res.status(500).send("Error fetching listings");
    });
});

app.get("/listings/:listing", (req: Request, res: Response) => {
  const { listing } = req.params;
  Listings.get(listing).then((data: any) => {
    const page = new ListingPage(data);
    res.set("Content-Type", "text/html").send(page.render());
  });
});

app.get("/users/:userId", (req: Request, res: Response) => {
  const { userId } = req.params;
  Users.get(userId).then((data: any) => {
    const page = new UserPage(data);
    res.set("Content-Type", "text/html").send(page.render());
  });
});

app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
    res.send(html)
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
