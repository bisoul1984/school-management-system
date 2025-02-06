const express = require('express');
const router = express.Router();
const { createStudent, getAllStudents } = require('../controllers/student.controller');
const { protect } = require('../middleware/auth');
const Grade = require('../models/Grade');
const Assignment = require('../models/Assignment');
const Class = require('../models/Class');
const User = require('../models/User');

router.post('/', createStudent);
router.get('/', getAllStudents);

// Get student's grades
router.get('/:studentId/grades', protect, async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId })
      .sort('-date');
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grades' });
  }
});

// Get student's assignments
router.get('/:studentId/assignments', protect, async (req, res) => {
  try {
    const classes = await Class.find({ students: req.params.studentId });
    const assignments = await Assignment.find({
      class: { $in: classes.map(c => c._id) }
    }).populate('class', 'name');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments' });
  }
});

// Get student's schedule
router.get('/:studentId/schedule', protect, async (req, res) => {
  try {
    const classes = await Class.find({ students: req.params.studentId })
      .populate('teacher', 'firstName lastName');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedule' });
  }
});

// Add this route to get available students (students not assigned to any class)
router.get('/available', protect, async (req, res) => {
  try {
    const assignedStudents = await Class.distinct('students');
    const availableStudents = await User.find({
      _id: { $nin: assignedStudents },
      role: 'student'
    });
    res.json(availableStudents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available students' });
  }
});

module.exports = router; 