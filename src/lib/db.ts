import { exists } from "node:fs/promises";
import { join } from "node:path";
import { Database } from "bun:sqlite";

interface Meta {
  clicks: number;
  history: {
    date: number;
    count: number;
  }[];
  countries: {
    id: string;
    count: number;
  }[];
}

const jsonDatabaseFile = join(process.cwd(), "data.json");

async function initDatabase() {
  const sqlDatabaseFile = join(process.cwd(), "data.db");
  const dataFile = Bun.file(jsonDatabaseFile);
  const jsonFileDoesNotExist =
    !(await exists(jsonDatabaseFile)) ?? !dataFile.size;
  if ((await exists(sqlDatabaseFile)) && jsonFileDoesNotExist) {
    const db = new Database(sqlDatabaseFile);
    const data: Meta = {
      clicks: (
        db
          .query("SELECT count FROM clicks WHERE id = ?")
          .get("toasted-clicker") as any
      ).count,
      history: (
        db
          .query("SELECT * FROM history WHERE clicker_id = ?")
          .all("toasted-clicker") as any
      ).map(({ created_at, count }: any) => ({
        date: new Date(created_at).toISOString(),
        count,
      })),
      countries: (
        db
          .query(
            "SELECT * FROM country_clicks WHERE clicker_id = ? ORDER BY count DESC"
          )
          .all("toasted-clicker") as any
      ).map(({ id, count }: any) => ({
        id,
        count,
      })),
    };
    await Bun.write(jsonDatabaseFile, JSON.stringify(data));
    return;
  }
  if (jsonFileDoesNotExist) {
    const data: Meta = {
      clicks: 0,
      history: [],
      countries: [],
    };
    await Bun.write(jsonDatabaseFile, JSON.stringify(data));
    return;
  }
}

await initDatabase();

const dataFile = Bun.file(jsonDatabaseFile);
const db: Meta = JSON.parse(
  Buffer.from(await dataFile.arrayBuffer()).toString()
);

export async function getClicks() {
  return db.clicks;
}

export async function incrementClicks() {
  db.clicks += 1;
}

export async function getHistory() {
  return db.history;
}

export async function addToHistory(clicks: number) {
  db.history.push({ date: new Date().getTime(), count: clicks });
}

export async function getCountries() {
  return [...db.countries].sort((a, b) => b.count - a.count);
}

export async function getCountry(country: string) {
  return db.countries.find(({ id }) => id === country);
}

export async function addToCountryClicks(country: string) {
  const index = db.countries.findIndex(({ id }) => id === country);
  if (index === -1) {
    db.countries.push({ id: country, count: 0 });
  }
  db.countries[index].count += 1;
}

setInterval(async () => {
  await Bun.write(jsonDatabaseFile, JSON.stringify(db));
}, 10_000);
