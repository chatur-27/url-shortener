import mysql from 'mysql';

// Set up MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'url_shortener',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
    const deleteAllQuery = 'delete FROM urls';
    connection.query(deleteAllQuery, (err, results) => {
      if (err) {
        console.error('Error delete shortened URLs from MySQL:', err);
        
      }
    });
  }
});

export const executeQuery = (query, values) => {
    return new Promise((resolve, reject) => {
      connection.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };

