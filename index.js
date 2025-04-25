import { Hono } from "hono";
import { cors } from "hono/cors";
import { redis } from "bun";

const app = new Hono().use(cors());

const KV_PREFIX = "toasted-clicker";
const CLICKS_KEY = `${KV_PREFIX}:clicks`;

async function getClicks() {
  return parseInt((await redis.get(CLICKS_KEY)) ?? 0);
}

if (!(await redis.exists(CLICKS_KEY))) await redis.set(CLICKS_KEY, 0);

app.get("/clicks", async (ctx) => {
  return ctx.json({
    clicks: await getClicks(),
  });
});

app.post("/click", async (ctx) => {
  await redis.incr(CLICKS_KEY);
  return ctx.text("OK", 204);
});

Bun.serve({
  fetch: app.fetch,
  port: process.env.PORT || 3000,
});
