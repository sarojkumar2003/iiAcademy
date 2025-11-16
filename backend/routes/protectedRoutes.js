const express = require('express');
const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// accessible to any authenticated user
router.get('/protected', protect, (req, res) => {
  res.json({ message: 'You have access to this protected route' });
});

// admin-only test route
router.get('/admin', protect, isAdmin, (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

module.exports = router;
