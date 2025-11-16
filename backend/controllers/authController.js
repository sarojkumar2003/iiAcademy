// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ensureJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    console.error('[AUTH] Missing JWT_SECRET in environment');
    throw new Error('JWT_SECRET not configured');
  }
};

// Admin and User Registration
const register = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;

    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: 'Please provide name, email, phoneNumber and password' });
    }

    // Normalize email
    const emailNorm = String(email).toLowerCase();

    // Check if user already exists
    const userExists = await User.findOne({ email: emailNorm });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Determine role (frontend may set role; backend trusts it for now)
    // NOTE: For production, restrict admin creation or require an invite token.
    const userRole = role && role === 'admin' ? 'admin' : 'user';

    const newUser = new User({
      name,
      email: emailNorm,
      password, // hashed by pre('save')
      phoneNumber,
      role: userRole,
    });

    await newUser.save();

    ensureJwtSecret();
    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error('[AUTH] register error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Admin and User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

    const emailNorm = String(email).toLowerCase();
    const user = await User.findOne({ email: emailNorm });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    ensureJwtSecret();
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error('[AUTH] login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Password Reset
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ message: 'Please provide email and newPassword' });

    const emailNorm = String(email).toLowerCase();
    const user = await User.findOne({ email: emailNorm });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword; // pre('save') will hash
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('[AUTH] resetPassword error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, resetPassword };
