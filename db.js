// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file or open existing one
const dbPath = path.resolve(__dirname, 'movies.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database', err.message);
  } else {
    console.log('✅ Connected to SQLite database.');
    // Create table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      genre TEXT,
      rating REAL
    )`);
  }
});

module.exports = db;
