const express = require('express');
const router = express.Router();
const db = require('../db/client');
const fs = require('fs');
const path = require('path');

console.log('✅ staff.js router loaded');
router.use((req, res, next) => {
  console.log('staff.js router received request:', req.method, req.originalUrl);
  next();
});


// Load the SQL query from file
const staffProfileSQL = fs.readFileSync(
  path.join(__dirname, '../sql/get_staff_profile.sql'),
  'utf8'
);

// Staff profile route - uses /staff/staffProfile?username=...
router.get('/staffProfile', async (req, res) => {
  try {
    const username = req.query.username;
    if (!username) {
      return res.status(400).json({ error: 'Username query parameter is required' });
    }

    const result = await db.query(staffProfileSQL, [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching staff profile:', err);
    res.status(500).json({ error: 'Failed to fetch staff profile' });
  }
});


// ✅ Staff notifications - GET all book requests
router.get('/notifications', async (req, res) => {
  try {
     console.log('🔔 /notifications route hit');
    const result = await db.query(
      `SELECT br.req_id, br.member_id, b.title AS book_title, br.request_status
       FROM Book_Request br
       JOIN Book b ON br.book_id = b.book_id
       ORDER BY br.req_id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching staff notifications:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/approve', async (req, res) => {
  //console.log('🚨 Approve route hit with payload:', req.body);

  const { reqId, staffUsername } = req.body;
   console.log("🚨 Approve route hit with payload:", { reqId, staffUsername });

  try {
     if (!staffUsername) {
      console.log('❌ Missing staffUsername!');
      return res.status(400).json({ message: 'Missing staff username' });
    }

     await db.query('BEGIN'); // Start transaction

    console.log(`Looking up staff: ${staffUsername}`);
    // 1. Get request info
    const requestRes = await db.query(`
      SELECT br.member_id, br.book_id, b.title
      FROM Book_Request br
      JOIN Book b ON br.book_id = b.book_id
      WHERE br.req_id = $1
    `, [reqId]);

    if (requestRes.rows.length === 0) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const { member_id, book_id, title } = requestRes.rows[0];

    // 2. Get staff_id and branch_id from username
    const staffRes = await db.query(`
      SELECT s.staff_id, s.branch_id
      FROM Staff s
      JOIN Account a ON s.account_id = a.account_id
      WHERE a.username = $1
    `, [staffUsername]);

    if (staffRes.rows.length === 0) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const { staff_id, branch_id } = staffRes.rows[0];

    // 3. Check availability
    const copyRes = await db.query(`
      SELECT copy_id FROM Book_Copy
      WHERE book_id = $1 AND branch_id = $2 AND availability_status = 'yes'
      ORDER BY copy_id ASC LIMIT 1
    `, [book_id, branch_id]);

    if (copyRes.rows.length === 0) {
      return res.status(400).json({ message: '❌ No available copies in your branch' });
    }

    const { copy_id } = copyRes.rows[0];

    // 4. Update Book_Request
    await db.query(`
      UPDATE Book_Request SET request_status = 'approved' WHERE req_id = $1
    `, [reqId]);

    // 5. Insert into Borrow_record
    await db.query(`
      INSERT INTO Borrow_Record (member_id, staff_id, copy_id, borrow_date, due_return_date)
      VALUES ($1, $2, $3, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days')
    `, [member_id, staff_id, copy_id]);

    // 6. Mark copy as unavailable
    await db.query(`
      UPDATE Book_Copy SET availability_status = 'no' WHERE copy_id = $1
    `, [copy_id]);

    // 7. Insert notification
    const notiMsg = `Your request for '${title}' has been approved.`;
    await db.query(`
      INSERT INTO Notification (member_id, message, sent_date)
      VALUES ($1, $2, CURRENT_DATE)
    `, [member_id, notiMsg]);

    await db.query('COMMIT'); // Commit all if successful

    res.json({ message: '✅ Request approved, book assigned & member notified' });

  } catch (err) {
    await db.query('ROLLBACK'); // Rollback on error
    console.error('❌ Error during approval:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// New: Get schedule of staff by username
router.get('/schedule', async (req, res) => {
    console.log('🔍 /schedule route hit with query:', req.query);
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: 'Username query parameter required' });
  }

  try {
    // Get staff_id from username
    const staffRes = await db.query(`
      SELECT s.staff_id
      FROM Staff s
      JOIN Account a ON s.account_id = a.account_id
      WHERE a.username = $1
    `, [username]);

    if (staffRes.rows.length === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    const staffId = staffRes.rows[0].staff_id;

    // Get schedule for staff
    const scheduleRes = await db.query(`
      SELECT Schedule_id, Work_date, Start_time, End_time
      FROM Schedule
      WHERE Staff_id = $1
      ORDER BY Work_date, Start_time
    `, [staffId]);

    res.json(scheduleRes.rows);
  } catch (err) {
    console.error('Error fetching schedule:', err);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

router.post('/addCopies', async (req, res) => {
   console.log('POST /addCopies called with body:', req.body);
  const { title, author, numCopies, username } = req.body;

  try {

    await db.query('BEGIN'); // Start transaction
    // Get branch_id of staff using username
    const branchRes = await db.query(`
      SELECT s.branch_id
      FROM Staff s
      JOIN Account a ON s.account_id = a.account_id
      WHERE a.username = $1
    `, [username]);

    if (branchRes.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ message: 'Staff or branch not found' });
    }

    const branchId = branchRes.rows[0].branch_id;

    // Call the stored procedure
    await db.query(`CALL AddBookCopies($1, $2, $3, $4)`, [
      title,
      author,
      branchId,
      numCopies
    ]);

    await db.query('COMMIT'); // Commit all if successful
    res.json({ message: `${numCopies} copies added successfully.` });
  } catch (err) {
    await db.query('ROLLBACK'); // Rollback on error
    console.error('❌ Error in addCopies:', err.message);
    res.status(500).json({ message: err.message });
  }
});



// GET all pending return/lost requests for staff
router.get('/return-lost-requests', async (req, res) => {
  try {

    const result = await db.query(`
      SELECT
        r.request_id,
        r.borrow_id,
        r.request_type,
        r.status,
        br.member_id,
        b.title,
        br.borrow_date,
        br.due_return_date
      FROM return_lost_requests r
      JOIN borrow_record br ON r.borrow_id = br.borrow_id
      JOIN book_copy bc ON br.copy_id = bc.copy_id
      JOIN book b ON bc.book_id = b.book_id
      WHERE r.status = 'pending'
      ORDER BY r.request_id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching pending return/lost requests:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// // POST process a staff decision on a return/lost request
// router.post('/process-return-lost-request', async (req, res) => {
//   const { borrow_id, action, staffUsername } = req.body;
//   console.log('process-return-lost-request body:', req.body);

//   if (!staffUsername || !borrow_id || !action) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {

//     await db.query('BEGIN'); // Start transaction
//     // Get staff_id from username
//     const staffRes = await db.query(`
//       SELECT s.staff_id
//       FROM Staff s
//       JOIN Account a ON s.account_id = a.account_id
//       WHERE a.username = $1
//     `, [staffUsername]);

//     if (staffRes.rows.length === 0) {
//       await db.query('ROLLBACK');
//       return res.status(404).json({ message: 'Staff not found' });
//     }
//     const staff_id = staffRes.rows[0].staff_id;

//     // Get the pending return/lost request for this borrow_id
//     const reqRes = await db.query(`
//       SELECT request_type FROM return_lost_requests
//       WHERE borrow_id = $1 AND status = 'pending'
//     `, [borrow_id]);

//     if (reqRes.rows.length === 0) {
//       await db.query('ROLLBACK');
//       return res.status(404).json({ message: 'No pending return/lost request found' });
//     }

//     const request_type = reqRes.rows[0].request_type;

//     // Update the return_lost_requests status and record staff_id & processed_date
//     await db.query(`
//       UPDATE return_lost_requests
//       SET status = 'approved', staff_id = $1, processed_date = CURRENT_DATE
//       WHERE borrow_id = $2 AND status = 'pending'
//     `, [staff_id, borrow_id]);

//     if (request_type === 'return') {
//       // Call your return fine calculation stored procedure
//       // Pass borrow_id and the action as return condition (mark_late, mark_damaged, mark_okay)
//       await db.query(`CALL calculate_return_fine($1, $2)`, [borrow_id, action]);

//       // Mark the borrow record as returned
//       await db.query(`
//         UPDATE borrow_record
//         SET return_date = CURRENT_DATE
//         WHERE borrow_id = $1
//       `, [borrow_id]);

//     } else if (request_type === 'lost') {
//       // Call your lost fine calculation stored procedure
//       await db.query(`CALL calculate_lost_fine($1)`, [borrow_id]);

//       // Get the copy_id to delete
//       const copyRes = await db.query(`SELECT copy_id FROM borrow_record WHERE borrow_id = $1`, [borrow_id]);
//       const copy_id = copyRes.rows[0]?.copy_id;
//       if (!copy_id) {
//         await db.query('ROLLBACK');
//         return res.status(400).json({ message: 'Book copy not found for this borrow' });
//       }

//       // Delete the book copy - your trigger will archive it automatically
//       await db.query(`DELETE FROM book_copy WHERE copy_id = $1`, [copy_id]);

//       // Mark borrow record as returned (closed)
//       await db.query(`
//         UPDATE borrow_record
//         SET return_date = CURRENT_DATE
//         WHERE borrow_id = $1
//       `, [borrow_id]);
//     }

//     await db.query('COMMIT'); // Commit all if successful
//     // Notification assumed handled by triggers/procedures

//     return res.json({ message: '✅ Request processed and fines calculated where applicable' });

//   } catch (err) {
//     await db.query('ROLLBACK'); // Rollback on error
//     console.error('❌ Error processing request:', err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

module.exports = router;
