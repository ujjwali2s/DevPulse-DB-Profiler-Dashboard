const express = require('express');
const router = express.Router();
const pool = require('../db/client'); 


router.post('/process-request', async (req, res) => {
  const { request_id, staff_id, decision, return_condition } = req.body;

  const client = await pool.connect();

  try {
    console.log('Received request body:', req.body);

    await client.query('BEGIN');

    // Fetch request details
    const requestResult = await client.query(
      `SELECT * FROM return_lost_requests WHERE request_id = $1`,
      [request_id]
    );

    if (requestResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Request not found' });
    }

    const { borrow_id, request_type } = requestResult.rows[0];

    if (request_type === 'return') {
      const returnDate = new Date().toISOString().split('T')[0];

      // Update return_condition BEFORE approving the request
      await client.query(
        `UPDATE borrow_record
         SET return_condition = $1,
             return_date = $2
         WHERE borrow_id = $3`,
        [return_condition.toLowerCase(), returnDate, borrow_id]
      );

      if (return_condition.toLowerCase() === 'okay') {
        await client.query(
          `UPDATE book_copy
           SET availability_status = 'yes'
           WHERE copy_id = (
             SELECT copy_id FROM borrow_record WHERE borrow_id = $1
           )`,
          [borrow_id]
        );
      }
    }

    // Process lost or damaged books (trigger handles fine insert)
    if ((request_type === 'lost' || return_condition?.toLowerCase() === 'damaged') && decision === 'approved') {
      await client.query(
        `UPDATE book_copy
         SET condition = 'lost',
             availability_status = 'no'
         WHERE copy_id = (
           SELECT copy_id FROM borrow_record WHERE borrow_id = $1
         )`,
        [borrow_id]
      );
    }

    // Final status update (this triggers fine if condition is damaged/lost)
    await client.query(
      `UPDATE return_lost_requests
       SET status = $1, staff_id = $2, processed_date = CURRENT_DATE
       WHERE request_id = $3`,
      [decision, staff_id, request_id]
    );

    await client.query('COMMIT');
    res.status(200).json({ message: 'Request processed successfully' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Staff request processing failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});


module.exports = router;
