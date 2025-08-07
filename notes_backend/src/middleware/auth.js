//
// JWT authentication middleware for protecting routes
//
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'replace_this_with_strong_secret';

// PUBLIC_INTERFACE
function requireAuth(req, res, next) {
  /** Middleware: verifies JWT and attaches user object to req */
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Missing or invalid auth header' });
  }
  const token = header.split(' ')[1];
  try {
    const info = jwt.verify(token, SECRET);
    req.user = info;
    next();
  } catch (e) {
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
}

module.exports = {
  requireAuth
};
