import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello World!");
});

const port = parseInt(process.env.PORT || "3000");
export default {
  fetch: app.fetch,
  port,
};
