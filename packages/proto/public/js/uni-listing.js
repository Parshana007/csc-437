import { css, html, shadow } from "@calpoly/mustang";
import reset from "./reset.css.js";

export class UniListing extends HTMLElement {
  static template = html`
    <template>
      <section class="listing">
        <div class="listing-header">
          <h2><slot name="name">Default Title</slot></h2>
          <a href="#">
            <svg class="crossSvg">
              <use href="../icons/icons.svg#icon-cross"></use>
            </svg>
          </a>
        </div>
        <section class="listing-description">
          <slot name="image"></slot>
          <div class="details">
            <dl>
              <dt>Description</dt>
              <dd><slot name="description">Default Description</slot></dd>
              <dt>Price</dt>
              <dd><slot name="price">$0</slot></dd>
              <dt>Listed Date</dt>
              <dd><slot name="listed-date">01/01/2024</slot></dd>
              <dt>Condition</dt>
              <dd><slot name="condition">Condition</slot></dd>
              <dt>Pick Up Location</dt>
              <dd><slot name="pickUpLocation">Location</slot></dd>
              <dt>Seller Information</dt>
              <dd>
                <slot name="seller"><a href="#">Seller</a></slot>
              </dd>
            </dl>
          </div>
        </section>
      </section>
    </template>
  `;

  static styles = css`
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
  `;

  // Gets source attribute from listingPage.ts (ex. src="/api/listings/${name})
  get src() {
    return this.getAttribute("src");
  }

  // if src is set to hydrate
  // called when the component is added to the DOM
  connectedCallback() {
    const href = this.getAttribute("href") || "#";
    // find an a tag in the shadow-DOM and replace with the new href
    this.shadowRoot.querySelector("a").setAttribute("href", href);
    if (this.src) this.hydrate(this.src);
  }

  // fetches data from url (ex.src="/api/listings/Computer) & renders them
  hydrate(url) {
    fetch(url)
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json(); //includes all the attributes (ex. name, description...)
      })
      .then((json) => this.renderSlots(json))
      .catch((error) => console.log(`Failed to render data ${url}:`, error));
  }

  // takes the json and maps to HTML elements
  renderSlots(json) {
    const entries = Object.entries(json); // json to key, value
    console.log("entries", entries);
    const toSlot = ([key, value]) => {
      if (key === "seller" && typeof value === "object" && value.name) {
        // link element for seller
        return html`<span slot="${key}">
          <a href="../users/${value.name}">${value.name}</a>
        </span>`;
      }
      if (key == "featuredImage") {
        return html`<img slot="image" src="../assets/${value}" alt=${value} />`;
      }
      // another for links
      return html`<span slot="${key}">${value}</span>`;
    };

    const fragment = entries.map(toSlot); //DOM fragment returned (contains HTML)
    this.replaceChildren(...fragment); //clears existing content & replaces with fragment
  }

  constructor() {
    super();
    shadow(this)
      .template(UniListing.template)
      .styles(reset.styles, UniListing.styles);
  }
}
