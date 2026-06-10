//not used 

const express = require('express');
const router = express.Router();
const pool = require('../db/client');

// Get all fine types and their rates
router.get('/fine-types', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Fine ORDER BY Fine_type');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching fine types:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get member's currently borrowed books (return_date IS NULL means borrowed)
router.get('/member/:memberId/borrowed-books', async (req, res) => {
  try {
    const { memberId } = req.params;
    const query = `
      SELECT 
        br.borrow_id,
        br.copy_id,
        br.borrow_date,
        br.due_return_date,
        b.title,
        b.isbn,
        COALESCE(a.pen_name, pi.first_name || ' ' || pi.last_name) AS author,
        CASE 
          WHEN br.due_return_date < CURRENT_DATE 
          THEN CURRENT_DATE - br.due_return_date 
          ELSE 0 
        END as overdue_days
      FROM Borrow_record br
      JOIN Book_Copy bc ON br.copy_id = bc.copy_id
      JOIN Book b ON bc.book_id = b.book_id
      LEFT JOIN Book_Author ba ON b.book_id = ba.book_id
      LEFT JOIN Author a ON ba.author_id = a.author_id
      LEFT JOIN Person_Info pi ON a.person_id = pi.person_id
      WHERE br.member_id = $1 AND br.return_date IS NULL
      ORDER BY br.borrow_date DESC
    `;
    const result = await pool.query(query, [memberId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching borrowed books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Process book return or report lost
router.post('/process-return', async (req, res) => {
  const client = await pool.connect();
  try {
    const { borrowId, condition, staffId } = req.body;
    await client.query('BEGIN');

    // Get borrow record details and calculate overdue days
    const borrowQuery = `
      SELECT br.*, CURRENT_DATE - br.due_return_date AS overdue_days
      FROM Borrow_record br
      WHERE br.borrow_id = $1
    `;
    const borrowResult = await client.query(borrowQuery, [borrowId]);
    if (borrowResult.rows.length === 0) {
      throw new Error('Borrow record not found');
    }

    const borrowRecord = borrowResult.rows[0];
    let fineAmount = 0;
    let fineTypeId = null;

    // Fetch Fine ID and Rate based on condition and overdue days
    if (condition === 'Return_delay' && borrowRecord.overdue_days > 0) {
      const result = await client.query(
        `SELECT * FROM Fine WHERE Fine_type = 'Return_delay'`
      );
      if (result.rows.length > 0) {
        fineTypeId = result.rows[0].fine_id;
        fineAmount = borrowRecord.overdue_days * result.rows[0].daily_rate;
      }
    } else if (condition === 'Book_lost' || condition === 'Damaged') {
      const result = await client.query(
        `SELECT * FROM Fine WHERE Fine_type = $1`,
        [condition]
      );
      if (result.rows.length > 0) {
        fineTypeId = result.rows[0].fine_id;
        fineAmount = result.rows[0].daily_rate; // flat fine
      }
    }

    // Update borrow record's return date (mark returned)
    await client.query(
      `UPDATE Borrow_record SET return_date = CURRENT_DATE WHERE borrow_id = $1`,
      [borrowId]
    );

    // Insert fine record if applicable
    if (fineTypeId && fineAmount > 0) {
      await client.query(
        `INSERT INTO Fine_Calculated (fine_id, borrow_id, total_amount) VALUES ($1, $2, $3)`,
        [fineTypeId, borrowId, fineAmount]
      );
    }

    // Update book availability if not lost
    if (condition !== 'Book_lost') {
      const bookIdResult = await client.query(
        `SELECT book_id FROM Book_Copy WHERE copy_id = $1`,
        [borrowRecord.copy_id]
      );
      const bookId = bookIdResult.rows[0].book_id;
      await client.query(
        `UPDATE Book SET available_copies = available_copies + 1 WHERE book_id = $1`,
        [bookId]
      );
    }

    await client.query('COMMIT');
    res.json({
      success: true,
      message: 'Book return processed successfully',
      fine_amount: fineAmount,
      condition: condition
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing return:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Get member's fine history
router.get('/member/:memberId/fines', async (req, res) => {
  try {
    const { memberId } = req.params;
    const query = `
      SELECT 
        fc.total_amount,
        f.fine_type,
        f.daily_rate,
        br.borrow_date,
        br.due_return_date,
        br.return_date,
        b.title,
        COALESCE(a.pen_name, pi.first_name || ' ' || pi.last_name) AS author
      FROM Fine_Calculated fc
      JOIN Fine f ON fc.fine_id = f.fine_id
      JOIN Borrow_record br ON fc.borrow_id = br.borrow_id
      JOIN Book_Copy bc ON br.copy_id = bc.copy_id
      JOIN Book b ON bc.book_id = b.book_id
      LEFT JOIN Book_Author ba ON b.book_id = ba.book_id
      LEFT JOIN Author a ON ba.author_id = a.author_id
      LEFT JOIN Person_Info pi ON a.person_id = pi.person_id
      WHERE br.member_id = $1
      ORDER BY br.return_date DESC
    `;
    const result = await pool.query(query, [memberId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching fines:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get total outstanding fines for member
router.get('/member/:memberId/outstanding-fines', async (req, res) => {
  try {
    const { memberId } = req.params;
    const query = `
      SELECT 
        COALESCE(SUM(fc.total_amount), 0) as total_outstanding
      FROM Fine_Calculated fc
      JOIN Borrow_record br ON fc.borrow_id = br.borrow_id
      WHERE br.member_id = $1
    `;
    const result = await pool.query(query, [memberId]);
    res.json({ total_outstanding: result.rows[0].total_outstanding });
  } catch (error) {
    console.error('Error fetching outstanding fines:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
