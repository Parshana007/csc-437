import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer, define } from "@calpoly/mustang";
import { Listing } from "server/models";
import reset from "../styles/reset.css";
import page from "../styles/page.css";
import { ListingHeader } from "../components/listing-header";

export class UnimarketListings extends LitElement {
  src = "/api/listings";
  static uses = define({
    "listing-header": ListingHeader,
  });

  @state()
  listingIndex = new Array<Listing>();

  _authObserver = new Observer<Auth.Model>(this, "blazing:auth");

  _user = new Auth.User();

  connectedCallback() {
    super.connectedCallback();
    console.log("UnimarketListings connected");
    this._authObserver.observe(({ user }) => {
      console.log("Auth observer fired:", user);
      if (user) {
        this._user = user;
      }
      this.hydrate(this.src);
    });
  }

  hydrate(url: string) {
    console.log("Fetching listings from:", url);
    fetch(url, {
      headers: Auth.headers(this._user),
    })
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .catch((error) => console.log(`Failed to render data ${url}:`, error))
      .then((json: unknown) => {
        if (json) {
          console.log("Listings:", json);
          this.listingIndex = json as Array<Listing>;
        }
      })
      .catch((err) => console.log("Failed to convert tour data:", err));
  }

  render() {
    const listingList = this.listingIndex.map(this.renderListing);

    return html` <section class="listings">${listingList}</section> `;
  }

  renderListing(item: Listing) {
    const { _id, name, price, featuredImage } = item;

    return html`
      <listing-header>
        <img slot="image" src="./assets/${featuredImage}" alt="${name}" />
        <span slot="listingName">
          <a href="/listings/${_id}">${name}</a>
        </span>
        <span slot="price">Price: $${price}</span>
      </listing-header>
    `;
  }

  static styles = [
    reset.styles,
    page.styles,
    css`
      .listings {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
        gap: var(--size-type-small);
        margin: 0.5rem;
      }
    `,
  ];
}
