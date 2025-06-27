const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.static(__dirname));
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',  // change if needed
  database: 'movie_db'
});

app.get('/search', (req, res) => {
  const { genre, actor, director, liked } = req.query;

  let sql = "SELECT * FROM movies WHERE 1=1";
  const params = [];

  if (genre) {
    sql += " AND genre LIKE ?";
    params.push('%' + genre + '%');
  }

  if (actor) {
    sql += " AND actors LIKE ?";
    params.push('%' + actor + '%');
  }

  if (director) {
    sql += " AND director LIKE ?";
    params.push('%' + director + '%');
  }

  if (liked) {
    const likedTitles = liked.split(',').map(t => t.trim());

    if (likedTitles.length > 0) {
      const placeholders = likedTitles.map(() => '?').join(',');
      const lowerLikedTitles = likedTitles.map(t => t.toLowerCase());

      const likeQuery = `SELECT genre, director, actors FROM movies WHERE LOWER(title) IN (${placeholders})`;

      connection.query(likeQuery, lowerLikedTitles, (err, results) => {
        if (err) {
          console.error("Error fetching liked movie data:", err);
          return res.status(500).json({ error: "Internal error" });
        }

        if (results.length === 0) {
          return res.json([]); // no matching liked movies
        }

        // Combine genre, director, and actors from liked movies
        const genres = [...new Set(results.map(r => r.genre))];
        const directors = [...new Set(results.map(r => r.director))];
        const actorsList = [...new Set(results.flatMap(r => r.actors.split(',').map(a => a.trim())))];

        // Extend SQL to find similar movies
        sql += " AND (";
        const likeParts = [];

        genres.forEach(g => {
          likeParts.push("genre LIKE ?");
          params.push('%' + g + '%');
        });

        directors.forEach(d => {
          likeParts.push("director LIKE ?");
          params.push('%' + d + '%');
        });


        sql += likeParts.join(" OR ");
        sql += ")";

        // Final query
        connection.query(sql, params, (err2, similarResults) => {
          if (err2) {
            console.error("Error fetching recommendations:", err2);
            return res.status(500).json({ error: "Internal error" });
          }

          // Optional: remove liked movies from results
          const finalResults = similarResults.filter(movie => !likedTitles.includes(movie.title));
          res.json(finalResults);
        });
      });

      return; // prevent further execution
    }
  }

  // If no liked filter is applied, just run the base query
  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
