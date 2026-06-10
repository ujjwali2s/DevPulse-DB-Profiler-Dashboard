const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require('../db/client');

// Load SQL files
const searchBooksSQL = fs.readFileSync(path.join(__dirname, '../sql/search_books_by_title.sql'), 'utf8');
const countCopiesSQL = fs.readFileSync(path.join(__dirname, '../sql/count_available_copies.sql'), 'utf8');
console.log("🔍 searchBooksSQL loaded:", searchBooksSQL.substring(0, 100));
console.log("🔍 countCopiesSQL loaded:", countCopiesSQL.substring(0, 100));

// router.get('/staffbooksearch', async (req, res) => {
//   const { title, branchId } = req.query;

//   if (!title || !branchId) {
//     return res.status(400).json({ error: 'Missing title or branchId parameter' });
//   }

//   try {
//     // 1) Find books matching the title
//     const bookResult = await db.query(searchBooksSQL, [title]);
//     const books = bookResult.rows;

//     if (books.length === 0) {
//       return res.status(404).json({ error: 'No books found with the given title' });
//     }

//     const bookIds = books.map(b => b.book_id);

//     // 2) Count available copies for these books in the branch
//     // Note: pg expects array parameters to be passed as JS array directly
//     const countResult = await db.query(countCopiesSQL, [bookIds, branchId]);
//     const availableCopies = countResult.rows[0].count;

//     res.json({
//       message: `Available book copies of searched title "${title}" at branch ${branchId} is: ${availableCopies}`,
//       availableCopies: parseInt(availableCopies, 10),
//       bookTitlesFound: books.map(b => b.title)
//     });

//   } catch (err) {
//     console.error('staffbooksearch error:', err.message);
//     res.status(500).json({ error: err.message });
//   }
// });


router.get('/staffbooksearch', async (req, res) => {
  const { title, branchId } = req.query;

  if (!title || !branchId) {
    return res.status(400).json({ error: 'Missing title or branchId parameter' });
  }

  try {
    const result = await db.query(`
      SELECT 
        b.book_id,
        b.title,
        b.isbn,
        b.edition,
        b.publish_year,
        b.language,
        b.price,
        p.publisher_id,
        p.publisher_name,
        COALESCE(array_agg(DISTINCT g.name) FILTER (WHERE g.name IS NOT NULL), '{}') AS genre_names,
        COALESCE(array_agg(DISTINCT g.genre_id) FILTER (WHERE g.genre_id IS NOT NULL), '{}') AS genre_ids,
        COALESCE(array_agg(DISTINCT pi.first_name || ' ' || pi.last_name) FILTER (WHERE pi.first_name IS NOT NULL), '{}') AS author_names,
        COALESCE(array_agg(DISTINCT a.author_id) FILTER (WHERE a.author_id IS NOT NULL), '{}') AS author_ids,
        COUNT(DISTINCT CASE WHEN bc.availability_status = 'yes' AND bc.branch_id = $2 THEN bc.copy_id END) AS available_copies
      FROM Book b
      LEFT JOIN Publisher p ON b.publisher_id = p.publisher_id
      LEFT JOIN Book_Genre bg ON b.book_id = bg.book_id
      LEFT JOIN Genre g ON bg.genre_id = g.genre_id
      LEFT JOIN Book_Author ba ON b.book_id = ba.book_id
      LEFT JOIN Author a ON ba.author_id = a.author_id
      LEFT JOIN Person_Info pi ON a.person_id = pi.person_id
      LEFT JOIN Book_Copy bc ON b.book_id = bc.book_id

      WHERE LOWER(b.title) LIKE LOWER('%' || $1 || '%')
      GROUP BY b.book_id, p.publisher_id
      ORDER BY b.title
    `, [title, branchId]);

    res.json(result.rows);
  } catch (err) {
    console.error('Staffbooksearch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch book data' });
  }
});


module.exports = router;


