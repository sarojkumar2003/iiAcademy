// controllers/courseController.js
const Course = require('../models/Course');
const User = require('../models/User');
const Payment = require('../models/Payment');
const fs = require('fs');
const path = require('path');

/**
 * Note: Route param can be either :courseId or :id depending on your routes.
 * This controller accepts both (prefers courseId then id).
 */
const resolveId = (params) => params.courseId || params.id || params._id || null;

// Add a new course (admin-only)
const addCourse = async (req, res) => {
  const { title, description, duration, instructor } = req.body;

  if (!title || !description || (duration === undefined) || !instructor) {
    return res.status(400).json({ message: 'Please provide all course details' });
  }

  try {
    const newCourse = new Course({
      title,
      description,
      duration,
      instructor,
    });

    await newCourse.save();

    res.status(201).json({
      message: 'Course added successfully',
      course: newCourse,
    });
  } catch (error) {
    console.error('[COURSE] addCourse error:', error);
    res.status(500).json({ message: 'Error adding course', error: error.message });
  }
};

// Get all courses (admin-only)
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    return res.status(200).json(courses);
  } catch (error) {
    console.error('[COURSE] getAllCourses error:', error);
    return res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// Edit a course (admin-only)
const editCourse = async (req, res) => {
  const id = resolveId(req.params);
  if (!id) return res.status(400).json({ message: 'Course id is required' });

  const { title, description, duration, instructor } = req.body;

  try {
    const updated = await Course.findByIdAndUpdate(
      id,
      {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(duration !== undefined ? { duration } : {}),
        ...(instructor !== undefined ? { instructor } : {}),
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      message: 'Course updated successfully',
      course: updated,
    });
  } catch (error) {
    console.error('[COURSE] editCourse error:', error);
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

// Delete a course (admin-only)
const deleteCourse = async (req, res) => {
  const id = resolveId(req.params);
  if (!id) return res.status(400).json({ message: 'Course id is required' });

  try {
    const deleted = await Course.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Optionally you can also remove references in users or payments here.

    res.status(200).json({
      message: 'Course deleted successfully',
      courseId: id,
    });
  } catch (error) {
    console.error('[COURSE] deleteCourse error:', error);
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

// Make a payment (admin or user)
const makePayment = async (req, res) => {
  const { userId, amount, transactionId } = req.body;

  if (!userId || amount === undefined) {
    return res.status(400).json({ message: 'userId and amount are required' });
  }

  try {
    // Verify that the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const newPayment = new Payment({
      userId: user._id,
      amount,
      paymentStatus: 'completed',
      transactionId: transactionId || `tx_${Date.now()}`,
    });

    await newPayment.save();

    // Link the payment to the user
    user.paymentStatus = newPayment._id;
    user.hasPaid = true;
    await user.save();

    res.status(200).json({
      message: 'Payment successful',
      paymentDetails: newPayment,
      user: {
        name: user.name,
        email: user.email,
        hasPaid: user.hasPaid,
      },
    });
  } catch (error) {
    console.error('[COURSE] makePayment error:', error);
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};

// Get payment status (for admins or users)
const getPaymentStatus = async (req, res) => {
  const { userId } = req.params;

  if (!userId) return res.status(400).json({ message: 'userId is required' });

  try {
    // Find the user and their payment status
    const user = await User.findById(userId).populate('paymentStatus');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Payment status fetched successfully',
      paymentStatus: user.paymentStatus,
      hasPaid: user.hasPaid,
    });
  } catch (error) {
    console.error('[COURSE] getPaymentStatus error:', error);
    res.status(500).json({ message: 'Error fetching payment status', error: error.message });
  }
};

// Get user data for download (admin only)
// If query ?download=false is passed, return JSON rather than a file download.
const getUserData = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find().select('-password -__v');

    if (req.query.download === 'false') {
      return res.status(200).json(users);
    }

    // Ensure data directory exists
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    const filePath = path.join(dataDir, 'users.json');
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    res.download(filePath, 'users.json', (err) => {
      if (err) {
        console.error('[COURSE] getUserData download error:', err);
        return res.status(500).json({ message: 'Error downloading user data', error: err.message });
      }
      // Delete file after sending
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (unlinkErr) {
        console.error('[COURSE] getUserData unlink error:', unlinkErr);
      }
    });
  } catch (error) {
    console.error('[COURSE] getUserData error:', error);
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
};

module.exports = {
  addCourse,
  getAllCourses,
  editCourse,
  deleteCourse,
  makePayment,
  getPaymentStatus,
  getUserData,
};
