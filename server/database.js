import mysql from 'mysql';

// Set up MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');

    // Create the database if it doesn't exist
    const createDatabaseQuery = 'CREATE DATABASE IF NOT EXISTS url_shortener';
    connection.query(createDatabaseQuery, (err) => {
      if (err) {
        console.error('Error creating database:', err);
        connection.end(); // Close the connection
      } else {
        console.log('Database created or already exists');

        // Use the created database
        const useDatabaseQuery = 'USE url_shortener';
        connection.query(useDatabaseQuery, (err) => {
          if (err) {
            console.error('Error using database:', err);
            connection.end(); // Close the connection
          } else {
            console.log('Using database: url_shortener');

            // Create the table if it doesn't exist
            const createTableQuery = `CREATE TABLE IF NOT EXISTS urls (
              id INT AUTO_INCREMENT PRIMARY KEY,
              original_url VARCHAR(255) NOT NULL,
              short_url VARCHAR(10) NOT NULL
            )`;
            connection.query(createTableQuery, (err) => {
              if (err) {
                console.error('Error creating table:', err);
              } else {
                console.log('Table "urls" created or already exists');
              }

            });

            // delete all records from table
            const deleteQuery = `delete from urls;`;
            connection.query(deleteQuery, (err) => {
              if (err) {
                console.error('Error creating table:', err);
              } else {
                console.log('delted all records');
              }
            });
          }
        });
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