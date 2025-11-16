const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  addCourse,
  getAllCourses,
  editCourse,
  deleteCourse,
  makePayment,
  getPaymentStatus,
  getUserData,
} = require('../controllers/courseController');

// List courses (admin only)
router.get('/', protect, isAdmin, getAllCourses);

// Add a new course (admin-only)
router.post('/', protect, isAdmin, addCourse);

// Edit a course (admin-only)
router.put('/:courseId', protect, isAdmin, editCourse);

// Delete a course (admin-only)
router.delete('/:courseId', protect, isAdmin, deleteCourse);

// Make a payment (admin or user can access)
router.post('/payment', protect, makePayment);

// Get payment status for a user (admin and user)
router.get('/payment/:userId', protect, getPaymentStatus);

// Download user data (admin-only)
router.get('/user-data', protect, isAdmin, getUserData);

module.exports = router;
