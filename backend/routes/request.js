const express = require('express');
const router = express.Router();
const db = require('../db/client');
const fs = require('fs');
const path = require('path');

console.log('✅ request.js routes loaded');

// Load insert query from external SQL file
const insertBookRequestSQL = fs.readFileSync(
  path.join(__dirname, '../sql/insert_book_request.sql'),
  'utf8'
);

// TEST ROUTE
router.get('/test', (req, res) => {
  res.send('✅ test route from request.js working');
});

// SEARCH BOOK WITH LEFT JOINS, DISTINCT AGGREGATES, AND GROUP BY TO AVOID DUPLICATES
router.get('/searchBook', async (req, res) => {
  const { title, author, genre, publisher, isbn } = req.query;

  if (!title && !author && !genre && !publisher && !isbn) {
    return res.status(400).json({ message: 'Provide at least one search field.' });
  }

  let query = `
    SELECT 
      b.book_id, b.title, b.isbn, b.price, b.language,
      p.publisher_name,
      COALESCE(array_agg(DISTINCT pi.first_name || ' ' || pi.last_name) FILTER (WHERE pi.first_name IS NOT NULL), '{}') AS authors,
      COALESCE(array_agg(DISTINCT g.name) FILTER (WHERE g.name IS NOT NULL), '{}') AS genres
    FROM Book b
    JOIN Publisher p ON b.publisher_id = p.publisher_id
    LEFT JOIN Book_Author ba ON b.book_id = ba.book_id
    LEFT JOIN Author a ON ba.author_id = a.author_id
    LEFT JOIN Person_Info pi ON a.person_id = pi.person_id
    LEFT JOIN Book_Genre bg ON b.book_id = bg.book_id
    LEFT JOIN Genre g ON bg.genre_id = g.genre_id
    WHERE 1=1
  `;

  const values = [];

  if (title) {
    query += ` AND b.title ILIKE $${values.length + 1}`;
    values.push(`%${title}%`);
  }
  if (author) {
    query += ` AND (pi.first_name || ' ' || pi.last_name) ILIKE $${values.length + 1}`;
    values.push(`%${author}%`);
  }
  if (genre) {
    query += ` AND g.name ILIKE $${values.length + 1}`;
    values.push(`%${genre}%`);
  }
  if (publisher) {
    query += ` AND p.publisher_name ILIKE $${values.length + 1}`;
    values.push(`%${publisher}%`);
  }
  if (isbn) {
    query += ` AND b.isbn ILIKE $${values.length + 1}`;
    values.push(`%${isbn}%`);
  }

  query += `
    GROUP BY b.book_id, p.publisher_name
    ORDER BY b.title
  `;

  try {
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No matching books found' });
    }
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error in searchBook:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// CONFIRM BOOK REQUEST (with price constraint logic)
router.post('/confirm', async (req, res) => {
  const { username, bookId } = req.body;

   const client = await db.connect(); // Get a dedicated client from pool

  try {

     await client.query('BEGIN'); // Start transaction

    // 1. Get account_id from username
    const accountRes = await db.query(
      'SELECT account_id FROM Account WHERE username = $1',
      [username]
    );
    if (accountRes.rows.length === 0) 
    {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Account not found' });
    }

    const accountId = accountRes.rows[0].account_id;

    // 2. Get member info including status and price limit
    const memberRes = await db.query(`
      SELECT m.member_id, ms.status_name, ms.price_limit
      FROM Member m
      JOIN Membership_Status ms ON m.status_id = ms.status_id
      WHERE m.account_id = $1
    `, [accountId]);

    if (memberRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Member not found' });
    }

    const { member_id, status_name, price_limit } = memberRes.rows[0];

    // 3. Get book info
    const bookRes = await db.query(
      'SELECT title, price FROM Book WHERE book_id = $1',
      [bookId]
    );
    if (bookRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Book not found' });
    }

    const { title, price } = bookRes.rows[0];

    // 4. Check constraint for standard member
    if (status_name.toLowerCase() === 'standard' && parseFloat(price) > parseFloat(price_limit)) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        message: `This book costs $${price}, which exceeds your Standard membership limit of $${price_limit}.`,
      });
    }

    // 5. Insert request
    await db.query(insertBookRequestSQL, [member_id, bookId]);

    // 6. Send notification to member
    const message = `Your request for book '${title}' is pending.`;
    await db.query(
      'INSERT INTO Notification (Member_id, Message, Sent_date) VALUES ($1, $2, CURRENT_DATE)',
      [member_id, message]
    );

    await client.query('COMMIT'); // Commit all if successful
    res.json({ message: 'Book request submitted successfully.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error in confirm request:', err.message);
    res.status(500).json({ message: 'Request failed' });
  }
});

// NOTIFICATION FETCHING BY USERNAME
router.get('/notifications', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const accountRes = await db.query(
      'SELECT account_id FROM Account WHERE username = $1',
      [username]
    );
    if (accountRes.rows.length === 0) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const accountId = accountRes.rows[0].account_id;

    const memberRes = await db.query(
      'SELECT member_id FROM Member WHERE account_id = $1',
      [accountId]
    );
    if (memberRes.rows.length === 0) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const memberId = memberRes.rows[0].member_id;

    const notificationsRes = await db.query(
      'SELECT message, sent_date FROM Notification WHERE member_id = $1 ORDER BY sent_date DESC',
      [memberId]
    );

    res.json(notificationsRes.rows);
  } catch (err) {
    console.error('❌ Error fetching notifications:', err.message);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

module.exports = router;



