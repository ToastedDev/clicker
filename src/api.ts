import { Hono } from "hono";
import { cors } from "hono/cors";
import { getClicks, getHistory, incrementClicks } from "./lib/db";

export const api = new Hono();

api.get("/clicks", cors(), async (c) => {
  const clicks = await getClicks();
  return c.json({ clicks });
});

api.post("/clicks", async (c) => {
  await incrementClicks();
  return new Response(null, { status: 204 });
});

api.get("/analytics", cors(), async (c) => {
  const history = await getHistory();
  return c.json(history);
});
