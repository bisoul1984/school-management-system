const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { validateClassCreation, validateScheduleUpdate } = require('../middleware/classValidation.middleware');
const {
  createClass,
  getAllClasses,
  getClass,
  updateClass,
  deleteClass,
  addStudent,
  removeStudent,
  getSchedule,
  updateSchedule
} = require('../controllers/class.controller');
const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');

// Apply protection to all routes
router.use(protect);

// Public routes (for authenticated users)
router.get('/', getAllClasses);
router.get('/:id', getClass);
router.get('/:id/schedule', getSchedule);

// Admin only routes
router.post('/', authorize('admin'), validateClassCreation, createClass);
router.put('/:id', authorize('admin'), updateClass);
router.delete('/:id', authorize('admin'), deleteClass);
router.put('/:id/schedule', authorize('admin'), validateScheduleUpdate, updateSchedule);
router.post('/:id/students', authorize('admin'), addStudent);
router.delete('/:id/students/:studentId', authorize('admin'), removeStudent);

// Get all classes
router.get('/', protect, async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('teacher', 'firstName lastName')
      .populate('students', 'firstName lastName');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classes' });
  }
});

// Get class details
router.get('/:classId', protect, async (req, res) => {
  try {
    const classDetails = await Class.findById(req.params.classId)
      .populate('teacher', 'firstName lastName email')
      .populate('students', 'firstName lastName email');
    
    if (!classDetails) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(classDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching class details' });
  }
});

// Get class assignments
router.get('/:classId/assignments', protect, async (req, res) => {
  try {
    const assignments = await Assignment.find({ class: req.params.classId })
      .populate('submissions.student', 'firstName lastName');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments' });
  }
});

// Add assignment to class
router.post('/:classId/assignments', protect, authorize(['teacher', 'admin']), async (req, res) => {
  try {
    const newAssignment = await Assignment.create({
      ...req.body,
      class: req.params.classId
    });
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating assignment' });
  }
});

// Add student to class
router.post('/:classId/students', protect, authorize(['admin']), async (req, res) => {
  try {
    const classToUpdate = await Class.findById(req.params.classId);
    if (!classToUpdate) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const { studentId } = req.body;
    if (!classToUpdate.students.includes(studentId)) {
      classToUpdate.students.push(studentId);
      await classToUpdate.save();
    }

    res.json(classToUpdate);
  } catch (error) {
    res.status(500).json({ message: 'Error adding student to class' });
  }
});

// Remove student from class
router.delete('/:classId/students/:studentId', protect, authorize(['admin']), async (req, res) => {
  try {
    const classToUpdate = await Class.findById(req.params.classId);
    if (!classToUpdate) {
      return res.status(404).json({ message: 'Class not found' });
    }

    classToUpdate.students = classToUpdate.students.filter(
      student => student.toString() !== req.params.studentId
    );
    await classToUpdate.save();

    res.json(classToUpdate);
  } catch (error) {
    res.status(500).json({ message: 'Error removing student from class' });
  }
});

// Get grades for a class
router.get('/:classId/grades', protect, async (req, res) => {
  try {
    const grades = await Grade.find({ class: req.params.classId })
      .populate('student', 'firstName lastName')
      .sort('-date');
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grades' });
  }
});

// Get performance data for a class
router.get('/:classId/performance', protect, async (req, res) => {
  try {
    const classId = req.params.classId;
    const classData = await Class.findById(classId).populate('students');
    
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const performanceData = await Promise.all(
      classData.students.map(async (student) => {
        // Get grades
        const grades = await Grade.find({ 
          class: classId, 
          student: student._id 
        });

        // Get attendance
        const attendance = await Attendance.find({
          class: classId,
          student: student._id
        });

        // Get assignments
        const assignments = await Assignment.find({
          class: classId,
          'submissions.student': student._id
        });

        // Calculate metrics
        const averageScore = grades.length > 0
          ? grades.reduce((acc, grade) => acc + grade.score, 0) / grades.length
          : 0;

        const attendanceRate = attendance.length > 0
          ? (attendance.filter(a => a.status === 'present').length / attendance.length) * 100
          : 0;

        return {
          student: {
            _id: student._id,
            firstName: student.firstName,
            lastName: student.lastName
          },
          averageScore,
          attendanceRate,
          completedAssignments: assignments.length
        };
      })
    );

    res.json(performanceData);
  } catch (error) {
    console.error('Error fetching performance data:', error);
    res.status(500).json({ message: 'Error fetching performance data' });
  }
});

module.exports = router; 