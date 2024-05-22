import { Hono } from "hono";
import { Style, css, cx } from "hono/css";
import { jsxRenderer } from "hono/jsx-renderer";
import { getClicks, getCountries, getHistory } from "./lib/db";
import { Layout } from "./components/layout";
import { countryCodes } from "./lib/countries";

export const client = new Hono();

declare module "hono" {
  interface ContextRenderer {
    (content: string | Promise<string>, props?: { title?: string }): Response;
  }
}

client.get(
  "*",
  jsxRenderer(({ children, title }) => (
    <Layout title={title}>{children}</Layout>
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
const baseCardClass = css`
  background-color: #9a341280;
  padding: 1rem;
  border-radius: 0.5rem;
  width: 100%;
`;
const cardClass = css`
  ${baseCardClass}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const buttonAsCardClass = css`
  ${cardClass}
  font-family: "Inter", sans-serif;
  display: block;
  text-align: center;
  color: white;
  text-decoration: none;
  border: none;
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1em;
  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
`;

client.get("/", async (c) => {
  const clicks = await getClicks();

  const countClass = css`
    font-family: "Yantramanav", sans-serif;
    font-weight: bold;
    font-size: 3rem;
    line-height: 1.1em;
    color: white;
    padding: 5px;
    @media (min-width: 640px) {
      & {
        font-size: 4rem;
      }
    }
    @media (min-width: 768px) {
      & {
        font-size: 4.5rem;
      }
    }
    @media (min-width: 1024px) {
      & {
        font-size: 5rem;
      }
    }
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

        <div style="display: flex; align-items: center; gap: 0.5rem;">
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
          <a
            href="/lb"
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
              <line x1="8" x2="21" y1="6" y2="6" />
              <line x1="8" x2="21" y1="12" y2="12" />
              <line x1="8" x2="21" y1="18" y2="18" />
              <line x1="3" x2="3.01" y1="6" y2="6" />
              <line x1="3" x2="3.01" y1="12" y2="12" />
              <line x1="3" x2="3.01" y1="18" y2="18" />
            </svg>
            View country leaderboard
          </a>
        </div>
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
  return c.render(
    <>
      <main class={mainClass}>
        <div class={cardClass}>
          <div style="display: flex; align-items: center; gap: 0.5rem; text-align: center;">
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
        <div style="display: flex; align-items: center; gap: 0.5rem;">
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
          <button
            href="/"
            id="download-csv"
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Download data as CSV
          </button>
        </div>
        {["minutely", "hourly", "daily"].map((chartType) => (
          <div class={cardClass}>
            <div id={`${chartType}-chart`} />
          </div>
        ))}
      </main>
      <script
        type="application/json"
        id="analytics-data"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            analytics.map((datapoint) => [datapoint.date, datapoint.count])
          ),
        }}
      />
      <script src="/static/analytics.js" />
    </>,
    { title: "Analytics" }
  );
});

client.get("/lb", async (c) => {
  const countries = (await getCountries()).map((country) => ({
    id: country.id,
    name: countryCodes[country.id as keyof typeof countryCodes],
    count: country.count,
  }));

  const tableClass = css`
    ${baseCardClass}
    color: white;
    font-family: "Inter", sans-serif;
    border-collapse: collapse;
    & > tbody td,
    & > thead th {
      padding: 1rem;
    }
    & > tbody td {
      border-top: 1px solid rgb(249, 115, 22);
    }
    & > tbody td:not(:first-child):not(:last-child),
    & > thead th:not(:first-child):not(:last-child) {
      border-left: 1px solid rgb(249, 115, 22);
      border-right: 1px solid rgb(249, 115, 22);
    }
  `;
  const countryClass = css`
    display: flex;
    align-items: center;
    gap: 0.5rem;
  `;

  return c.render(
    <>
      <main class={mainClass}>
        <div class={cardClass}>
          <div style="display: flex; align-items: center; gap: 0.5rem; text-align: center;">
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
              Country Leaderboard
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
        <table class={tableClass}>
          <thead>
            <tr>
              <th style="text-align: center;">Rank</th>
              <th style="text-align: left; line-height: 1.5em;">Country</th>
              <th style="text-align: center;">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((country, index) => (
              <tr>
                <td style="text-align: center;">#{index + 1}</td>
                <td class={countryClass}>
                  <img
                    src={`https://flagcdn.com/w80/${country.id.toLowerCase()}.png`}
                    alt={country.name}
                    width={40}
                    height={20}
                    style="object-fit: cover;"
                  />
                  <p>{country.name}</p>
                </td>
                <td style="text-align: center;">
                  {country.count.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>,
    { title: "Country Leaderboard" }
  );
});
