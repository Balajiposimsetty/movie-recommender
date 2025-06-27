const express = require('express');
const { getAllMovies, getRecommendationsByGenre } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public')); // Assuming your index.html is in /public

app.get('/api/movies', (req, res) => {
  const genre = req.query.genre;
  if (genre) {
    const movies = getRecommendationsByGenre(genre);
    res.json(movies);
  } else {
    const movies = getAllMovies();
    res.json(movies);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
