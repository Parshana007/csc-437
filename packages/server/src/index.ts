// src/index.ts
import { MarketPlacePage } from './pages/listing'; 
import { getListing, getAllListings } from './services/listings-svc'; // Add a service to retrieve listings

import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get(
  "/listings",
  (req: Request, res: Response) => {
    const data = { listings: getAllListings() };
    const page = new MarketPlacePage(data);

    res.set("Content-Type", "text/html").send(page.render());
  }
);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
