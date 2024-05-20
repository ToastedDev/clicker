import { Hono } from "hono";
import { client } from "./client";
import { getClicks } from "./lib/db";

const app = new Hono();

app.get("/clicks", async (c) => {
  const clicks = await getClicks();
  return c.json({ clicks });
});

app.route("/", client);

const port = parseInt(process.env.PORT || "3000");
export default {
  fetch: app.fetch,
  port,
};
