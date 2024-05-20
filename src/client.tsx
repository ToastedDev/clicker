import { Hono } from "hono";
import { Style, css, cx } from "hono/css";
import { jsxRenderer } from "hono/jsx-renderer";
import { getClicks } from "./lib/db";
import { useState } from "hono/jsx";

export const client = new Hono();

client.get(
  "*",
  jsxRenderer(({ children }) => (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/static/odometer.css" />
        <script src="/static/odometer.js" />
        <script src="/static/script.js" />
        <Style>
          {css`
            @import url("https://fonts.googleapis.com/css2?family=Yantramanav:wght@700&family=Inter:wght@100..900&display=swap");

            * {
              padding: 0;
              margin: 0;
            }
          `}
        </Style>
      </head>
      <body>{children}</body>
    </html>
  ))
);

client.get("/", async (c) => {
  const clicks = await getClicks();

  const mainClass = css`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: black;
  `;
  const countClass = css`
    font-family: "Yantramanav", sans-serif;
    font-weight: bold;
    font-size: 5em;
    line-height: 1.1em;
    color: white;
    padding: 5px;
  `;
  const buttonClass = css`
    font-family: "Inter", sans-serif;
    font-size: 0.9em;
    background-color: orange;
    border: none;
    padding: 5px;
    border-radius: 0.5em;
    margin-top: 5px;
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  `;

  return c.render(
    <main class={mainClass}>
      <img
        src="/static/ToastedToast.png"
        alt="ToastedToast"
        width={100}
        height={100}
      />
      <p class={cx(countClass, "odometer")} id="count">
        {clicks}
      </p>
      <button class={buttonClass} id="increment">
        +1
      </button>
    </main>
  );
});
