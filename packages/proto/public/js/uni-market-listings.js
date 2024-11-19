import { css, html, shadow, Auth, Observer } from "@calpoly/mustang";
import reset from "./reset.css.js";

export class UnimarketListings extends HTMLElement {
  static template = html`
    <template>
      <mu-auth provides="blazing:auth">
        <section class="listings">
          <slot>
            <listing-header>
              <img
                slot="image"
                src="./assets/loftbed.jpg"
                alt="Desk with shelves and wheels"
              />
              <span slot="listingName"
                ><a href="./listing/TwinBed.html">Twin Bed</a></span
              >
              <span slot="price">Price: $280</span>
            </listing-header>
          </slot>
        </section>
      </mu-auth>
    </template>
  `;

  static styles = css`
    .listings {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
      gap: var(--size-type-small);
      margin: 0.5rem;
    }
  `;

  _authObserver = new Observer(this, "blazing:auth");

  get src() {
    return this.getAttribute("src");
  }

  get authorization() {
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${this._user.token}`
      }
    );
  }

  connectedCallback() {
    if (this.src) this.hydrate(this.src);

    define({
      "mu-auth": Auth.Provider,
    });

    this._authObserver.observe(({ user }) => {
        this._user = user;
      });
  }

  hydrate(url) {
    fetch(url, { headers: this.authorization })
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => this.renderSlots(json))
      .catch((error) => console.log(`Failed to render data ${url}:`, error));
  }

  renderListing(item) {
    const { name, price, featuredImage } = item;

    return html`
      <listing-header>
        <img slot="image" src="./assets/${featuredImage}" alt="${name}" />
        <span slot="listingName">
          <a href="/listings/${name}">${name}</a>
        </span>
        <span slot="price">Price: $${price}</span>
      </listing-header>
    `;
  }

  renderSlots(json) {
    const listingList = json.map((item) => this.renderListing(item));
    this.replaceChildren(...listingList);
  }

  constructor() {
    super();
    shadow(this)
      .template(UnimarketListings.template)
      .styles(reset.styles, UnimarketListings.styles);
  }
}
