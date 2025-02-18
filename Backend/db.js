const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'database28',
    database: 'tictactoe'
});

module.exports = { pool }; // Export the pool object for database connectivity

// Execute SQL query using the connection pool
function executeQuery(query, params, callback) {
  pool.query(query, params, (error, results, fields) => {
    if (error) {
      console.error('Error executing query: ', error);
      callback(error, null);
      return;
    }
    callback(null, results);
  });
}

module.exports = { executeQuery };
