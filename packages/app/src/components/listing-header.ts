// import { define, Dropdown, Events, Auth, Observer } from "@calpoly/mustang";
import { LitElement, css, html } from "lit";
// import { state } from "lit/decorators.js";
import reset from "../styles/reset.css";

export class ListingHeader extends LitElement {
  render() {
    return html`
      <figure>
        <slot name="image"></slot>
        <figcaption>
          <slot name="listingName"><a href="#">Default Listing Name</a></slot>
          <slot name="price"><p>Price: $280</p></slot>
        </figcaption>
      </figure>
    `;
  }

  static styles = [
    reset.styles,
    css`
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
    `,
  ];
}
