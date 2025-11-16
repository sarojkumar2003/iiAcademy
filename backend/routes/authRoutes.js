const express = require('express');
const { register, login, resetPassword } = require('../controllers/authController');

const router = express.Router();

// Admin / User Registration
router.post('/register', register);

// Login
router.post('/login', login);

// Password Reset
router.post('/reset-password', resetPassword);

module.exports = router;
