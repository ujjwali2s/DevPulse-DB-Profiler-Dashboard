//not used
const express = require('express');
const router = express.Router();
const db = require('../db/client');

// GET /request
// Fetch all pending return or lost requests with some joined info for frontend display
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        r.request_id, r.request_type, r.status, 
        br.borrow_id, br.member_id, br.copy_id, br.borrow_date, br.due_return_date,
        bc.book_id, b.title
      FROM return_lost_requests r
      JOIN borrow_record br ON r.borrow_id = br.borrow_id
      JOIN book_copy bc ON br.copy_id = bc.copy_id
      JOIN Book b ON bc.book_id = b.book_id
      WHERE r.status = 'pending'
      ORDER BY r.request_id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching return requests:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /request/process-request
// Process a staff action on a return or lost request
router.post('/process-request', async (req, res) => {
  const { request_id, staffUsername, actionDetails } = req.body;

  if (!request_id || !staffUsername || !actionDetails) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    // 1. Get staff_id by username
    const staffRes = await db.query(`
      SELECT s.staff_id
      FROM Staff s
      JOIN Account a ON s.account_id = a.account_id
      WHERE a.username = $1
    `, [staffUsername]);

    if (staffRes.rows.length === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }
    const staff_id = staffRes.rows[0].staff_id;

    // 2. Get the request info joined with borrow_record and book_copy
    const reqRes = await db.query(`
      SELECT r.request_id, r.request_type, r.status, br.borrow_id, br.member_id, br.copy_id, br.borrow_date, br.due_return_date,
             bc.book_id
      FROM return_lost_requests r
      JOIN borrow_record br ON r.borrow_id = br.borrow_id
      JOIN book_copy bc ON br.copy_id = bc.copy_id
      WHERE r.request_id = $1 AND r.status = 'pending'
    `, [request_id]);

    if (reqRes.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found or already processed' });
    }

    const reqData = reqRes.rows[0];

    if (reqData.request_type === 'return') {
      // Handle return request

      const { condition } = actionDetails;
      if (!['returned_good', 'returned_late', 'damaged'].includes(condition)) {
        return res.status(400).json({ error: 'Invalid condition for return' });
      }

      // 3. Calculate fine if needed
      let fineAmount = 0;
      let fineType = null;

      if (condition === 'returned_late') {
        const daysLate = Math.max(
          0,
          Math.floor((new Date() - new Date(reqData.due_return_date)) / (1000 * 3600 * 24))
        );
        if (daysLate > 0) {
          // Get Fine_id and daily_rate for 'Return_delay'
          const fineRateRes = await db.query(`SELECT Fine_id, Daily_rate FROM Fine WHERE Fine_type = 'Return_delay'`);
          if (fineRateRes.rows.length === 0) {
            return res.status(500).json({ error: 'Return_delay fine rate not found' });
          }
          fineType = fineRateRes.rows[0].Fine_id;
          fineAmount = daysLate * parseFloat(fineRateRes.rows[0].Daily_rate);
        }
      } else if (condition === 'damaged') {
        // Get Fine_id and daily_rate for 'Damaged'
        const fineFixedRes = await db.query(`SELECT Fine_id, Daily_rate FROM Fine WHERE Fine_type = 'Damaged'`);
        if (fineFixedRes.rows.length === 0) {
          return res.status(500).json({ error: 'Damaged fine rate not found' });
        }
        fineType = fineFixedRes.rows[0].Fine_id;
        fineAmount = parseFloat(fineFixedRes.rows[0].Daily_rate);
      }

      // 4. Update borrow_record: set return_date = today
      await db.query(`
        UPDATE Borrow_record SET Return_date = CURRENT_DATE WHERE Borrow_id = $1
      `, [reqData.borrow_id]);

      // 5. Update book_copy availability_status = 'yes'
      await db.query(`
        UPDATE Book_Copy SET Availability_status = 'yes' WHERE Copy_id = $1
      `, [reqData.copy_id]);

      // 6. Insert into Fine_Calculated if fineAmount > 0
      if (fineAmount > 0) {
        await db.query(`
          INSERT INTO Fine_Calculated (Fine_id, Borrow_id, Total_amount)
          VALUES ($1, $2, $3)
        `, [fineType, reqData.borrow_id, fineAmount]);
      }

      // 7. Update return_lost_requests status
      await db.query(`
        UPDATE return_lost_requests SET status = 'approved', staff_id = $1, processed_date = CURRENT_DATE
        WHERE request_id = $2
      `, [staff_id, request_id]);

      // 8. Notify member
      const fineMsg = fineAmount > 0 ? ` A fine of ${fineAmount.toFixed(2)} has been applied.` : '';
      const notifMsg = `Your return request has been processed.${fineMsg}`;
      await db.query(`
        INSERT INTO Notification (member_id, message, sent_date)
        VALUES ($1, $2, CURRENT_DATE)
      `, [reqData.member_id, notifMsg]);

      return res.json({ message: 'Return request processed successfully' });

    } else if (reqData.request_type === 'lost') {
      // Handle lost request
      const { markLost } = actionDetails;
      if (!markLost) {
        return res.status(400).json({ error: 'markLost must be true for lost requests' });
      }

      // 3. Calculate lost book fine
      const lostFineRes = await db.query(`SELECT Fine_id, Daily_rate FROM Fine WHERE Fine_type = 'Book_lost'`);
      if (lostFineRes.rows.length === 0) {
        return res.status(500).json({ error: 'Book_lost fine rate not found' });
      }
      const lostFineType = lostFineRes.rows[0].Fine_id;
      const lostFineAmount = parseFloat(lostFineRes.rows[0].Daily_rate);

      // 4. Update borrow_record: set return_date = today
      await db.query(`
        UPDATE Borrow_record SET Return_date = CURRENT_DATE WHERE Borrow_id = $1
      `, [reqData.borrow_id]);

      // 5. Update book_copy availability_status = 'no' (assuming 'no' means lost/unavailable)
      await db.query(`
        UPDATE Book_Copy SET Availability_status = 'no' WHERE Copy_id = $1
      `, [reqData.copy_id]);

      // 6. Insert fine record for lost book
      await db.query(`
        INSERT INTO Fine_Calculated (Fine_id, Borrow_id, Total_amount)
        VALUES ($1, $2, $3)
      `, [lostFineType, reqData.borrow_id, lostFineAmount]);

      // 7. Update return_lost_requests status
      await db.query(`
        UPDATE return_lost_requests SET status = 'approved', staff_id = $1, processed_date = CURRENT_DATE
        WHERE request_id = $2
      `, [staff_id, request_id]);

      // 8. Notify member
      const notifMsg = `Your lost book report has been processed. A fine of ${lostFineAmount.toFixed(2)} has been applied.`;
      await db.query(`
        INSERT INTO Notification (member_id, message, sent_date)
        VALUES ($1, $2, CURRENT_DATE)
      `, [reqData.member_id, notifMsg]);

      return res.json({ message: 'Lost book request processed successfully' });

    } else {
      return res.status(400).json({ error: 'Invalid request type' });
    }

  } catch (err) {
    console.error('Error processing staff request:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
