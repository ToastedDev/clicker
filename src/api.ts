import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import {
  addToCountryClicks,
  getClicks,
  getCountries,
  getHistory,
  incrementClicks,
} from "./lib/db";

export const api = new Hono();

api.get("*", cors());

api.get("/clicks", async (c) => {
  const clicks = await getClicks();
  return c.json({ clicks });
});

function getCountry(c: Context) {
  const country = c.req.header("CF-IPCountry");
  if (!country || country === "XX" || country === "T1") return null;
  return country;
}

api.post("/clicks", async (c) => {
  await incrementClicks();

  const country = getCountry(c);
  if (country) await addToCountryClicks(country);

  return new Response(null, { status: 204 });
});

api.get("/analytics", async (c) => {
  const history = await getHistory();
  return c.json(history);
});

api.get("/countries", async (c) => {
  const countries = await getCountries();
  return c.json({
    countries: countries.map((country) => ({
      country: country.id,
      clicks: country.count,
    })),
  });
});
