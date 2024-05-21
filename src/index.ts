import { Hono } from "hono";
import { client } from "./client";
import { serveStatic } from "hono/bun";
import { CronJob } from "cron";
import { updateAnalytics } from "./lib/analytics";
import { api } from "./api";

const app = new Hono();

app.get("/static/*", serveStatic({ root: "./" }));

app.route("/", client);
app.route("/api", api);

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
