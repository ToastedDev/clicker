import { Hono } from "hono";
import { client } from "./client";
import { getClicks, incrementClicks } from "./lib/db";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";

const app = new Hono();

app.get("/static/*", serveStatic({ root: "./" }));

app.get("/clicks", cors(), async (c) => {
  const clicks = await getClicks();
  return c.json({ clicks });
});

app.post("/clicks", async (c) => {
  await incrementClicks();
  return new Response(null, { status: 204 });
});

app.route("/", client);

const port = parseInt(process.env.PORT || "3000");
export default {
  fetch: app.fetch,
  port,
};
