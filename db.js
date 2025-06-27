const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',        // change if your username is different
  password: 'root',        // set your MySQL password if needed
  database: 'movie_db'
});

module.exports = pool.promise();
