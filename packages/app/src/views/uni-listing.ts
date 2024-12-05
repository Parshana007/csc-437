import { define, View, Form } from "@calpoly/mustang";
import { css, html } from "lit";
import { state, property } from "lit/decorators.js";
import { User, Listing, Condition } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import reset from "../styles/reset.css";
import page from "../styles/page.css";
import { Types } from "mongoose";

export class UniListing extends View<Model, Msg> {
  static uses = define({
    "mu-form": Form.Element,
  });

  @property()
  listingid?: string;

  @property({ reflect: true })
  mode = "view";

  @state()
  get listing(): Listing | undefined {
    return this.model.listing;
  }

  @state()
  get user(): User | undefined {
    return this.model.user;
  }

  constructor() {
    super("blazing:model");

    this.addEventListener("mu-form:submit", (event) => {
      const customEvent = event as CustomEvent<{
        _id: string;
        name: string;
        description: string;
        price: number;
        listedDate: Date;
        condition: Condition;
        seller: string;
        featuredImage: string;
        pickUpLocation: string;
      }>;
      this.handleFormSubmit(customEvent.detail);
    });
  }

  handleFormSubmit(formData: {
    _id: string;
    name: string;
    description: string;
    price: number;
    listedDate: Date;
    condition: Condition;
    seller: string;
    featuredImage: string;
    pickUpLocation: string;
  }) {
    console.log("Form data:", formData);
    this.dispatchMessage([
      "listing/save",
      {
        listingid: formData._id,
        listing: {
          ...formData,
          _id: new Types.ObjectId(formData._id), // Convert _id to ObjectId
          seller: new Types.ObjectId(formData.seller),
        },
        onSuccess: () => {
          console.log("Listing saved successfully!");
          this.mode = "view"; // Return to view mode
        },
        onFailure: (error: Error) => {
          console.error("Failed to save Listing:", error);
        },
      },
    ]);
  }

  // Handle successful listing selection
  protected updated(
    changedProperties: Map<string | number | symbol, unknown>
  ): void {
    super.updated(changedProperties);

    // If listing data is loaded and has a seller, fetch the seller's profile
    if (
      this.listing?.seller &&
      (!this.user ||
        this.user._id?.toString() !== this.listing.seller.toString())
    ) {
      const sellerId = this.listing.seller.toString();
      console.log("Dispatching profile/select for seller", sellerId);
      this.dispatchMessage(["profile/select", { userid: sellerId }]);
    }
  }

  attributeChangedCallback(
    name: string,
    old: string | null,
    value: string | null
  ) {
    console.log(`Attribute changed: ${name}, Old: ${old}, New: ${value}`);
    super.attributeChangedCallback(name, old, value);

    if (name === "listingid" && old !== value && value) {
      this.dispatchMessage(["listing/select", { listingid: value }]);
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
                <use href="/assets/icons.svg#icon-cross"></use>
              </svg>
            </a>
          </div>
          <section class="listing-description">
            <img src="/assets/${featuredImage}" alt="${name}" />
            <div class="details">
              <dl>
                <dt>Description</dt>
                <dd>${description}</dd>
                <dt>Price</dt>
                <dd>$${price}</dd>
                <dt>Listed Date</dt>
                <dd>
                  ${listedDate
                    ? new Date(listedDate).toLocaleDateString("en-US")
                    : ""}
                </dd>
                <dt>Condition</dt>
                <dd>${condition}</dd>
                <dt>Pick Up Location</dt>
                <dd>${pickUpLocation}</dd>
                <dt>Seller Information</dt>
                <dd>
                  ${this.user
                    ? html`<a href="../user/${this.user._id}">
                        ${this.user.name}
                      </a>`
                    : html`<span>Loading seller information...</span>`}
                </dd>
              </dl>
            </div>
          </section>
          <button @click=${() => (this.mode = "edit")}>Edit</button>
        </section>
      </section>
      <mu-form class="edit" .init=${this.listing}>
        <main class="center-container">
          <section class="formContent">
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
          </section>
        </main>
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

      .center-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .formContent {
        display: flex;
        flex-direction: column;
        background-color: var(--color-eggplant);
        padding: var(--content-size-xlarge);
        gap: 5px;
        width: 80%;
        max-width: 600px;
        margin-bottom: var(--content-size-medium);
      }

      button {
        background-color: var(--color-eggplant);
        border-radius: 8px;
        border-style: none;
        box-sizing: border-box;
        color: #ffffff;
        cursor: pointer;
        display: inline-block;
        font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial,
          sans-serif;
        font-size: 14px;
        font-weight: 500;
        height: 40px;
        line-height: 20px;
        list-style: none;
        margin: 0;
        outline: none;
        padding: 10px 16px;
        position: relative;
        text-align: center;
        text-decoration: none;
        transition: color 100ms;
        vertical-align: baseline;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        margin-top: 10px;
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
