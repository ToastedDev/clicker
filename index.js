import { Hono } from "hono";
import { cors } from "hono/cors";
import { redis } from "bun";
import { client } from "./client";
import { serveStatic } from "hono/bun";
import { CronJob } from "cron";

const app = new Hono().use(cors());

app.get("/static/*", serveStatic({ root: "./" }));
app.route("/", client);

const KV_PREFIX = "toasted-clicker";
const CLICKS_KEY = `${KV_PREFIX}:clicks`;
const COUNTRIES_PREFIX = `${KV_PREFIX}:country`;

export async function getClicks() {
  return parseInt((await redis.get(CLICKS_KEY)) ?? 0);
}

export async function getCountries() {
  const keys = await redis.keys(`${COUNTRIES_PREFIX}:*`);
  if (keys.length > 0) {
    const values = await redis.mget(...keys);
    return values.map((clicks, index) => ({
      code: keys[index].replace(`${COUNTRIES_PREFIX}:`, ""),
      clicks: parseInt(clicks),
    })).sort((a, b) => b.clicks - a.clicks);
  } else {
    return [];
  }
}

if (!(await redis.exists(CLICKS_KEY))) await redis.set(CLICKS_KEY, 0);

app.get("/api/clicks", async (ctx) => {
  return ctx.json({
    clicks: await getClicks(),
  });
});

app.get("/api/countries", async (ctx) => {
  return ctx.json(await getCountries());
});

app.post("/api/click", async (ctx) => {
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

import fs from "fs";

const ANALYTICS_FILE = "./analytics.csv";

async function updateAnalytics() {
  const clicks = await getClicks();

  if (!fs.existsSync(ANALYTICS_FILE))
    fs.writeFileSync(
      ANALYTICS_FILE,
      `date,count\n${new Date().toISOString()},${clicks}`
    );
  else
    fs.appendFileSync(
      ANALYTICS_FILE,
      `\n${new Date().toISOString()},${clicks}`
    );

  console.log("Updated analytics", new Date().toISOString());
}

export async function getAnalytics() {
  const text = fs.readFileSync(ANALYTICS_FILE, "utf-8");
  return text
    .trim()
    .split("\n")
    .filter((str) => str.toLowerCase() !== "date,clicks")
    .map((str) => [str.split(",")[0], parseInt(str.split(",")[1])]);
}

const cronJob = new CronJob(
  "* * * * *",
  updateAnalytics,
  null,
  true,
  "Africa/Abidjan"
);
cronJob.start();
