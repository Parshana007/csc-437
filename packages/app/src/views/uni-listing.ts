import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Observer, define, Form, InputArray } from "@calpoly/mustang";
import { User, Listing } from "server/models";
import reset from "../styles/reset.css";
import page from "../styles/page.css";

export class UniListing extends LitElement {
  src = "/api/listings";
  static uses = define({
    "mu-form": Form.Element,
    "input-array": InputArray.Element,
  });

  @state()
  listingData: Listing | null = null;

  @state()
  sellerData: User | null = null;

  @state()
  mode: "view" | "edit" = "view";

  _authObserver = new Observer<Auth.Model>(this, "blazing:auth");
  _user = new Auth.User();

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
      if (user) {
        this._user = user;
        this.fetchData();
      }
    });
  }

  async fetchData() {
    try {
      const res = await fetch(this.src, {
        headers: Auth.headers(this._user),
      });
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      const json = await res.json();
      this.listingData = json;

      // Fetch seller information if available
      if (json.seller) {
        await this.fetchSeller(json.seller);
      }
    } catch (err) {
      console.error("Error fetching listing:", err);
    }
  }

  async fetchSeller(sellerId: string) {
    try {
      const res = await fetch(`/api/users/${sellerId}`, {
        headers: Auth.headers(this._user),
      });
      if (!res.ok) throw new Error(`Error fetching seller: ${res.status}`);
      this.sellerData = await res.json();
    } catch (err) {
      console.error("Error fetching seller data:", err);
    }
  }

  render() {
    return html`
      <section class="listing">
        ${this.mode === "view" ? this.renderView() : this.renderEdit()}
      </section>
    `;
  }

  renderView() {
    if (!this.listingData) {
      return html`<p>Loading...</p>`;
    }

    const {
      name,
      description,
      price,
      pickUpLocation,
      listedDate,
      condition,
      featuredImage,
    } = this.listingData;

    return html`
      <section class="view">
        <section class="listing">
          <div class="listing-header">
            <h2>${name}</h2>
            <a href="/listings">
              <svg class="crossSvg">
                <use href="../../public/assets/icons.svg#icon-cross"></use>
              </svg>
            </a>
          </div>
          <section class="listing-description">
            ${featuredImage
              ? html`<img src="../assets/${featuredImage}" alt="${name}" />`
              : ""}
            <div class="details">
              <dl>
                <dt>Description</dt>
                <dd>${description}</dd>
                <dt>Price</dt>
                <dd>$${price}</dd>
                <dt>Listed Date</dt>
                <dd>${new Date(listedDate).toLocaleDateString()}</dd>
                <dt>Condition</dt>
                <dd>${condition}</dd>
                <dt>Pick Up Location</dt>
                <dd>${pickUpLocation}</dd>
                <dt>Seller Information</dt>
                <dd>
                  ${this.sellerData
                    ? html`<a href="../users/${this.sellerData._id}">
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
    `;
  }

  renderEdit() {
    if (!this.listingData) {
      return html`<p>Loading...</p>`;
    }

    const { name, description, price, pickUpLocation } = this.listingData;

    return html`
      <mu-form @submit=${this.handleSubmit}>
        <label>
          <span>Name</span>
          <input name="name" value="${name}" />
        </label>
        <label>
          <span>Description</span>
          <textarea name="description">${description}</textarea>
        </label>
        <label>
          <span>Price</span>
          <input type="number" name="price" value="${price}" />
        </label>
        <label>
          <span>Pick-Up Location</span>
          <input name="pickUpLocation" value="${pickUpLocation}" />
        </label>
        <button type="submit">Save</button>
        <button type="button" @click=${() => (this.mode = "view")}>
          Cancel
        </button>
      </mu-form>
    `;
  }

  async handleSubmit(event: CustomEvent) {
    const formData = event.detail;
    const data = Object.fromEntries(new FormData(formData).entries());

    try {
      const res = await fetch(this.src, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...Auth.headers(this._user),
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`Status: ${res.status}`);
      const updatedListing = await res.json();
      this.listingData = updatedListing;

      // Update seller information if changed
      if (updatedListing.seller) {
        await this.fetchSeller(updatedListing.seller);
      }

      this.mode = "view";
    } catch (err) {
      console.error("Error updating listing:", err);
    }
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
