const express = require('express');
const router = express.Router();
const db = require('../db/client');
const fs = require('fs');
const path = require('path');


const historySQL = fs.readFileSync(
  path.join(__dirname, '../sql/get_member_history.sql'),
  'utf8'
);

console.log('✅ history.js router loaded');


router.get('/', async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: 'Username query parameter required' });
  }

  try {
    const result = await db.query(historySQL, [username]);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching history:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
