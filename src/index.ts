import { Hono } from "hono";
import { client } from "./client";

const app = new Hono();

app.route("/", client);

const port = parseInt(process.env.PORT || "3000");
export default {
  fetch: app.fetch,
  port,
};
