import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { Layout } from "./components/layout";
import { css } from "hono/css";

const app = new Hono();

const staticFiles = serveStatic({ root: "./" });
app.get("/static/favicon.svg", staticFiles);

app.get("/", (c) => {
  const mainClass = css`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    padding: 1rem;
  `;
  const cardClass = css`
    background-color: #9a341280;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: 0.5rem;
  `;
  const headingClass = css`
    font-family: "Inter", sans-serif;
    font-weight: bold;
    font-size: 2em;
    line-height: 1.1em;
    color: white;
  `;
  const subheadingClass = css`
    font-family: "Inter", sans-serif;
    font-size: 1em;
    color: white;
    padding: 5px;
  `;

  return c.html(
    <Layout title="Coming soon">
      <main class={mainClass}>
        <div class={cardClass}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={80}
            height={80}
            viewBox="0 0 14 14"
            style="color: rgb(249, 115, 22); margin-bottom: 15px;"
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
          <h1 class={headingClass}>Coming soon</h1>
          <p class={subheadingClass}>
            Toasted Clicker will be released soon. Check back later.
          </p>
        </div>
      </main>
    </Layout>
  );
});

app.notFound((c) => c.redirect("/"));

const port = parseInt(process.env.PORT || "3000");
export default {
  fetch: app.fetch,
  port,
};
