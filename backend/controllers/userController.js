// controllers/userController.js
const User = require('../models/User');

/**
 * Get User Profile (self)
 * GET /api/users/profile
 */
const getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.user.userId)
      .populate('enrolledCourses')
      .select('-password -__v');

    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      enrolledCourses: user.enrolledCourses,
      hasPaid: user.hasPaid,
    });
  } catch (error) {
    console.error('[USER] getUserProfile error:', error);
    return res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

/**
 * Update User Profile (self)
 * PUT /api/users/profile
 */
const updateUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, phoneNumber } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

    await user.save();

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('[USER] updateUserProfile error:', error);
    return res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

/**
 * Delete User Account (self)
 * DELETE /api/users/profile
 */
const deleteUserAccount = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findByIdAndDelete(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('[USER] deleteUserAccount error:', error);
    return res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};

/**
 * Admin: Delete any user by id
 * DELETE /api/users/:id
 * Middleware: protect, isAdmin
 */
const deleteUserById = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    // Prevent admin from accidentally deleting their own account via admin route
    if (req.user.userId === id) {
      return res.status(400).json({ message: "Refusing to delete own admin account via this route." });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await User.findByIdAndDelete(id);

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('[USER] deleteUserById error:', error);
    return res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, deleteUserAccount, deleteUserById };
