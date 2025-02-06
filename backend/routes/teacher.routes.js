const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  createTeacher,
  getAllTeachers,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacher.controller');

// Public routes (temporarily for testing)
router.get('/', getAllTeachers);
router.post('/', createTeacher);

// Protected routes for admin only
router.put('/:id', protect, authorize('admin'), updateTeacher);
router.delete('/:id', protect, authorize('admin'), deleteTeacher);

module.exports = router; 