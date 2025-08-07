//
// Authentication routes controller - signup, login, whoami
//
const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// JWT expiry/secret - use env or fallback
const SECRET = process.env.JWT_SECRET || 'replace_this_with_strong_secret';
const TOKEN_EXPIRE = '7d';

// PUBLIC_INTERFACE
async function signup(req, res) {
  /** Register a user, hashes password, returns JWT token. */
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ msg: 'Username and password required' });

  const userExists = await userModel.findUserByUsername(username);
  if (userExists)
    return res.status(409).json({ msg: 'Username already exists' });

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await userModel.createUser(username, hashedPassword);
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: TOKEN_EXPIRE });
  res.status(201).json({ token, user: { id: user.id, username: user.username } });
}

// PUBLIC_INTERFACE
async function login(req, res) {
  /** Login, checks password, returns JWT token */
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ msg: 'Username and password required' });

  const user = await userModel.findUserByUsername(username);
  if (!user)
    return res.status(401).json({ msg: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid)
    return res.status(401).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: TOKEN_EXPIRE });
  res.status(200).json({ token, user: { id: user.id, username: user.username } });
}

// PUBLIC_INTERFACE
async function whoami(req, res) {
  /** Returns current user's id and username based on JWT */
  const { user } = req;
  res.status(200).json({ id: user.id, username: user.username });
}

module.exports = {
  signup,
  login,
  whoami,
};
