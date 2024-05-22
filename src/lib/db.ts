import { exists, mkdir, appendFile } from "node:fs/promises";
import { join } from "node:path";

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

const dataDir = join(process.cwd(), "data");

const oldDatabaseFile = join(process.cwd(), "data.json");
const databaseFile = join(dataDir, "data.json");
const analyticsFile = join(dataDir, "analytics.csv");

async function initDatabase() {
  if (!(await exists(databaseFile)) && (await exists(oldDatabaseFile))) {
    const oldData: Meta = JSON.parse(
      Buffer.from(await Bun.file(oldDatabaseFile).arrayBuffer()).toString()
    );
    await Bun.write(
      databaseFile,
      JSON.stringify({
        clicks: oldData.clicks,
        countries: oldData.countries,
      })
    );
    await Bun.write(
      analyticsFile,
      "\n" +
        oldData.history.map(({ date, count }) => `${date},${count}`).join("\n")
    );
    return;
  }
  if (!(await exists(databaseFile))) {
    await Bun.write(
      databaseFile,
      JSON.stringify({
        clicks: 0,
        history: [],
        countries: [],
      })
    );
    return;
  }
}

await initDatabase();

const dataFile = Bun.file(databaseFile);
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
  const historyFile = Bun.file(analyticsFile);
  const lines = (await historyFile.text()).split("\n");
  lines.splice(0, 1);
  const data = lines.map((line) => {
    const [date, count] = line.split(",");
    return { date: new Date(Number(date)).getTime(), count: Number(count) };
  });
  return data;
}

export async function addToHistory(clicks: number) {
  await appendFile(analyticsFile, `\n${new Date().getTime()},${clicks}`);
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
    return;
  }
  db.countries[index].count += 1;
}

const dataBackupDir = join(dataDir, "backups");

setInterval(async () => {
  await Bun.write(databaseFile, JSON.stringify(db));

  if (!(await exists(dataBackupDir))) await mkdir(dataBackupDir);
  await Bun.write(
    join(dataBackupDir, `meta-${new Date().getTime()}.json`),
    JSON.stringify(db)
  );
}, 10_000);
