
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
  }
});

// Define API endpoints
app.post('/api/shorten',async (req, res) => {
    const { originalUrl } = req.body;

    // Check if the provided URL is valid

    if (!validator.isURL(originalUrl)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Generate a short code for the URL
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
      res.json({ shortUrl });
    });
  });
  
  app.get('/api/:shortCode', async (req, res) => {
    console.log("stage 1");
    const { shortCode } = req.params;
    console.log("stage 2");
    try {
      // Find the corresponding long URL in the database
      const selectQuery = 'SELECT original_url FROM urls WHERE short_code = ?';
      connection.query(selectQuery, [shortCode], (err, results) => {
        if (err) {
          console.error('Error fetching URL from MySQL:', err);
          return res.status(500).json({ error: 'Server error' });
        }
  
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
  
        // Redirect to the original URL
        res.redirect(originalUrl);
      });
    } catch (error) {
      console.error('Error fetching URL from MySQL:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
