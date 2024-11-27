import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer } from "@calpoly/mustang";
import { Listing } from "server/models";
import reset from "../styles/reset.css";

export class UnimarketListings extends LitElement {
  src = "/api/listings";

  @state()
  listingIndex = new Array<Listing>();

  _authObserver = new Observer<Auth.Model>(this, "blazing:auth");

  _user = new Auth.User();

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
      if (user) {
        this._user = user;
      }
      this.hydrate(this.src);
    });
  }

  hydrate(url: string) {
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
          const { data } = json as { data: Array<Listing> };
          this.listingIndex = data;
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
