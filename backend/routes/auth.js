const express = require('express');
const router = express.Router();
const db = require('../db/client');
const fs = require('fs');
const path = require('path');

// Load SQL files
const loginSQL = fs.readFileSync(path.join(__dirname, '../sql/login_user.sql'), 'utf8');
const staffInfoSQL = fs.readFileSync(path.join(__dirname, '../sql/get_staff_info.sql'), 'utf8');
const memberInfoSQL = fs.readFileSync(path.join(__dirname, '../sql/get_member_info.sql'), 'utf8');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  try {
    const result = await db.query(loginSQL, [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    console.log('Logging in user:', username, 'user_type:', user.user_type);

    if (user.user_type === 'Staff') {
      const staffResult = await db.query(staffInfoSQL, [user.account_id]);
      console.log("staffResult:", staffResult.rows[0]);


      if (staffResult.rows.length === 0) {
        return res.status(500).json({ error: 'Staff info not found' });
      }

      return res.json({
        message: 'Login successful',
        user: {
          username: user.username,
          userType: user.user_type,
          staffInfo: staffResult.rows[0]
        }
      });
    }

    if (user.user_type === 'Member') {
      const memberResult = await db.query(memberInfoSQL, [user.account_id]);

      if (memberResult.rows.length === 0) {
        return res.status(500).json({ error: 'Member info not found' });
      }

      return res.json({
        message: 'Login successful',
        user: {
          username: user.username,
          userType: user.user_type,
          memberInfo: memberResult.rows[0]
        }
      });
    }

    return res.status(400).json({ error: 'Unknown user type' });

  } catch (err) {
    console.error('Login error: ', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
