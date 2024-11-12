import { css, html, shadow } from "@calpoly/mustang";
import reset from "./reset.css.js";

export class UniMarketNav extends HTMLElement {
  static template = html`
    <template>
      <header>
        <slot name="nav-link">
          <a href="#">
            <h1 class="navBar">
              <svg class="icon-market">
                <use href="../icons/icons.svg#icon-market" />
              </svg>
              <span>UniMarket</span>
            </h1>
          </a>
        </slot>
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
      width: 1.5em;
      height: 1.5em;
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

  // // runs each time the component is added to the dom 
  // connectedCallback() {
  //   // looks in light-DOM for element with slot="nav-link"; created a reference to that element
  //   const link = this.querySelector('a[slot="nav-link"]'); 
  //   // Get the href from the element  
  //   const href = link?.getAttribute("href") || "#"; 
  //   // find an a tag in the shadow-DOM and replace with the new href
  //   this.shadowRoot.querySelector("a").setAttribute("href", href); 
  // }

  // get src() {
  //   return this.getAttribute("src");
  // }

  // connectedCallback() {
  //   if (this.src) this.hydrate(this.src);
  // }

  // hydrate(url) {
  //   fetch(url)
  //     .then((res) => {
  //       if (res.status !== 200) throw `Status: ${res.status}`;
  //       return res.json();
  //     })
  //     .then((json) => this.renderSlots(json))
  //     .catch((error) =>
  //       console.log(`Failed to render data ${url}:`, error)
  //     );
  // }

  // renderSlots(json) {
  //   const entries = Object.entries(json);
  //   const toSlot = ([key, value]) => {
  //     console.log("key", key);
  //     console.log("value", value);
  //     if (key == "nav-link") {
  //       return html`<a href="listings"></a>`;
  //     }
  //     return html`<span slot="${key}">${value}</span>`;
  //   };
    
  //   const fragment = entries.map(toSlot);
  //   this.replaceChildren(...fragment);
  // }

  constructor() {
    super();
    shadow(this)
      .template(UniMarketNav.template)
      .styles(reset.styles, UniMarketNav.styles);
  }
}
