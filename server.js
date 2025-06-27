const express = require('express');
const {
  initializeDB,
  getAllMovies,
  getRecommendationsByGenre
} = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public')); // or use actual folder name

app.get('/api/movies', async (req, res) => {
  const genre = req.query.genre;
  try {
    const movies = genre
      ? await getRecommendationsByGenre(genre)
      : await getAllMovies();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

initializeDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
