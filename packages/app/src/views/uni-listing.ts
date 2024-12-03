import { css, html, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { Auth, Observer, define, Form, InputArray } from "@calpoly/mustang";
import { User, Listing } from "server/models";
import reset from "../styles/reset.css";
import page from "../styles/page.css";

export class UniListing extends LitElement {
  static uses = define({
    "mu-form": Form.Element,
    "input-array": InputArray.Element,
  });

  @property()
  listingid?: string;

  @state()
  listing?: Listing;

  @state()
  sellerData?: User;

  @property({ reflect: true })
  mode = "view";

  get src() {
    return `/api/listings/${this.listingid}`;
  }

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
        return res.json(); //includes all the attributes (ex. name, description...)
      })
      .catch((error) => console.log(`Failed to render data ${url}:`, error))
      .then((json: unknown) => {
        if (json) {
          console.log("Listing: ", json);
          this.listing = json as Listing;
          this.renderUser();
        }
      })
      .catch((err) => console.log("Failed to convert listing data:", err));
  }

  submit(url: string, json: string) {
    fetch(url, {
      headers: Auth.headers(this._user),
      method: "PUT",
      body: JSON.stringify(json),
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        // this.renderSlots(json);
        // this.form.init = json;
        if (json) {
          console.log("Listing: ", json);
          this.listing = json as Listing;
        }
        this.mode = "view";
      })
      .catch((error) =>
        console.log(`Failed to render data on submit ${url}:`, error)
      );
  }

  async renderUser() {
    try {
      const url = `/api/users/${this.listing?.seller}`;
      const response = await fetch(url, {
        headers: Auth.headers(this._user),
      });
      console.log("response", response);
      if (!response.ok) {
        throw new Error(`Error fetching seller info: ${response.statusText}`);
      }
      const sellerData = await response.json(); // Assuming the response contains the seller details as JSON
      console.log("Seller data", sellerData);
      this.sellerData = sellerData;
    } catch (error) {
      console.error("Failed to fetch seller data:", error);
    }
  }

  protected render() {
    const {
      name,
      description,
      price,
      pickUpLocation,
      listedDate,
      condition,
      featuredImage,
    } = this.listing || {};

    return html`
      <section class="view">
        <section class="listing">
          <div class="listing-header">
            <h2>${name}</h2>
            <a href="/app">
              <svg class="crossSvg">
                <use href="../../public/assets/icons.svg#icon-cross"></use>
              </svg>
            </a>
          </div>
          <section class="listing-description">
            <img src="../assets/${featuredImage}" alt="${name}" />
            <div class="details">
              <dl>
                <dt>Description</dt>
                <dd>${description}</dd>
                <dt>Price</dt>
                <dd>$${price}</dd>
                <dt>Listed Date</dt>
                <dd>${listedDate}</dd>
                <dt>Condition</dt>
                <dd>${condition}</dd>
                <dt>Pick Up Location</dt>
                <dd>${pickUpLocation}</dd>
                <dt>Seller Information</dt>
                <dd>
                  ${this.sellerData
                    ? html`<a href="../user/${this.sellerData._id}">
                        ${this.sellerData.name}
                      </a>`
                    : html`<span>Loading seller information...</span>`}
                </dd>
              </dl>
            </div>
          </section>
          <button @click=${() => (this.mode = "edit")}>Edit</button>
        </section>
      </section>
      <mu-form class="edit">
        <label>
          <span>Listing Name</span>
          <input name="name" />
        </label>
        <label>
          <span>Description</span>
          <input name="description" />
        </label>
        <label>
          <span>Price</span>
          <input name="price" />
        </label>
        <label>
          <span>Pick Up Location</span>
          <input name="pickUpLocation" />
        </label>
      </mu-form>
    `;
  }

  static styles = [
    reset.styles,
    page.styles,
    css`
      .listing {
        margin: var(--content-size-small);
      }

      .listing-description {
        display: flex;
        flex-direction: row;
      }

      .details {
        padding: var(--size-type-large);
      }

      img {
        max-height: calc(
          70vh - var(--content-size-medium)
        ); /* vh is the visual height */
      }

      .crossSvg {
        width: var(--content-size-large);
        height: var(--content-size-large);
        fill: var(--color-sage);
        stroke: var(--color-white);
      }

      dt {
        font-weight: var(--font-bold); /* Make the terms bold for emphasis */
      }

      dd {
        margin-bottom: var(--content-size-small);
        margin-left: var(--content-size-small);
      }

      .listing-header {
        display: flex;
        align-items: center; /* Align the items vertically in the center */
        justify-content: space-between; /* Push items to the edges */
        padding-bottom: var(
          --content-size-small
        ); /* Optional: Adds some space below the header */
      }

      :host {
        display: contents;
      }
      :host([mode="edit"]),
      :host([mode="new"]) {
        --display-view-none: none;
      }
      :host([mode="view"]) {
        --display-editor-none: none;
      }
      section.view {
        display: var(--display-view-none, grid);
        grid-template-columns: subgrid;
        gap: inherit;
        gap: var(--size-spacing-medium) var(--size-spacing-xlarge);
        align-items: end;
        grid-column: 1 / -1;
      }
      mu-form.edit {
        display: var(--display-editor-none, grid);
        grid-column: 1/-1;
        grid-template-columns: subgrid;
      }
    `,
  ];
}
