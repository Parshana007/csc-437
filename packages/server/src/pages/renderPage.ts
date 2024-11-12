import { PageParts, renderWithDefaults } from "@calpoly/mustang/server";

const defaults = {
  stylesheets: ["/styles/reset.css", "/styles/tokens.css", "/styles/page.css"],
  scripts: [
    `
    import { define } from "@calpoly/mustang";
    import { UniMarketNav } from "../js/uni-market-nav.js";
    import { Events } from "@calpoly/mustang";

      window.relayEvent = Events.relay;

      function toggleDarkMode(page, checked) {
        page.classList.toggle("dark-mode", checked);
      }

      document.body.addEventListener("dark-mode", (event) =>
        toggleDarkMode(event.currentTarget, event.detail.checked)
      );
      
      define({
        "uni-market-nav" : UniMarketNav
      });
    `,
  ],
  googleFontURL:
    "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Playfair+Display:wght@400;700&display=swap",
  imports: {
    "@calpoly/mustang": "https://unpkg.com/@calpoly/mustang",
  },
};

export default function renderPage(page: PageParts) {
  return renderWithDefaults(page, defaults);
}
