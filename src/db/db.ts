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

export default db;