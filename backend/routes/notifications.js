const express = require('express');
const router = express.Router();
const db = require('../db/client');

router.get('/', async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ message: 'Username required' });

  try {
    // Get account_id from username
    const accountRes = await db.query('SELECT account_id FROM Account WHERE username = $1', [username]);
    if (accountRes.rows.length === 0) return res.status(404).json({ message: 'Account not found' });
    const accountId = accountRes.rows[0].account_id;

    // Get member_id
    const memberRes = await db.query('SELECT member_id FROM Member WHERE account_id = $1', [accountId]);
    if (memberRes.rows.length === 0) return res.status(404).json({ message: 'Member not found' });
    const memberId = memberRes.rows[0].member_id;

    // Get notifications ordered by date desc
    // const notiRes = await db.query(
    //   'SELECT noti_id, message, sent_date FROM Notification WHERE member_id = $1 ORDER BY sent_date DESC',
    //   [memberId]
    // );
      const notiRes = await db.query(
      'SELECT noti_id, message, sent_date, read_status FROM Notification WHERE member_id = $1 ORDER BY sent_date DESC',
      [memberId]
      );

    res.json(notiRes.rows);
  } catch (err) {
    console.error('❌ Error fetching notifications:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id/read', async (req, res) => {
  const notiId = req.params.id;

  try {
    await db.query(
      'UPDATE Notification SET read_status = TRUE WHERE noti_id = $1',
      [notiId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error marking notification as read:', err.message);
    res.status(500).json({ message: 'Failed to update notification status' });
  }
});

module.exports = router;
