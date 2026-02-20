import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { count } from "drizzle-orm";
import * as schema from "./schema.js";
import carsData from "../data/cars.json" with { type: "json" };

let db: ReturnType<typeof drizzle<typeof schema>>;

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized. Call initDb() first.");
  }
  return db;
}

export function initDb(dbPath: string) {
  mkdirSync(dirname(dbPath), { recursive: true });

  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");

  db = drizzle(sqlite, { schema });

  migrate(db, { migrationsFolder: "./drizzle" });

  seed();

  return db;
}

function seed() {
  const [{ total }] = db.select({ total: count() }).from(schema.cars).all();

  if (total > 0) return;

  db.insert(schema.cars).values(carsData).run();
}
