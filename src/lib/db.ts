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

async function createDatabase() {
  const databaseFile = join(process.cwd(), "data.db");
  if (await exists(databaseFile)) return new Database(databaseFile);

  const db = new Database(databaseFile);
  const sqlCommands = await readFile(join(process.cwd(), "init.sql"), "utf-8");
  console.log(sqlCommands);
  db.exec(sqlCommands);

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
