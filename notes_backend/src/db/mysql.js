//
// MySQL database connection utility for pool-based connections
//
const mysql = require('mysql2/promise');
require('dotenv').config();

const {
  MYSQL_URL,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DB,
  MYSQL_PORT,
} = process.env;

const pool = mysql.createPool({
  host: MYSQL_URL || 'localhost',
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DB,
  port: MYSQL_PORT ? parseInt(MYSQL_PORT, 10) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
