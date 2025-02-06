const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { validateUserUpdate } = require('../middleware/userValidation.middleware');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser
} = require('../controllers/user.controller');
const User = require('../models/User');

// Protect all routes
router.use(protect);

// Get all users (can be filtered by role)
router.get('/', getUsers);

// Create new user (student/teacher)
router.post('/', authorize('admin'), createUser);

// Get, update and delete specific user
router
  .route('/:id')
  .get(getUserById)
  .put(authorize('admin'), validateUserUpdate, updateUser)
  .delete(authorize('admin'), deleteUser);

// Add this route to your existing user.routes.js
router.get('/message-recipients', protect, async (req, res) => {
  try {
    const recipients = await User.find({
      _id: { $ne: req.user._id }, // Exclude current user
      role: { $in: ['teacher', 'admin', 'parent'] } // Only allow messaging these roles
    })
    .select('firstName lastName email role')
    .sort({ firstName: 1 });

    res.json(recipients);
  } catch (error) {
    console.error('Error fetching message recipients:', error);
    res.status(500).json({ message: 'Error fetching message recipients' });
  }
});

module.exports = router; 