const express = require('express');
const router = express.Router();
const pool = require('../db/client');
const fs = require('fs');
const path = require('path');


const genreBooksSQL = fs.readFileSync(
  path.join(__dirname, '../sql/genre_books_with_reviews.sql'),
  'utf8'
);

router.get('/:genreId/books-with-reviews', async (req, res) => {
  const genreId = req.params.genreId;
  try {
    const result = await pool.query(genreBooksSQL, [genreId]);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching genre books with reviews:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});


router.get('/:genreId/name', async (req, res) => {
  const genreId = req.params.genreId;

  try {
    const result = await pool.query(
      'SELECT name FROM genre WHERE genre_id = $1',
      [genreId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Genre not found' });
    }

    res.json({ name: result.rows[0].name });
  } catch (err) {
    console.error('❌ Error fetching genre name:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});


module.exports = router;
