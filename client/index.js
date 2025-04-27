import { Hono } from "hono";
import { getAnalytics, getClicks, getCountries } from "..";
import { countryCodes } from "./countries";
import { renderFile } from "ejs";
import path from "path";

export const client = new Hono();

function renderPage(page, data) {
  return renderFile(path.join(__dirname, `./pages/${page}.ejs`), data);
}

client.get("/", async (ctx) => {
  const initialClicks = await getClicks();
  return ctx.html(await renderPage("index", { clicks: initialClicks }));
});

client.get("/lb", async (ctx) => {
  const countries = (await getCountries()).map((country) => ({
    id: country.code,
    name: countryCodes[country.code],
    count: country.clicks,
  }));
  return ctx.html(await renderPage("leaderboard", { countries }));
});

client.get("/analytics", async (ctx) => {
  const analytics = await getAnalytics();
  return ctx.html(
    await renderPage("analytics", { data: JSON.stringify(analytics) })
  );
});
