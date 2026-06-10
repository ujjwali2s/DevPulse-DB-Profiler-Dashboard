const express = require('express');
const router = express.Router();
const db = require('../db/client');


const getBookDetailsQuery = `
    SELECT
    b.book_id,
    b.title,
    b.isbn,
    b.publish_year,
    b.language,
    b.edition,
    b.price,
    b.cover_filename,
    p.publisher_name AS publisher
    FROM book b
    LEFT JOIN publisher p ON b.publisher_id = p.publisher_id
    WHERE b.book_id = $1;
`;

const getBookAuthorsQuery = `
  SELECT
  COALESCE(a.pen_name, CONCAT(p.first_name, ' ', p.last_name)) AS name
FROM author a
JOIN person_info p ON a.person_id = p.person_id
JOIN book_author ba ON a.author_id = ba.author_id
WHERE ba.book_id = $1;

`;

const getBookGenresQuery = `
    SELECT g.name
    FROM genre g
    JOIN book_genre bg ON g.genre_id = bg.genre_id
    WHERE bg.book_id = $1;
`;

const getRelatedBooksQuery = `
  SELECT
  b.book_id,
  b.title,
  b.cover_filename
FROM book b
JOIN book_genre bg ON b.book_id = bg.book_id
JOIN genre g ON bg.genre_id = g.genre_id
WHERE g.name = $1 AND b.book_id != $2
LIMIT 6;

`;


const getBookReviewsQuery = `
  SELECT
    r.review_id,
    r.rating,
    r.description,
    r.review_date,
    m.member_id,
    pi.first_name || ' ' || pi.last_name AS reviewer,
    ROUND(AVG(r.rating) OVER (), 2) AS average_rating
  FROM review r
  JOIN member m ON r.member_id = m.member_id
  JOIN person_info pi ON m.person_id = pi.person_id
  WHERE r.book_id = $1
  ORDER BY r.review_date DESC;
`;


// Route to get full book info + related books
router.get('/:bookId', async (req, res) => {
  const bookId = req.params.bookId;

  try {
    // 1. Book details
    const bookResult = await db.query(getBookDetailsQuery, [bookId]);
    if (bookResult.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    const book = bookResult.rows[0];

    // 2. Authors
    const authorsResult = await db.query(getBookAuthorsQuery, [bookId]);
    const authors = authorsResult.rows.map(row => row.name);

    // 3. Genres
    const genresResult = await db.query(getBookGenresQuery, [bookId]);
    const genres = genresResult.rows.map(row => row.name);

    // 4. Related books (based on first genre)
    let relatedBooks = [];
    if (genres.length > 0) {
      const relatedResult = await db.query(getRelatedBooksQuery, [genres[0], bookId]);
      relatedBooks = relatedResult.rows;
    }

    // 5. Reviews
    const reviewsResult = await db.query(getBookReviewsQuery, [bookId]);
    const reviews = reviewsResult.rows;
    const avgRating = reviews.length > 0 ? reviews[0].average_rating : null;


    // 5. Final response
    // res.json({
    //   ...book,
    //   author: authors,
    //   genre: genres,
    //   related_books: relatedBooks
    // });
    res.json({
      ...book,
      author: authors,
      genre: genres,
      related_books: relatedBooks,
      reviews,
      average_rating: avgRating
    });
  } catch (err) {
    console.error('Error fetching book details:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
