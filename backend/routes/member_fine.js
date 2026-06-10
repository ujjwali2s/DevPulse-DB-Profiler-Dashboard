// const express = require('express');
// const router = express.Router();
// const pool = require('../db/client'); // Adjust path as needed

// router.get('/fines/:memberId', async (req, res) => {
//   const memberId = req.params.memberId;

//   try {
//     console.log(`Fetching fines for memberId=${memberId}`);
//     const result = await pool.query(`
//     SELECT
//         br.borrow_id,
//         b.title,
//         b.cover_filename,
//         fc.total_amount,
//         f.fine_type,

//         -- Authors: Prefer Pen_name, fallback to First + Last name
//         COALESCE(
//             string_agg(
//             DISTINCT 
//             COALESCE(a.pen_name, pi.first_name || ' ' || pi.last_name),
//             ', '
//             ),
//             'N/A'
//         ) AS authors,

//         -- Genres
//         COALESCE(
//             string_agg(DISTINCT g.name, ', '),
//             'N/A'
//         ) AS genres

//         FROM Fine_Calculated fc
//         LEFT JOIN Fine f ON fc.fine_id = f.fine_id
//         LEFT JOIN Borrow_record br ON fc.borrow_id = br.borrow_id

//         -- Try live copy first
//         LEFT JOIN Book_Copy bc ON br.copy_id = bc.copy_id

//         -- If not found, fallback to deleted
//         LEFT JOIN deleted_copies dc ON br.copy_id = dc.original_copy_id

//         -- Unified book source
//         LEFT JOIN Book b ON b.book_id = COALESCE(bc.book_id, dc.book_id)

//         -- Join for author: Book → Book_Author → Author → Person_Info
//         LEFT JOIN Book_Author ba ON ba.book_id = b.book_id
//         LEFT JOIN Author a ON a.author_id = ba.author_id
//         LEFT JOIN Person_Info pi ON pi.person_id = a.person_id

//         -- Join for genre: Book → Book_Genre → Genre
//         LEFT JOIN Book_Genre bg ON bg.book_id = b.book_id
//         LEFT JOIN Genre g ON g.genre_id = bg.genre_id

//         WHERE br.member_id = $1

//         GROUP BY br.borrow_id, b.title, b.cover_filename, fc.total_amount, f.fine_type
//         ORDER BY br.borrow_id DESC;

//     `, [memberId]);

//     console.log('Query returned rows:', result.rows.length);
//     if (result.rows.length > 0) {
//       console.log('First row:', result.rows[0]);
//     }

//     res.json(result.rows);
//   } catch (err) {
//     console.error('Error fetching fines:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// module.exports = router;



// //   SELECT
//     //     br.borrow_id,
//     //     b.title,
//     //     b.cover_filename,
//     //     fc.total_amount,
//     //     f.fine_type,
//     //     COALESCE(
//     //       string_agg(DISTINCT a.pen_name, ', ') FILTER (WHERE a.pen_name IS NOT NULL),
//     //       'N/A'
//     //     ) AS authors,
//     //     COALESCE(
//     //       string_agg(DISTINCT g.name, ', ') FILTER (WHERE g.name IS NOT NULL),
//     //       'N/A'
//     //     ) AS genres
//     //   FROM Fine_Calculated fc
//     //   JOIN Fine f ON fc.fine_id = f.fine_id
//     //   JOIN Borrow_record br ON fc.borrow_id = br.borrow_id
//     //   LEFT JOIN Book_Copy bc ON br.copy_id = bc.copy_id
//     //   LEFT JOIN Book b ON bc.book_id = b.book_id
//     //   LEFT JOIN Book_Author ba ON b.book_id = ba.book_id
//     //   LEFT JOIN Author a ON ba.author_id = a.author_id
//     //   LEFT JOIN Book_Genre bg ON b.book_id = bg.book_id
//     //   LEFT JOIN Genre g ON bg.genre_id = g.genre_id
//     //   WHERE br.member_id = $1
//     //   GROUP BY br.borrow_id, b.title, b.cover_filename, fc.total_amount, f.fine_type
//     //   ORDER BY br.borrow_id DESC;


//     // SELECT
//     //     br.borrow_id,
//     //     COALESCE(b.title, adc.title) AS title,
//     //     COALESCE(b.cover_filename, adc.cover_filename) AS cover_filename,
//     //     fc.total_amount,
//     //     f.fine_type,

//     //     -- Authors
//     //     COALESCE(
//     //         string_agg(DISTINCT a.pen_name, ', ') FILTER (WHERE a.pen_name IS NOT NULL),
//     //         'N/A'
//     //     ) AS authors,

//     //     -- Genres
//     //     COALESCE(
//     //         string_agg(DISTINCT g.name, ', ') FILTER (WHERE g.name IS NOT NULL),
//     //         'N/A'
//     //     ) AS genres

//     //     FROM Fine_Calculated fc
//     //     JOIN Fine f ON fc.fine_id = f.fine_id
//     //     JOIN Borrow_record br ON fc.borrow_id = br.borrow_id

//     //     -- Left join Book_Copy and Book (if the book wasn't deleted)
//     //     LEFT JOIN Book_Copy bc ON br.copy_id = bc.copy_id
//     //     LEFT JOIN Book b ON bc.book_id = b.book_id

