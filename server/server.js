import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { nanoid } from 'nanoid';
import { executeQuery } from './database.js';

const app = express();
const port = 8080;
app.use(bodyParser.json());
app.use(cors());


// Define API endpoints
app.post('/api/shorten', async (req, res) => {
  const { originalUrl } = req.body;

  try {
    // Check if the original URL already exists in the database
    const selectQuery = 'SELECT short_code FROM urls WHERE original_url = ?';
    const results = await executeQuery(selectQuery, [originalUrl]);

    if (results.length > 0) {
      // If the original URL already exists, return the existing short code
      const existingShortCode = results[0].short_code;
      const shortUrl = `http://localhost:8080/${existingShortCode}`;
      return res.json({ shortUrl });
    } else {
      // Generate a new short code for the URL
      const shortCode = nanoid(8); 

      // Insert the URL and its short code into the database
      const insertQuery = 'INSERT INTO urls (original_url, short_code) VALUES (?, ?)';
      await executeQuery(insertQuery, [originalUrl, shortCode]);

      // Return the shortened URL
      const shortUrl = `http://localhost:8080/${shortCode}`;
      return res.json({ shortUrl });
    }
  } catch (error) {
    console.error('Error checking existing URL in MySQL:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/shortened', async (req, res) => {
  try {
    
    const selectAllQuery = 'SELECT * FROM urls';
    const results = await executeQuery(selectAllQuery);
    res.json(results);

  } catch (error) {
    console.error('Error fetching shortened URLs from MySQL:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Define a route to handle redirection based on the short code
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    // Find the corresponding long URL in the database
    const selectQuery = 'SELECT original_url FROM urls WHERE short_code = ?';
    const results = await executeQuery(selectQuery, [shortCode]);

      const originalUrl = results[0].original_url;

      // Redirect to the original URL
      res.redirect(originalUrl);

    // Increment the count of visits
    const updateQuery = 'UPDATE urls SET count = count + 1 WHERE short_code = ?';
    await executeQuery(updateQuery, [shortCode]);

  } catch (error) {
    console.error('Error fetching URL from MySQL:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
