import { css } from "@calpoly/mustang";

const styles = css`
  .listings {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: var(--size-type-small);
    margin: 0.5rem;
  }

  figure {
    display: flex;
    flex-direction: column;
    margin: 0;
  }

  header {
    display: flex;
    flex-direction: row;
  }

  header h1 {
    font-size: var(--size-type-xxlarge);
    font-family: var(--font-family-display);
    padding: 0.5rem;
    width: 100%;
    margin: 0;
  }

  figure img {
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
  }

  p {
    margin: 0.5rem;
  }

  a:hover {
    text-decoration: underline;
  }

  a {
    color: var(--color-link);
    text-decoration: none;
  }

  .navBar {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 0.5em;
  }

  header {
    background-color: var(--color-eggplant);
    color: var(--color-white);
    margin: 0;
    margin-bottom: var(--content-size-small);
  }

  body {
    background-color: var(--color-sage);
    font-family: var(--font-family-body);
    font-size: calc(var(--content-size-small) + 0.1vw);
    margin: 0;
    color: var(--color-white);
  }

  .icon-market {
    width: 1.5em;
    height: 1.5em;
    margin: 0;
    padding-left: var(--content-size-small);
    fill: var(--color-white);
  }

  h2 {
    margin-top: 0;
  }
`;

export default { styles };
