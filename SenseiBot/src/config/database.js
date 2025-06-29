const Database = require('better-sqlite3');

const db = new Database('senseibot.db');

const createTableQuery = `
CREATE TABLE IF NOT EXISTS used_terms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  term TEXT NOT NULL,
  category TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

db.exec(createTableQuery);

console.log("Database initialized successfully. The 'used_terms' table is ready.");

module.exports = db;

