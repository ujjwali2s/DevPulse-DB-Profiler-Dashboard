const express = require('express');
const router = express.Router();
const pool = require('../db/client');
const fs = require('fs');
const path = require('path');

const homePreviewSQL = fs.readFileSync(path.join(__dirname, '../sql/home_preview_genre.sql'), 'utf8');


router.get('/books/home-preview', async (req, res) => {
  console.log("📥 /books/home-preview called");
  try {
    const result = await pool.query(homePreviewSQL);
    console.log("✅ DB query success. Rows returned:", result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching home preview:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});


module.exports = router;
