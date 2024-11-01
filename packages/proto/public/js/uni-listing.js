import { css, html, shadow } from "@calpoly/mustang";

export class UniListing extends HTMLElement {
  static template = html`
    <template>
      <section class="listing">
        <div class="listing-header">
          <h2><slot name="title">Default Title</slot></h2>
          <a href="../index.html">
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
              <dd><slot name="location">Location</slot></dd>
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

  constructor() {
    super();
    shadow(this).template(UniListing.template).styles(UniListing.styles);
  }
}
