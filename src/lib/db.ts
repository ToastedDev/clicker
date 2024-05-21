import { readFile, exists } from "node:fs/promises";
import { join } from "node:path";
import { Database } from "bun:sqlite";

interface Click {
  id: string;
  count: number;
}

interface ClickHistory {
  id: number;
  clicker_id: string;
  created_at: string;
  count: number;
}

interface CountryClick {
  id: string;
  clicker_id: string;
  count: number;
}

async function createDatabase() {
  const databaseFile = join(process.cwd(), "data.db");
  if (await exists(databaseFile)) return new Database(databaseFile);

  const db = new Database(databaseFile);
  const sqlCommands = await readFile(join(process.cwd(), "init.sql"), "utf-8");
  db.exec(sqlCommands);
  // to make sure this exists (for old dbs)
  db.exec(`
    CREATE TABLE IF NOT EXISTS country_clicks (
      id TEXT PRIMARY KEY,
      clicker_id TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS country_clicks_clicker_id_idx ON country_clicks (clicker_id);
  `);

  return db;
}

const db = await createDatabase();

export async function getClicks() {
  const click = (await db
    .query("SELECT count FROM clicks WHERE id = ?")
    .get("toasted-clicker")) as Click | null;
  if (!click) {
    db.query("INSERT INTO clicks (id) VALUES (?)").all("toasted-clicker");
    return 0;
  }

  return click.count;
}

export async function incrementClicks() {
  await db
    .query("UPDATE clicks SET count = count + 1 WHERE id = ?")
    .get("toasted-clicker");
}

export async function getHistory() {
  const history = db
    .query("SELECT * FROM history WHERE clicker_id = ?")
    .all("toasted-clicker") as ClickHistory[];

  return history.map(({ created_at, count }) => ({
    createdAt: new Date(created_at),
    count,
  }));
}

export async function addToHistory(clicks: number) {
  db.query(
    "INSERT INTO history (clicker_id, count) VALUES ($clickerId, $clicks)"
  ).all({ $clickerId: "toasted-clicker", $clicks: clicks });
}

export async function getCountries() {
  const countries = db
    .query("SELECT * FROM country_clicks WHERE clicker_id = ?")
    .all("toasted-clicker") as CountryClick[];
  return countries;
}

export async function getCountry(country: string) {
  const countryClick = db
    .query(
      "SELECT count FROM country_clicks WHERE clicker_id = $clickerId AND id = $country"
    )
    .get({
      $clickerId: "toasted-clicker",
      $country: country,
    }) as CountryClick | null;
  return countryClick;
}

export async function addToCountryClicks(country: string) {
  db.query(
    "INSERT INTO country_clicks (clicker_id, id, count) VALUES ($clickerId, $country, 1) ON CONFLICT (id) DO UPDATE SET count = country_clicks.count + 1"
  ).all({ $clickerId: "toasted-clicker", $country: country });
}
