import { Hono } from "hono";
import { Style, css } from "hono/css";
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
        <Style>
          {css`
            @import url("https://fonts.googleapis.com/css2?family=Yantramanav:wght@700&display=swap");

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

function Counter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(1_000_000);
  const countClass = css`
    font-family: "Yantramanav", sans-serif;
    font-weight: bold;
    font-size: 4em;
    line-height: 1.1em;
    color: white;
    padding-top: 15px;
  `;

  return (
    <>
      <p class={countClass}>{count}</p>
    </>
  );
}

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

  return c.render(
    <main class={mainClass}>
      <img
        src="/static/ToastedToast.png"
        alt="ToastedToast"
        width={90}
        height={90}
      />
      <Counter initialCount={clicks} />
    </main>
  );
});
