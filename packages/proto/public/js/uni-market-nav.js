import { css, html, shadow } from "@calpoly/mustang";

export class UniMarketNav extends HTMLElement {
  static template = html`
    <template>
      <header>
        <a href="../index.html">
          <h1 class="navBar">
            <svg class="icon-market">
              <use href="../icons/icons.svg#icon-market" />
            </svg>
            <span>UniMarket</span>
          </h1>
        </a>
      </header>
    </template>
  `;

  static styles = css`
    .navBar {
      display: flex;
      align-items: center;
      flex-direction: row;
      gap: 0.5em;
    }

    .icon-market {
      width: 1.1em;
      height: 1.1em;
      margin: 0;
      padding-left: var(--content-size-small);
      fill: var(--color-white);
    }

    header h1 {
      font-size: var(--size-type-xxlarge);
      font-family: var(--font-family-display);
      padding: 0.5rem;
      width: 100%;
      margin: 0;
    }

    header {
      background-color: var(--color-eggplant);
      color: var(--color-white);
      margin: 0;
      margin-bottom: var(--content-size-small);
    }

    a {
      color: var(--color-link);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `;

  constructor() {
    super();
    shadow(this).template(UniMarketNav.template).styles(UniMarketNav.styles);
  }
}
