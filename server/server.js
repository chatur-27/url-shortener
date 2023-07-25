
import express from 'express';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import cors from 'cors';
import { nanoid } from 'nanoid';
import validator from 'validator';


const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(cors());

// Set up MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'password', // Replace with your MySQL password
  database: 'url_shortener', // Replace with your MySQL database name
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
        return res.status(500).json({ error: 'Server error' });
      }
    });
  }
});

// Define API endpoints
app.post('/api/shorten',async (req, res) => {
  console.log("post request received");
    const { originalUrl } = req.body;

    // Check if the provided URL is valid

    

    try {
      // Check if the original URL already exists in the database
      const selectQuery = 'SELECT short_code FROM urls WHERE original_url = ?';
      connection.query(selectQuery, [originalUrl], async (err, results) => {
        if (err) {
          console.error('Error checking existing URL in MySQL:', err);
          return res.status(500).json({ error: 'Server error' });
        }
  
        if (results.length > 0) {
          // If the original URL already exists, return the existing short code
          const existingShortCode = results[0].short_code;
          const shortUrl = `http://localhost:3000/${existingShortCode}`;
          return res.json({ shortUrl });
        } else {
          // Generate a new short code for the URL
          const shortCode = nanoid(8); // Generates an 8-character short unique ID
  
          // Insert the URL and its short code into the database
          const insertQuery = 'INSERT INTO urls (original_url, short_code) VALUES (?, ?)';
          connection.query(insertQuery, [originalUrl, shortCode], (err) => {
            if (err) {
              console.error('Error inserting data into MySQL:', err);
              return res.status(500).json({ error: 'Server error' });
            }
  
            // Return the shortened URL
            const shortUrl = `http://localhost:3000/${shortCode}`;
            return res.json({ shortUrl });
          });
        }
      });
    } catch (error) {
      console.error('Error checking existing URL in MySQL:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  });
  
app.get('/api/short/:shortCode', async (req, res) => {
  console.log(":shortcode get request received");
  const { shortCode } = req.params;

  console.log(shortCode);
  try {
    // Find the corresponding long URL in the database
    const selectQuery = 'SELECT original_url FROM urls WHERE short_code = ?';
    connection.query(selectQuery, [shortCode], (err, results) => {
      if (err) {
        console.error('Error fetching URL from MySQL:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      console.log("above reseult length =0");
      if (results.length === 0) {
        return res.status(404).json({ error: 'URL not found' });
      }

      const originalUrl = results[0].original_url;

      // Increment the count of visits
      const updateQuery = 'UPDATE urls SET count = count + 1 WHERE short_code = ?';
      connection.query(updateQuery, [shortCode], (err) => {
        if (err) {
          console.error('Error updating visit count in MySQL:', err);
        }
      });

      console.log("above redirect");
      // Redirect to the original URL
      res.json(originalUrl);
    });
  } catch (error) {
    console.error('Error fetching URL from MySQL:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/shortened', async (req, res) => {
  console.log("shortened get request received");
  try {
    
    const selectAllQuery = 'SELECT * FROM urls';
    connection.query(selectAllQuery, (err, results) => {
      if (err) {
        console.error('Error fetching shortened URLs from MySQL:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Error fetching shortened URLs from MySQL:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
