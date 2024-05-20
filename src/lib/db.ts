import { readFile, exists } from "node:fs/promises";
import { join } from "node:path";
import { Database } from "bun:sqlite";

interface Click {
  id: string;
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
    await db.query("INSERT INTO clicks (id) VALUES (?)").all("toasted-clicker");
    return 0;
  }

  return click.count;
}

export async function incrementClicks() {
  await db
    .query("UPDATE clicks SET count = count + 1 WHERE id = ?")
    .get("toasted-clicker");
}
