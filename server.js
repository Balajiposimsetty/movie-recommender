// server.js
const express = require('express');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Sample route: Get all movies
app.get('/api/movies', (req, res) => {
  db.all('SELECT * FROM movies', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to fetch movies' });
    } else {
      res.json(rows);
    }
  });
});

// Sample route: Add a movie
app.post('/api/movies', (req, res) => {
  const { title, genre, rating } = req.body;
  const query = `INSERT INTO movies (title, genre, rating) VALUES (?, ?, ?)`;

  db.run(query, [title, genre, rating], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to add movie' });
    } else {
      res.json({ id: this.lastID });
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
