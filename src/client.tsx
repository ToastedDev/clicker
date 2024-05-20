import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";

export const client = new Hono();

client.get(
  "*",
  jsxRenderer(({ children }) => (
    <html lang="en">
      <body>{children}</body>
    </html>
  ))
);

client.get("/", (c) => {
  return c.html(<h1>Hello world!</h1>);
});
