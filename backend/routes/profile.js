const express = require('express');
const router = express.Router();
const db = require('../db/client');
const fs = require('fs');
const path = require('path');

const getMemberProfileSQL = fs.readFileSync(
  path.join(__dirname, '../sql/get_member_profile.sql'),
  'utf8'
);


router.get('/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const result = await db.query(getMemberProfileSQL, [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Profile fetch error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/change-membership', async (req, res) => {
  const { username } = req.body;

  try {
    // Get current status and member_id
    const currentStatusResult = await db.query(`
      SELECT ms.status_name, m.member_id
      FROM Member m
      JOIN Membership_Status ms ON m.status_id = ms.status_id
      JOIN Account a ON m.account_id = a.account_id
      WHERE a.username = $1
    `, [username]);

    if (currentStatusResult.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const { status_name, member_id } = currentStatusResult.rows[0];

    const newStatus = status_name === 'standard' ? 'premium' : 'standard';

    // Get new status_id
    const newStatusResult = await db.query(
      `SELECT status_id FROM Membership_Status WHERE status_name = $1`,
      [newStatus]
    );

    if (newStatusResult.rows.length === 0) {
      return res.status(500).json({ error: 'New membership status not found' });
    }

    const newStatusId = newStatusResult.rows[0].status_id;

    // Update membership
    await db.query(
      `UPDATE Member SET status_id = $1 WHERE member_id = $2`,
      [newStatusId, member_id]
    );

    return res.json({ message: `Membership successfully changed to ${newStatus}.` });

  } catch (err) {
    console.error('❌ Membership update error:', err.message);
    res.status(500).json({ error: 'Server error while updating membership' });
  }
});

// // PUT /profile/deactivate-account -- Deactivate account with password confirmation
// router.put('/deactivate-account', async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ error: 'Username and password required' });
//   }

//   try {
//     // 1. Fetch account details by username
//     const accountRes = await db.query(
//       'SELECT account_id, password FROM account WHERE username = $1',
//       [username]
//     );

//     if (accountRes.rows.length === 0) {
//       return res.status(404).json({ error: 'Account not found' });
//     }

//     const account = accountRes.rows[0];

//     // 2. Verify password (plain text example)
//     // If passwords are hashed, use bcrypt.compare instead:
//     // const validPass = await bcrypt.compare(password, account.password);
//     if (password !== account.password) {
//       return res.status(401).json({ error: 'Incorrect password' });
//     }

//     // 3. Delete the account (CASCADE deletes member and related rows)
//     await db.query('DELETE FROM account WHERE account_id = $1', [account.account_id]);

//     res.json({ message: 'Account successfully deactivated.' });
//   } catch (err) {
//     console.error('Error deactivating account:', err);
//     res.status(500).json({ error: 'Server error during deactivation' });
//   }
// });
router.put('/deactivate-account', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Deactivate account request:', username);

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required.' });
    }

    const accountResult = await db.query('SELECT * FROM Account WHERE Username = $1', [username]);
    if (accountResult.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found.' });
    }

    const account = accountResult.rows[0];

    if (password !== account.password) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    await db.query('BEGIN');

    // This will delete Account and cascade delete Member, Book_Request, Borrow_Record, etc.
    await db.query('DELETE FROM Account WHERE Account_id = $1', [account.account_id]);

    await db.query('COMMIT');

    res.json({ message: 'Account deactivated successfully.' });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Deactivate account error:', err.stack || err.message || err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// PUT /profile/modify-account
router.put('/modify-account', async (req, res) => {
  const { currentUsername, newUsername, newPassword } = req.body;

  if (!newUsername && !newPassword) {
    return res.status(400).json({ error: 'At least one field must be updated.' });
  }

  try {
    const accountRes = await db.query(
      'SELECT account_id FROM Account WHERE username = $1',
      [currentUsername]
    );

    if (accountRes.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found.' });
    }

    const accountId = accountRes.rows[0].account_id;

    const updates = [];
    const values = [];
    let index = 1;

    if (newUsername) {
      updates.push(`Username = $${index++}`);
      values.push(newUsername);
    }
    if (newPassword) {
      updates.push(`Password = $${index++}`);
      values.push(newPassword);
    }
    values.push(accountId);

    const updateSQL = `UPDATE Account SET ${updates.join(', ')} WHERE Account_id = $${index}`;
    await db.query(updateSQL, values);

    res.json({ message: 'Account successfully updated.' });
  } catch (err) {
    console.error('Error updating account:', err);
    res.status(500).json({ error: 'Server error during update' });
  }
});




module.exports = router;

