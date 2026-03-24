import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dataDir = path.resolve("./data");

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, "urls.db");

const db = new Database(dbPath);

db.prepare(`
CREATE TABLE IF NOT EXISTS urls (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 code TEXT UNIQUE,
 url TEXT,
 descripcion TEXT,
 clicks INTEGER DEFAULT 0,
 created_at TEXT
)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS grupos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  created_at TEXT
)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS grupo_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  grupo_id INTEGER NOT NULL,
  titulo TEXT,
  url TEXT NOT NULL,
  FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE
)
`).run();

export default db;