import { Hono } from "hono";
import { Style, css, cx } from "hono/css";
import { jsxRenderer } from "hono/jsx-renderer";
import { getClicks, getHistory } from "./lib/db";

export const client = new Hono();

client.get(
  "*",
  jsxRenderer(({ children }) => (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/static/odometer.css" />
        <script src="/static/odometer.js" />
        <script src="https://code.highcharts.com/10.3.3/highcharts.js" />
        <Style>
          {css`
            @import url("https://fonts.googleapis.com/css2?family=Yantramanav:wght@700&family=Inter:wght@100..900&display=swap");

            * {
              padding: 0;
              margin: 0;
            }

            body {
              background: rgb(67, 20, 7);
              min-height: 100vh;
              display: flex;
              flex-direction: column;
            }

            ::-webkit-scrollbar {
              width: 8px;
            }

            ::-webkit-scrollbar-track {
              background-color: rgb(67, 20, 7);
            }

            ::-webkit-scrollbar-thumb {
              border-radius: 0.5rem;
              background-color: rgb(249, 115, 22);
            }

            ::-webkit-scrollbar-thumb:hover {
              background-color: #f97316bf;
            }

            ::-moz-selection {
              background-color: rgb(249, 115, 22);
            }

            ::selection {
              background-color: rgb(249, 115, 22);
            }
          `}
        </Style>
      </head>
      <body>{children}</body>
    </html>
  ))
);

const mainClass = css`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 48rem;
  padding: 1rem;
  margin-left: auto;
  margin-right: auto;
`;
const cardClass = css`
  background-color: #9a341280;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 0.5rem;
`;
const buttonAsCardClass = css`
  ${cardClass}
  font-family: "Inter", sans-serif;
  display: block;
  text-align: center;
  color: white;
  text-decoration: none;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    opacity: 0.8;
  }
`;

client.get("/", async (c) => {
  const clicks = await getClicks();

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
    background-color: rgb(249, 115, 22);
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
    <>
      <main class={mainClass}>
        <div class={cardClass}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={80}
            height={80}
            viewBox="0 0 14 14"
            style="color: rgb(249, 115, 22);"
          >
            <g fill="currentColor">
              <path d="M9.5 4.5A2.5 2.5 0 0 0 7 2H2.5A2.5 2.5 0 0 0 1 6.5v5a1 1 0 0 0 1 1h5.5a1 1 0 0 0 1-1v-5a2.49 2.49 0 0 0 1-2"></path>
              <path
                fill-rule="evenodd"
                d="M10.695 2.97a3.99 3.99 0 0 1-.226 3.525H13l.008-.001A2.49 2.49 0 0 0 14 4.5A2.5 2.5 0 0 0 11.5 2h-1.377c.235.294.428.62.572.97M13 7.743h-3V11.5a2.5 2.5 0 0 1-.209 1H12a1 1 0 0 0 1-1z"
                clip-rule="evenodd"
              ></path>
            </g>
          </svg>
          <p class={cx(countClass, "odometer")} id="count">
            {clicks}
          </p>
          <button class={buttonClass} id="increment">
            +1
          </button>
        </div>
        <a
          href="/analytics"
          class={buttonAsCardClass}
          style="display: flex; flex-direction: row; align-items: center; gap: 0.25rem;"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="width: 1.25rem; height: 1.25rem; margin-right: 0.25rem;"
          >
            <path d="M3 3v18h18" />
            <path d="M13 17V9" />
            <path d="M18 17V5" />
            <path d="M8 17v-3" />
          </svg>
          View analytics
        </a>
        <div class={cardClass}>
          <div id="chart" />
        </div>
      </main>
      <script src="/static/script.js" />
    </>
  );
});

client.get("/analytics", async (c) => {
  const analytics = await getHistory();
  console.log(analytics);

  return c.render(
    <>
      <main class={mainClass}>
        <div class={cardClass}>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={56}
              height={56}
              viewBox="0 0 14 14"
              style="color: rgb(249, 115, 22);"
            >
              <g fill="currentColor">
                <path d="M9.5 4.5A2.5 2.5 0 0 0 7 2H2.5A2.5 2.5 0 0 0 1 6.5v5a1 1 0 0 0 1 1h5.5a1 1 0 0 0 1-1v-5a2.49 2.49 0 0 0 1-2"></path>
                <path
                  fill-rule="evenodd"
                  d="M10.695 2.97a3.99 3.99 0 0 1-.226 3.525H13l.008-.001A2.49 2.49 0 0 0 14 4.5A2.5 2.5 0 0 0 11.5 2h-1.377c.235.294.428.62.572.97M13 7.743h-3V11.5a2.5 2.5 0 0 1-.209 1H12a1 1 0 0 0 1-1z"
                  clip-rule="evenodd"
                ></path>
              </g>
            </svg>
            <h1 style='font-size: 2rem; color: rgb(249, 115, 22); font-family: "Inter", sans-serif; letter-spacing: -0.05em;'>
              Analytics
            </h1>
          </div>
        </div>
        <a
          href="/"
          class={buttonAsCardClass}
          style="display: flex; flex-direction: row; align-items: center; gap: 0.25rem;"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            style="width: 1.25rem; height: 1.25rem; margin-right: 0.25rem;"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Go back to clicker
        </a>
        <div class={cardClass}>
          <div id="minutely-chart" />
        </div>
      </main>
      <script
        type="application/json"
        id="analytics"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            analytics.map((datapoint) => [datapoint.createdAt, datapoint.count])
          ),
        }}
      />
      <script src="/static/analytics.js" />
    </>
  );
});
