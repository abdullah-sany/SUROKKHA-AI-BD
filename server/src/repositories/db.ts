import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { env } from "../config/env";
import { logger } from "../utils/logger";

fs.mkdirSync(path.dirname(env.databaseUrl), { recursive: true });

export const db = new Database(env.databaseUrl);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

/**
 * Schema is intentionally close to a normalized relational shape even
 * though we're on SQLite for the prototype (section 2: "migration-ready
 * for PostgreSQL / Supabase / Firebase / MongoDB"). Swapping the driver
 * later means re-implementing the repository files in this folder — the
 * rest of the app talks to repositories, never to SQL directly.
 */
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS facilities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      nameBn TEXT,
      code TEXT,
      agency TEXT,
      facilityType TEXT NOT NULL,
      division TEXT NOT NULL,
      district TEXT NOT NULL,
      cityCorporation TEXT,
      upazila TEXT,
      paurasava TEXT,
      union_ TEXT,
      isPrivate INTEGER NOT NULL DEFAULT 0,
      phone TEXT,
      emergencyPhone TEXT,
      latitude REAL,
      longitude REAL,
      verified INTEGER NOT NULL DEFAULT 0,
      source TEXT NOT NULL,
      lastVerifiedAt TEXT,
      isDemoData INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS ambulances (
      id TEXT PRIMARY KEY,
      providerName TEXT NOT NULL,
      division TEXT NOT NULL,
      district TEXT NOT NULL,
      area TEXT,
      phone TEXT,
      latitude REAL,
      longitude REAL,
      serviceType TEXT NOT NULL,
      verified INTEGER NOT NULL DEFAULT 0,
      source TEXT NOT NULL,
      lastVerifiedAt TEXT,
      isDemoData INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS emergency_contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      nameBn TEXT,
      category TEXT NOT NULL,
      phone TEXT NOT NULL,
      description TEXT NOT NULL,
      descriptionBn TEXT,
      verified INTEGER NOT NULL DEFAULT 0,
      source TEXT NOT NULL,
      lastVerifiedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS timeline_entries (
      id TEXT PRIMARY KEY,
      clientId TEXT NOT NULL,
      type TEXT NOT NULL,
      summary TEXT NOT NULL,
      severity TEXT,
      createdAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_facilities_district ON facilities(district);
    CREATE INDEX IF NOT EXISTS idx_facilities_division ON facilities(division);
    CREATE INDEX IF NOT EXISTS idx_ambulances_district ON ambulances(district);
    CREATE INDEX IF NOT EXISTS idx_timeline_client ON timeline_entries(clientId);
  `);
}

function seedIfEmpty() {
  const facilityCount = (db.prepare("SELECT COUNT(*) AS c FROM facilities").get() as { c: number }).c;
  if (facilityCount === 0) {
    const seedPath = path.resolve(__dirname, "../data/seed/facilities.seed.json");
    const rows = JSON.parse(fs.readFileSync(seedPath, "utf-8"));
    const insert = db.prepare(`
      INSERT INTO facilities (id, name, nameBn, code, agency, facilityType, division, district, cityCorporation, upazila, paurasava, union_, isPrivate, phone, emergencyPhone, latitude, longitude, verified, source, lastVerifiedAt, isDemoData)
      VALUES (@id, @name, @nameBn, @code, @agency, @facilityType, @division, @district, @cityCorporation, @upazila, @paurasava, @union_, @isPrivate, @phone, @emergencyPhone, @latitude, @longitude, @verified, @source, @lastVerifiedAt, @isDemoData)
    `);
    const insertMany = db.transaction((items: any[]) => {
      for (const item of items) {
        insert.run({
          ...item,
          union_: item.union,
          isPrivate: item.isPrivate ? 1 : 0,
          verified: item.verified ? 1 : 0,
          isDemoData: item.isDemoData ? 1 : 0,
        });
      }
    });
    insertMany(rows);
    logger.info(`Seeded facilities table`, { count: rows.length });
  }

  const ambulanceCount = (db.prepare("SELECT COUNT(*) AS c FROM ambulances").get() as { c: number }).c;
  if (ambulanceCount === 0) {
    const seedPath = path.resolve(__dirname, "../data/seed/ambulances.seed.json");
    const rows = JSON.parse(fs.readFileSync(seedPath, "utf-8"));
    const insert = db.prepare(`
      INSERT INTO ambulances (id, providerName, division, district, area, phone, latitude, longitude, serviceType, verified, source, lastVerifiedAt, isDemoData)
      VALUES (@id, @providerName, @division, @district, @area, @phone, @latitude, @longitude, @serviceType, @verified, @source, @lastVerifiedAt, @isDemoData)
    `);
    const insertMany = db.transaction((items: any[]) => {
      for (const item of items) {
        insert.run({ ...item, verified: item.verified ? 1 : 0, isDemoData: item.isDemoData ? 1 : 0 });
      }
    });
    insertMany(rows);
    logger.info(`Seeded ambulances table`, { count: rows.length });
  }

  const contactCount = (db.prepare("SELECT COUNT(*) AS c FROM emergency_contacts").get() as { c: number }).c;
  if (contactCount === 0) {
    const seedPath = path.resolve(__dirname, "../data/seed/emergencyContacts.seed.json");
    const rows = JSON.parse(fs.readFileSync(seedPath, "utf-8"));
    const insert = db.prepare(`
      INSERT INTO emergency_contacts (id, name, nameBn, category, phone, description, descriptionBn, verified, source, lastVerifiedAt)
      VALUES (@id, @name, @nameBn, @category, @phone, @description, @descriptionBn, @verified, @source, @lastVerifiedAt)
    `);
    const insertMany = db.transaction((items: any[]) => {
      for (const item of items) {
        insert.run({ ...item, verified: item.verified ? 1 : 0 });
      }
    });
    insertMany(rows);
    logger.info(`Seeded emergency_contacts table`, { count: rows.length });
  }
}

export function initDatabase() {
  initSchema();
  seedIfEmpty();
}

// Allow `npm run seed` to initialize the DB standalone.
if (require.main === module) {
  initDatabase();
  logger.info("Database initialized and seeded", { path: env.databaseUrl });
}
