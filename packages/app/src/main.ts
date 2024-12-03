import { Auth, define, History, Switch } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { UniMarketNav } from "./components/uni-market-nav";
import { UnimarketListings } from "./views/home-view";
import { UserProfile } from "./views/user-profile";
import { UniListing } from "./views/uni-listing";

class AppElement extends LitElement {
  static uses = define({
    "home-view": UnimarketListings,
  });

  protected render() {
    return html` <home-view></home-view> `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    UniMarketNav.initializeOnce();
  }
}

const routes = [
  {
    path: "/app/listing/:listingId",
    view: (params: Switch.Params) => html`
      <uni-listing listingid=${params.listingId}></uni-listing>
    `,
  },
  {
    // auth: "protected",
    path: "/app/user/:userId",
    view: (params: Switch.Params) => html`
      <user-profile userid=${params.userId}></user-profile>
    `,
  },
  {
    // auth: "protected",
    path: "/app",
    view: () => html` <home-view></home-view> `,
  },
  {
    path: "/",
    redirect: "/app",
  },
];

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "blazing:history", "blazing:auth");
    }
  },
  "uni-market-app": AppElement,
  "uni-market-nav": UniMarketNav,
  "user-profile": UserProfile,
  "uni-listing": UniListing,
});