//client.js
const { Pool } = require('pg');
const pool = new Pool({
  user: 'Library_user',
  host: 'localhost',
  database: 'Library_DB',
  password: '1234',
  port: 5432,
});

module.exports=pool;

// const { Pool } = require('pg');
// const pool = new Pool({
//   user: 'Library_user',
//   host: 'localhost',
//   database: 'Library_DB',
//   password: '1234',
//   port: 5432,
// });
// module.exports=pool;


