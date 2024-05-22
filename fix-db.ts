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

export async function fixDb() {
  for (const history of db.history) {
    const date = new Date(history.date);
    if (history.count === 2560579) {
      date.setHours(date.getHours() - 5);
    }
    if (history.count >= 3870782 && history.count < 4851472) {
      date.setHours(date.getHours() + 5);
    }
    history.date = date.getTime();
    console.log("Updated", date);
  }
  await Bun.write(jsonDatabaseFile, JSON.stringify(db, null, 2));
}

fixDb();
