import { Auth, define } from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { UniMarketNav } from "./components/uni-market-nav";
import { UnimarketListings } from "./views/home-view";

class AppElement extends LitElement {
  static uses = define({
    "home-view": UnimarketListings
  });

  protected render() {
    return html`
      <home-view></home-view>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    UniMarketNav.initializeOnce();
  }
}

define({
  "mu-auth": Auth.Provider,
  "uni-market-app": AppElement,
  "uni-market-header": UniMarketNav
});