import { css, html, shadow } from "@calpoly/mustang";
import reset from "./reset.css.js";

export class ListingHeader extends HTMLElement {
  static template = html`
    <template>
      <figure>
        <slot name="image"></slot>
        <figcaption>
          <slot name="listingName"><a href="#">Default Listing Name</a></slot>
          <slot name="price"><p>Price: $280</p></slot>
        </figcaption>
      </figure>
    </template>
  `;

  static styles = css`
    figure {
      display: flex;
      flex-direction: column;
      margin: 0;
    }

    ::slotted(img) {
      width: 100%;
      object-fit: cover;
      max-height: 20rem;
      height: 25rem;
    }
    
    figcaption {
      background-color: var(--color-eggplant);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
    }

    a:hover {
      text-decoration: underline;
    }

    a {
      color: var(--color-link);
      text-decoration: none;
    }
  `;

  constructor() {
    super();
    shadow(this)
      .template(ListingHeader.template)
      .styles(reset.styles, ListingHeader.styles);
  }
}
