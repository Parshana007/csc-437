import { Auth, define, History, Switch, Store } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { html, LitElement } from "lit";
import { UniMarketNav } from "./components/uni-market-nav";
import { UnimarketListings } from "./OLDviews/home-view";
// import { UserProfile } from "./OLDviews/user-profile";
// import { UniListing } from "./OLDviews/uni-listing";
import {UniListing } from "./views/uni-listing";
import { UserViewProfile } from "./views/user-profile"

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
    //consider making a view one and then making a edit page
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
  "mu-store": class AppStore extends Store.Provider<Model, Msg> {
    constructor() {
      super(update, init, "blazing:auth");
    }
  },
  "uni-market-app": AppElement,
  "uni-market-nav": UniMarketNav,
//   "user-profile": UserProfile,
  "user-profile": UserViewProfile,
  "uni-listing": UniListing,
});
