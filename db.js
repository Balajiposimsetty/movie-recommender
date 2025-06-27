// db.js

const Database = require('better-sqlite3');
const db = new Database('movies.db');

// Create a table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    genre TEXT NOT NULL,
    rating REAL
  )
`).run();

// Sample insert (run only once or guard with checks)
const sampleMovies = [
  { title: "Inception", genre: "Sci-Fi", rating: 8.8 },
  { title: "The Godfather", genre: "Crime", rating: 9.2 },
  { title: "The Dark Knight", genre: "Action", rating: 9.0 },
  { title: "Pulp Fiction", genre: "Crime", rating: 8.9 },
];

const existingCount = db.prepare('SELECT COUNT(*) as count FROM movies').get().count;
if (existingCount === 0) {
  const insert = db.prepare('INSERT INTO movies (title, genre, rating) VALUES (?, ?, ?)');
  for (const movie of sampleMovies) {
    insert.run(movie.title, movie.genre, movie.rating);
  }
}

// Export a function to get all movies
function getAllMovies() {
  return db.prepare('SELECT * FROM movies').all();
}

// Export a function to get recommendations by genre
function getRecommendationsByGenre(genre) {
  return db.prepare('SELECT * FROM movies WHERE genre = ? ORDER BY rating DESC').all(genre);
}

module.exports = {
  getAllMovies,
  getRecommendationsByGenre
};
