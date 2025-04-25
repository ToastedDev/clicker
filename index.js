import { Hono } from "hono";
import { cors } from "hono/cors";
import { redis } from "bun";

const app = new Hono().use(cors());

const KV_PREFIX = "toasted-clicker";
const CLICKS_KEY = `${KV_PREFIX}:clicks`;
const COUNTRIES_PREFIX = `${KV_PREFIX}:country`;

async function getClicks() {
  return parseInt((await redis.get(CLICKS_KEY)) ?? 0);
}

if (!(await redis.exists(CLICKS_KEY))) await redis.set(CLICKS_KEY, 0);

app.get("/clicks", async (ctx) => {
  return ctx.json({
    clicks: await getClicks(),
  });
});

app.get("/countries", async (ctx) => {
  const keys = await redis.keys(`${COUNTRIES_PREFIX}:*`);
  if (keys.length > 0) {
    const values = await redis.mget(...keys);
    return ctx.json(
      values.map((clicks, index) => ({
        code: keys[index].replace(`${COUNTRIES_PREFIX}:`, ""),
        clicks: parseInt(clicks),
      }))
    );
  } else {
    return ctx.json([]);
  }
});

app.post("/click", async (ctx) => {
  await redis.incr(CLICKS_KEY);

  const country = ctx.req.header("CF-IPCountry") ?? "XX";
  if (!(await redis.exists(`${COUNTRIES_PREFIX}:${country}`)))
    await redis.set(`${COUNTRIES_PREFIX}:${country}`, 1);
  else await redis.incr(`${COUNTRIES_PREFIX}:${country}`);

  return ctx.text("OK", 204);
});

Bun.serve({
  fetch: app.fetch,
  port: process.env.PORT || 3000,
});
