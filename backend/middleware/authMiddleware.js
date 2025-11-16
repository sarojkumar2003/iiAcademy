// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const ensureJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    console.error('[AUTH MIDDLEWARE] Missing JWT_SECRET in environment');
    throw new Error('JWT_SECRET not configured');
  }
};

// Helper to extract token from Authorization header or cookie
const extractToken = (req) => {
  // Authorization header expected as: "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (authHeader && typeof authHeader === 'string') {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      return parts[1];
    }
    // If header provided without Bearer, try the whole header as token
    if (parts.length === 1) return parts[0];
  }

  // Fallback: token from cookie named 'ii_token'
  if (req.cookies && req.cookies.ii_token) {
    return req.cookies.ii_token;
  }

  return null;
};

// Protect route - Ensure that the user is authenticated (has a valid JWT token)
const protect = (req, res, next) => {
  try {
    ensureJwtSecret();
  } catch (err) {
    return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET missing' });
  }

  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded user info (userId, role, etc.) to the request object
    req.user = decoded;
    next();
  } catch (err) {
    // Provide a clearer message for expired tokens
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // Unexpected error
    console.error('[AUTH MIDDLEWARE] Token verification error:', err);
    return res.status(401).json({ message: 'Token is not valid', error: err.message });
  }
};

// Admin-only route protection - Ensure that the user has admin privileges
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admin privileges required' });
  }
  next();
};

// Generic role-based middleware: authorize('admin'), authorize('user','admin')
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { protect, isAdmin, authorize };
