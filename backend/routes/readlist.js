const express = require('express');
const router = express.Router();
const db = require('../db/client');

// GET /member/:memberId/readlist
// Description: Get all books currently borrowed by this member and not yet returned
router.get('/:memberId/readlist', async (req, res) => {
  const { memberId } = req.params;

  try {
    const result = await db.query(`
      SELECT
        br.borrow_id,
        b.book_id,
        b.title,
        b.cover_filename,
        br.borrow_date,
        br.due_return_date,
        COALESCE(r.status, '') AS return_request_status
      FROM borrow_record br
      JOIN book_copy bc ON br.copy_id = bc.copy_id
      JOIN book b ON bc.book_id = b.book_id
      LEFT JOIN return_lost_requests r 
        ON r.borrow_id = br.borrow_id AND r.status = 'pending'
      WHERE br.member_id = $1 AND br.return_date IS NULL
    `, [memberId]);

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching readlist:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /readlist/request
// Member submits a return or lost request for a borrowed book

router.post('/request', async (req, res) => {
  const { borrow_id, request_type } = req.body;

  if (!borrow_id || !['return', 'lost'].includes(request_type)) {
    return res.status(400).json({ error: 'Invalid borrow_id or request_type' });
  }

  const client = await db.connect();

  try {

    await client.query('BEGIN');
    // Check if borrow_id exists and not already returned
    const borrowCheck = await client.query(
      `SELECT return_date FROM borrow_record WHERE borrow_id = $1`,
      [borrow_id]
    );

    if (borrowCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Borrow record not found' });
    }

    if (borrowCheck.rows[0].return_date !== null) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'This book is already returned' });
    }

    // Check if there is already a pending request for this borrow_id
    const existingRequest = await client.query(
      `SELECT * FROM return_lost_requests WHERE borrow_id = $1 AND status = 'pending'`,
      [borrow_id]
    );

    if (existingRequest.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'There is already a pending request for this book' });
    }

    // Insert new request
    await client.query(
      `INSERT INTO return_lost_requests (borrow_id, request_type) VALUES ($1, $2)`,
      [borrow_id, request_type]
    );

    await client.query('COMMIT');
    res.json({ message: 'Request submitted successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error submitting return/lost request:', err);
    res.status(500).json({ error: 'Internal server error' });
  }finally {
    client.release();
  }
});

module.exports = router;