//     //     -- Fallback if the book copy was deleted
//     //     LEFT JOIN deleted_copies adc ON br.copy_id = adc.original_copy_id

//     //     -- Join author and genre using book_id (from Book or Archive)
//     //     LEFT JOIN Book_Author ba ON ba.book_id = COALESCE(b.book_id, adc.book_id)
//     //     LEFT JOIN Author a ON ba.author_id = a.author_id

//     //     LEFT JOIN Book_Genre bg ON bg.book_id = COALESCE(b.book_id, adc.book_id)
//     //     LEFT JOIN Genre g ON bg.genre_id = g.genre_id

//     //     WHERE br.member_id = $1

//     //     GROUP BY br.borrow_id, b.title, adc.title, b.cover_filename, adc.cover_filename, fc.total_amount, f.fine_type
//     //     ORDER BY br.borrow_id DESC;


//     // SELECT
//     //     br.borrow_id,
//     //     b.title,
//     //     b.cover_filename,
//     //     fc.total_amount,
//     //     f.fine_type,

//     //     -- Authors
//     //     COALESCE(
//     //         string_agg(DISTINCT a.pen_name, ', ') FILTER (WHERE a.pen_name IS NOT NULL),
//     //         'N/A'
//     //     ) AS authors,

//     //     -- Genres
//     //     COALESCE(
//     //         string_agg(DISTINCT g.name, ', ') FILTER (WHERE g.name IS NOT NULL),
//     //         'N/A'
//     //     ) AS genres

//     //     FROM Fine_Calculated fc
//     //     JOIN Fine f ON fc.fine_id = f.fine_id
//     //     JOIN Borrow_record br ON fc.borrow_id = br.borrow_id

//     //     -- Get book_id from active Book_Copy if present
//     //     LEFT JOIN Book_Copy bc ON br.copy_id = bc.copy_id

//     //     -- If copy was deleted, fallback to deleted_copies table
//     //     LEFT JOIN deleted_copies dc ON br.copy_id = dc.original_copy_id

//     //     -- Use COALESCE to pick book_id from active copy or deleted copy
//     //     LEFT JOIN Book b ON b.book_id = COALESCE(bc.book_id, dc.book_id)

//     //     -- Join authors and genres using final book_id
//     //     LEFT JOIN Book_Author ba ON ba.book_id = b.book_id
//     //     LEFT JOIN Author a ON ba.author_id = a.author_id

//     //     LEFT JOIN Book_Genre bg ON bg.book_id = b.book_id
//     //     LEFT JOIN Genre g ON bg.genre_id = g.genre_id

//     //     WHERE br.member_id = $1

//     //     GROUP BY br.borrow_id, b.title, b.cover_filename, fc.total_amount, f.fine_type
//     //     ORDER BY br.borrow_id DESC;




const express = require('express');
const router = express.Router();
const pool = require('../db/client');

router.get('/fines/:memberId', async (req, res) => {
  const memberId = req.params.memberId;

  try {
    console.log(`Fetching fines for memberId=${memberId}`);
    const result = await pool.query(`
      SELECT
        br.borrow_id,
        b.title,
        b.cover_filename,
        fc.total_amount,
        f.fine_type,

        COALESCE(
          string_agg(
            DISTINCT COALESCE(a.pen_name, pi.first_name || ' ' || pi.last_name),
            ', '
          ),
          'N/A'
        ) AS authors,

        COALESCE(
          string_agg(DISTINCT g.name, ', '),
          'N/A'
        ) AS genres

      FROM Fine_Calculated fc
      LEFT JOIN Fine f ON fc.fine_id = f.fine_id
      LEFT JOIN Borrow_record br ON fc.borrow_id = br.borrow_id

      -- Only Book_Copy now
      LEFT JOIN Book_Copy bc ON br.copy_id = bc.copy_id
      LEFT JOIN Book b ON b.book_id = bc.book_id

      LEFT JOIN Book_Author ba ON ba.book_id = b.book_id
      LEFT JOIN Author a ON a.author_id = ba.author_id
      LEFT JOIN Person_Info pi ON pi.person_id = a.person_id

      LEFT JOIN Book_Genre bg ON bg.book_id = b.book_id
      LEFT JOIN Genre g ON g.genre_id = bg.genre_id

      WHERE br.member_id = $1 and fc.pay_status = 'unpaid'

      GROUP BY br.borrow_id, b.title, b.cover_filename, fc.total_amount, f.fine_type
      ORDER BY br.borrow_id DESC;
    `, [memberId]);

    console.log('Query returned rows:', result.rows.length);
    if (result.rows.length > 0) {
      console.log('First row:', result.rows[0]);
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching fines:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/fines/pay/:borrowId', async (req, res) => {
  const borrowId = req.params.borrowId;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const updateResult = await client.query(
      `UPDATE Fine_Calculated
       SET pay_status = 'paid'
       WHERE borrow_id = $1`,
      [borrowId]
    );

    if (updateResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Fine record not found' });
    }

    await client.query('COMMIT');
    res.json({ message: 'Fine marked as paid successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating pay_status:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});


module.exports = router;
