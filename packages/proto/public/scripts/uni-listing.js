import {
  css,
  html,
  shadow,
  Auth,
  Observer,
  define,
  Form,
  InputArray,
} from "@calpoly/mustang";
import reset from "./reset.css.js";

export class UniListing extends HTMLElement {
  static uses = define({
    "mu-form": Form.Element,
    "input-array": InputArray.Element,
  });
  static template = html`
    <template>
    <section class="view">
      <section class="listing">
        <div class="listing-header">
          <h2><slot name="name">Default Title</slot></h2>
          <a href="/listings">
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
              <dd><slot name="listedDate">01/01/2024</slot></dd>
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
        <button id="edit">Edit</button>
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
  `;

  _authObserver = new Observer(this, "blazing:auth");

  // Gets source attribute from listingPage.ts (ex. src="/api/listings/${name})
  get src() {
    return this.getAttribute("src");
  }

  get authorization() {
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${this._user.token}`,
      }
    );
  }

  // if src is set to hydrate
  // called when the component is added to the DOM
  connectedCallback() {
    const href = this.getAttribute("href") || "#";
    // find an a tag in the shadow-DOM and replace with the new href
    this.shadowRoot.querySelector("a").setAttribute("href", href);
    if (this.src) this.hydrate(this.src);

    this._authObserver.observe(({ user }) => {
      this._user = user;
      if (this.src) this.hydrate(this.src);
    });

    if (!this.mode) {
      this.mode = "view"; // Default to 'view' mode
    }
  }

  get form() {
    return this.shadowRoot.querySelector("mu-form.edit");
  }

  get mode() {
    return this.getAttribute("mode");
  }

  set mode(m) {
    this.setAttribute("mode", m);
  }

  get editButton() {
    return this.shadowRoot.getElementById("edit");
  }

  submit(url, json) {
    fetch(url, {
      headers: { "Content-Type": "application/json", ...this.authorization },
      method: "PUT",
      body: JSON.stringify(json),
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        this.renderSlots(json);
        this.form.init = json;
        this.mode = "view";
      })
      .catch((error) =>
        console.log(`Failed to render data on submit ${url}:`, error)
      );
  }

  // fetches data from url (ex.src="/api/listings/Computer) & renders them
  hydrate(url) {
    fetch(url, {
      headers: { "Content-Type": "application/json", ...this.authorization },
      method: "GET",
    })
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json(); //includes all the attributes (ex. name, description...)
      })
      .then((json) => {
        this.renderSlots(json);
        this.form.init = json; // populate mu-form
      })
      .catch((error) => console.log(`Failed to render data ${url}:`, error));
  }

  // takes the json and maps to HTML elements
  async renderSlots(json) {
    const entries = Object.entries(json); // json to key, value
    console.log("entries", entries);
    const toSlot = async ([key, value]) => {
      if (key === "seller") {
        // Fetch seller information if the key is 'seller'
        try {
          const url = `/api/users/${value}`;
          const response = await fetch(url, {
            headers: {
              "Content-Type": "application/json", // Specify JSON format
              ...this.authorization, // Include additional authorization headers dynamically
            },
            method: "GET", // HTTP method
          });
          console.log("response", response);
          if (!response.ok) {
            throw new Error(
              `Error fetching seller info: ${response.statusText}`
            );
          }
          const sellerData = await response.json(); // Assuming the response contains the seller details as JSON
          console.log("Seller data", sellerData);
          return html`<span slot="${key}">
            <a href="../users/${sellerData._id}">${sellerData.name}</a>
          </span>`;
        } catch (error) {
          console.error("Failed to fetch seller data:", error);
          return html`<span slot="${key}"
            >Seller information unavailable</span
          >`;
        }
      }
      if (key == "listedDate") {
        const date = new Date(value); // Parse the ISO date string
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return html`<span slot="listedDate">${month}/${day}/${year}</slot>`;
      }
      if (key == "featuredImage") {
        return html`<img slot="image" src="/assets/${value}" alt=${value} />`;
      }
      // another for links
      return html`<span slot="${key}">${value}</span>`;
    };

    // Resolve all slots (use `Promise.all` since `toSlot` may be async)
    const fragment = await Promise.all(entries.map(toSlot));
    this.replaceChildren(...fragment); //clears existing content & replaces with fragment
  }

  constructor() {
    super();
    shadow(this)
      .template(UniListing.template)
      .styles(reset.styles, UniListing.styles);

    this.addEventListener("mu-form:submit", (event) => {
      this.submit(this.src, event.detail);
    });

    this.editButton.addEventListener("click", () => (this.mode = "edit"));
  }
}
