// db.js

const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

let db;

async function initializeDB() {
  db = await sqlite.open({
    filename: './movies.db',
    driver: sqlite3.Database
  });

  await db.run(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      genre TEXT NOT NULL,
      rating REAL
    )
  `);

  const result = await db.get('SELECT COUNT(*) as count FROM movies');
  if (result.count === 0) {
    const sampleMovies = [
      { title: "Inception", genre: "Sci-Fi", rating: 8.8 },
      { title: "The Godfather", genre: "Crime", rating: 9.2 },
      { title: "The Dark Knight", genre: "Action", rating: 9.0 },
      { title: "Pulp Fiction", genre: "Crime", rating: 8.9 },
    ];

    const insert = await db.prepare('INSERT INTO movies (title, genre, rating) VALUES (?, ?, ?)');
    for (const movie of sampleMovies) {
      await insert.run(movie.title, movie.genre, movie.rating);
    }
    await insert.finalize();
  }
}

async function getAllMovies() {
  return await db.all('SELECT * FROM movies');
}

async function getRecommendationsByGenre(genre) {
  return await db.all('SELECT * FROM movies WHERE genre = ? ORDER BY rating DESC', genre);
}

module.exports = {
  initializeDB,
  getAllMovies,
  getRecommendationsByGenre
};
