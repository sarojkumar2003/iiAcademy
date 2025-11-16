const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  deleteUserById,
} = require('../controllers/userController');

// Profile routes (self)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUserAccount);

// Admin route: delete any user by id
router.delete('/:id', protect, isAdmin, deleteUserById);

module.exports = router;
