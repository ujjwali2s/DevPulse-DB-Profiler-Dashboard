const express = require('express');
const router = express.Router();
const pool = require('../db/client');
const fs = require('fs');
const path = require('path');


const booksBorrowedSQL = fs.readFileSync(path.join(__dirname, '../sql/books_borrowed.sql'), 'utf8');
const mostPopularSQL = fs.readFileSync(path.join(__dirname, '../sql/most_popular.sql'), 'utf8');

// Route 1: Get recent borrowed books for a member (last month)
router.get('/borrowed/:memberId', async (req, res) => {
  const { memberId } = req.params;
  try {
    const result = await pool.query(booksBorrowedSQL, [memberId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching borrowed books:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Route 2: Get most popular books last month
router.get('/popular', async (req, res) => {
  try {
    const result = await pool.query(mostPopularSQL);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching popular books:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
