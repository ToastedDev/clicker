import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { css, Style } from "hono/css";

const app = new Hono();

const staticFiles = serveStatic({ root: "./" });
app.get("/static/favicon.svg", staticFiles);

function Layout({ children, title }) {
  title = title ? `${title} — Toasted Clicker` : "Toasted Clicker";
  const description = "The toastiest clicker in the world!";
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>{title}</title>
        <link
          rel="icon"
          type="image/svg+xml"
          href="https://toasted.dev/favicon.svg"
        />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://toasted.dev/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:creator" content="@ToastedDev" />
        <meta name="twitter:creator:id" content="1145171094556426240" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:image" content="https://toasted.dev/logo.png" />
        <meta name="twitter:image" content="https://toasted.dev/logo.png" />
        <meta name="twitter:card" content="summary" />
        <meta name="theme-color" content="#ff6900" />
        <link rel="stylesheet" href="/static/odometer.css" />
        <script src="/static/odometer.js" />
        <script src="https://code.highcharts.com/10.3.3/highcharts.js" />
        <Style>
          {css`
            @import url("https://fonts.googleapis.com/css2?family=Yantramanav:wght@700&family=Inter:wght@100..900&display=swap");

            * {
              padding: 0;
              margin: 0;
              box-sizing: border-box;
            }

            body {
              background: rgb(67, 20, 7);
              color: white;
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

            [data-highcharts-chart] {
              width: 100%;
            }

            .highcharts-reset-zoom {
              border-radius: 8px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
          `}
        </Style>
      </head>
      <body>{children}</body>
    </html>
  );
}

const main = css`
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
const card = css`
  background-color: #ff6900;
  color: black;
  padding: 1rem;
  border-radius: 5px;
  width: 100%;
  box-shadow: 4px 4px 0px 0px black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

app.get("/", (c) => {
  const heading = css`
    font-family: "Inter", sans-serif;
    font-weight: bold;
    font-size: 2em;
    line-height: 1.1em;
  `;
  const subheading = css`
    font-family: "Inter", sans-serif;
    font-size: 1em;
    padding: 5px;
  `;

  return c.html(
    <Layout title="Coming soon">
      <main class={main} style="justify-content: center;">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={80}
          height={80}
          viewBox="0 0 14 14"
          style="color: #ff6900; margin-bottom: 5px; margin-inline: auto;"
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
        <div class={card}>
          <h1 class={heading}>Coming soon</h1>
          <p class={subheading}>
            Toasted Clicker will be released soon. Check back later.
          </p>
        </div>
      </main>
    </Layout>
  );
});

app.notFound((c) => c.redirect("/"));

const port = parseInt(process.env.PORT || "3000");
Bun.serve({
  fetch: app.fetch,
  port,
});
