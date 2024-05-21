import { Hono } from "hono";
import { client } from "./client";
import { getClicks, getHistory, incrementClicks } from "./lib/db";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { CronJob } from "cron";
import { updateAnalytics } from "./lib/analytics";

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

const globalForCronJob = globalThis as unknown as {
  cronJob: CronJob | undefined;
};

const cronJob =
  globalForCronJob.cronJob ??
  new CronJob("* * * * *", updateAnalytics, null, true, "Africa/Abidjan");
if (process.env.NODE_ENV !== "production") globalForCronJob.cronJob = cronJob;
cronJob.start();
