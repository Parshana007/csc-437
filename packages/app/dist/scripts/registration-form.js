import { css, html, shadow, Events } from "@calpoly/mustang";

export class RegistrationForm extends HTMLElement {
  static template = html`<template>
    <form>
      <main class="center-container">
        <slot name="title">
          <h2>Sign up to create a Username and Password</h2>
        </slot>
        <section class="registerContent">
          <label>
            <span>
              <slot name="username">Username</slot>
            </span>
            <input name="username" autocomplete="off" />
          </label>
          <label>
            <span>
              <slot name="password">Password</slot>
            </span>
            <input type="password" name="password" />
          </label>
          <slot name="submit">
            <button type="submit">Sign Up</button>
          </slot>
        </section>
      </main>
    </form>
  </template>`;

  static styles = css`
    .center-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .registerContent {
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
      background-color: var(--color-sage);
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
    }
    form {
      display: grid;
      grid-column: 1/-1;
      grid-template-columns: subgrid;
      gap: inherit;
    }

    label {
      display: contents;

      > span {
        grid-column: 1 / auto;
        justify-self: end;
      }
      > input {
        grid-column: auto / span 2;
      }
    }

    ::slotted(*[slot="title"]),
    slot[name="title"] > * {
      grid-column: 1/-1;
    }

    ::slotted(button[slot="submit"]),
    button[type="submit"] {
      grid-column: 2 / -2;
      align-self: center;
    }
  `;

  get form() {
    return this.shadowRoot.querySelector("form");
  }

  constructor() {
    super();

    shadow(this)
      .template(RegistrationForm.template)
      .styles(RegistrationForm.styles);

    this.form.addEventListener("submit", (event) =>
      submitRegistrationForm(
        event,
        this.getAttribute("api"),
        this.getAttribute("redirect") || "/login"
      )
    );
  }
}

function submitRegistrationForm(event, endpoint, redirect) {
  event.preventDefault();

  const form = event.target.closest("form");
  const data = new FormData(form);
  const method = "POST";
  const headers = {
    "Content-Type": "application/json",
  };
  const body = JSON.stringify(Object.fromEntries(data));

  console.log("POST new user request:", body);

  fetch(endpoint, { method, headers, body })
    .then((res) => {
      if (res.status !== 201)
        throw `Form submission failed: Status ${res.status}`;
      return res.json();
    })
    .then((payload) => {
      const { token } = payload;

      Events.dispatch;
      form.dispatchEvent(
        new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token, redirect }],
        })
      );
    })
    .catch((err) => console.log("Error submitting form:", err));
}
