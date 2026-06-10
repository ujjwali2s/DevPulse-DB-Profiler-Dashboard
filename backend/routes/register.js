const express = require('express');
const router = express.Router();
const db = require('../db/client');
const fs = require('fs');
const path = require('path');


const addressSQL = fs.readFileSync(path.join(__dirname, '../sql/insert_address.sql'), 'utf8');
const personSQL = fs.readFileSync(path.join(__dirname, '../sql/insert_person.sql'), 'utf8');
const accountSQL = fs.readFileSync(path.join(__dirname, '../sql/insert_account.sql'), 'utf8');
const memberSQL = fs.readFileSync(path.join(__dirname, '../sql/insert_member.sql'), 'utf8');

// SQL to check existing email
const checkEmailSQL = 'SELECT person_id FROM person_info WHERE email = $1';




router.post('/signup/step1', async (req, res) => {
  const { email } = req.body;
  try {
    const existingEmail = await db.query(checkEmailSQL, [email]);
    if (existingEmail.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.json({ message: 'Email available' });
  } catch (err) {
    res.status(500).json({ error: 'Error checking email' });
  }
});


router.post('/signup/step2', async (req, res) => {
  const {
    firstName, lastName, email, phone,
    street, postalCode, city, division, country,
    username, password, paymentAmount 
  } = req.body;

  const statusId = paymentAmount === 200 ? 1 : 2;

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const existingUser = await client.query('SELECT 1 FROM account WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Username already taken' });
    }

    const addressRes = await client.query(addressSQL, [street, postalCode, city, division, country]);
    const addressId = addressRes.rows[0].address_id;

    const personRes = await client.query(personSQL, [firstName, lastName, email, phone, addressId]);
    const personId = personRes.rows[0].person_id;

    const accountRes = await client.query(accountSQL, [username, password]);
    const accountId = accountRes.rows[0].account_id;

    await client.query(memberSQL, [personId, accountId, statusId]); 

    await client.query('COMMIT');
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Signup failed:', err.message);
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Signup failed' });
  } finally {
    client.release();
  }
});



module.exports = router;