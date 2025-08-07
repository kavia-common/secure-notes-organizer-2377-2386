//
// User model for DB actions
//

const pool = require('../db/mysql');

// PUBLIC_INTERFACE
async function findUserByUsername(username) {
  /** Find user by username. Returns user object or null */
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE username = ? LIMIT 1',
    [username]
  );
  return rows.length ? rows[0] : null;
}

// PUBLIC_INTERFACE
async function findUserById(id) {
  /** Find user by user id. Returns user object or null */
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows.length ? rows[0] : null;
}

// PUBLIC_INTERFACE
async function createUser(username, hashedPassword) {
  /** Create a new user, returns the created user row (id, username) */
  const [result] = await pool.query(
    'INSERT INTO users (username, password_hash) VALUES (?, ?)',
    [username, hashedPassword]
  );
  const [rows] = await pool.query(
    'SELECT id, username FROM users WHERE id = ?', [result.insertId]);
  return rows.length ? rows[0] : null;
}

module.exports = {
  findUserByUsername,
  findUserById,
  createUser
};
