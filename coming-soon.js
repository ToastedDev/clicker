import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { Layout } from "./client/layout";
import { css } from "hono/css";
import { card, main } from "./client/css";

const app = new Hono();

const staticFiles = serveStatic({ root: "./" });
app.get("/static/favicon.svg", staticFiles);

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
