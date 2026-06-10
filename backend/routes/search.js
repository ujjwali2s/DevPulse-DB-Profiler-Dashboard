
const express = require('express');
const router = express.Router();
const db = require('../db/client');
const fs = require('fs');
const path = require('path');

const searchBooksSQL = fs.readFileSync(path.join(__dirname, '../sql/search_books.sql'), 'utf8');

// Book Search
router.get('/search-books', async (req, res) => {
  let { title, language, author, genre } = req.query;

  title = title && title.trim() !== '' ? title : null;
  language = language && language.trim() !== '' ? language : null;
  author = author && author.trim() !== '' ? author : null;
  genre = genre && genre.trim() !== '' ? genre : null;

  try {
    const result = await db.query(searchBooksSQL, [title, language, author, genre]);
    res.json(result.rows);
  } catch (err) {
    console.error('Search-books error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

//  Author Details
router.get('/author-details/:author_id', async (req, res) => {
  const { author_id } = req.params;
  try {
    const result = await db.query(`
      SELECT 
        pi.first_name, 
        pi.last_name, 
        pi.email, 
        a.pen_name, 
        a.nationality, 
        a.biography,
        COALESCE(array_agg(DISTINCT aw.award_name) FILTER (WHERE aw.award_name IS NOT NULL), '{}') AS awards
      FROM Author a
      JOIN Person_Info pi ON a.person_id = pi.person_id
      LEFT JOIN Author_Award aa ON aa.author_id = a.author_id
      LEFT JOIN Award aw ON aw.award_id = aa.award_id
      WHERE a.author_id = $1
      GROUP BY pi.first_name, pi.last_name, pi.email, a.pen_name, a.nationality, a.biography
    `, [author_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Author details error:', err.message);
    res.status(500).json({ error: 'Failed to fetch author details' });
  }
});

// Publisher Details 
router.get('/publisher-details/:publisher_id', async (req, res) => {
  const { publisher_id } = req.params;
  try {
    const result = await db.query(`
      SELECT publisher_name, website, country, establish_year
      FROM Publisher
      WHERE publisher_id = $1
    `, [publisher_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publisher not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Publisher details error:', err.message);
    res.status(500).json({ error: 'Failed to fetch publisher details' });
  }
});

// Genre Details
router.get('/genre-details/:genre_id', async (req, res) => {
  const { genre_id } = req.params;
  try {
    const result = await db.query(`
      SELECT name, description
      FROM Genre
      WHERE genre_id = $1
    `, [genre_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Genre not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Genre details error:', err.message);
    res.status(500).json({ error: 'Failed to fetch genre details' });
  }
});


// Get all reviews for a book
router.get('/book-reviews/:book_id', async (req, res) => {
  const { book_id } = req.params;

  try {
    const result = await db.query(`
      SELECT 
        pi.first_name || ' ' || pi.last_name AS reviewer_name,
        r.rating,
        r.review_date,
        r.description
      FROM Review r
      JOIN Member m ON r.member_id = m.member_id
      JOIN Person_Info pi ON m.person_id = pi.person_id
      WHERE r.book_id = $1
      ORDER BY r.review_date DESC
    `, [book_id]);

    res.json(result.rows);
  } catch (err) {
    console.error('Fetch reviews error:', err.message);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Submit a new review
router.post('/add-review', async (req, res) => {
  const { member_id, book_id, rating, description } = req.body;

  if (!member_id || !book_id || !rating) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

   const client = await db.connect(); 

  try {

    await client.query('BEGIN'); 

    const today = new Date().toISOString().split('T')[0];
    await client.query(`
      INSERT INTO Review (member_id, book_id, rating, review_date, description)
      VALUES ($1, $2, $3, $4, $5)
    `, [member_id, book_id, rating, today, description || null]);

    await client.query('COMMIT'); // Commit transaction
    res.json({ message: 'Review submitted successfully' });
  } catch (err) 
  {
    await client.query('ROLLBACK'); // Rollback on error
    console.error('Add review error:', err.message);
    res.status(500).json({ error: 'Failed to add review' });
  } finally {
    client.release();
  }
});

// GET /search/suggestions?query=hum
router.get('/suggestions', async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: 'Query missing' });

  try {
    const result = await db.query(
      `
      SELECT DISTINCT b.Book_id, b.Title
      FROM Book b
      LEFT JOIN Publisher p ON b.Publisher_id = p.Publisher_id
      LEFT JOIN Book_Author ba ON b.Book_id = ba.Book_id
      LEFT JOIN Author a ON ba.Author_id = a.Author_id
      LEFT JOIN Person_Info pi ON a.Person_id = pi.Person_id
      LEFT JOIN Book_Genre bg ON b.Book_id = bg.Book_id
      LEFT JOIN Genre g ON bg.Genre_id = g.Genre_id
      WHERE 
        b.Title ILIKE $1 OR
        b.Language ILIKE $1 OR
        p.publisher_name ILIKE $1 OR
        g.Name ILIKE $1 OR
        pi.First_Name ILIKE $1 OR
        pi.Last_Name ILIKE $1 OR
        CONCAT(pi.First_Name, ' ', pi.Last_Name) ILIKE $1
      LIMIT 10
      `,
      [`%${query}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /search/details/:bookId
router.get('/details/:bookId', async (req, res) => {
  const bookId = req.params.bookId;

  try {
    const result = await db.query(
      `
      SELECT 
        b.Book_id, b.Title, b.ISBN, b.Publish_year, b.Language, 
        b.Edition, b.Price,
        p.publisher_name,
        ARRAY_AGG(DISTINCT CONCAT(pi.First_Name, ' ', pi.Last_Name)) AS authors,
        ARRAY_AGG(DISTINCT g.Name) AS genres
      FROM Book b
      LEFT JOIN Publisher p ON b.Publisher_id = p.Publisher_id
      LEFT JOIN Book_Author ba ON b.Book_id = ba.Book_id
      LEFT JOIN Author a ON ba.Author_id = a.Author_id
      LEFT JOIN Person_Info pi ON a.Person_id = pi.Person_id
      LEFT JOIN Book_Genre bg ON b.Book_id = bg.Book_id
      LEFT JOIN Genre g ON bg.Genre_id = g.Genre_id
      WHERE b.Book_id = $1
      GROUP BY b.Book_id, p.publisher_name
      `,
      [bookId]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Book not found' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
