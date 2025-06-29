const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Student = require('../models/Student');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');

// Get child progress for parent
router.get('/:parentId/child-progress', protect, async (req, res) => {
  try {
    const { parentId } = req.params;
    
    // Verify the parent exists and get their child information
    const parent = await User.findById(parentId);
    if (!parent || parent.role !== 'parent') {
      return res.status(404).json({ message: 'Parent not found' });
    }

    // Find the child (student) by name
    const child = await Student.findOne({ 
      firstName: parent.childName.split(' ')[0],
      lastName: parent.childName.split(' ').slice(1).join(' ')
    });

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    // Get child's grades
    const grades = await Grade.find({ student: child._id })
      .populate('class', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get child's attendance
    const attendance = await Attendance.find({ student: child._id })
      .sort({ date: -1 })
      .limit(30);

    // Calculate attendance percentage
    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'present').length;
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    // Calculate average grade
    const gradeValues = grades.map(g => g.score);
    const averageGrade = gradeValues.length > 0 
      ? gradeValues.reduce((sum, grade) => sum + grade, 0) / gradeValues.length 
      : 0;

    const progress = {
      child: {
        id: child._id,
        name: `${child.firstName} ${child.lastName}`,
        grade: child.grade
      },
      academic: {
        averageGrade: Math.round(averageGrade * 100) / 100,
        recentGrades: grades.slice(0, 5),
        totalGrades: grades.length
      },
      attendance: {
        percentage: Math.round(attendancePercentage * 100) / 100,
        presentDays,
        totalDays,
        recentAttendance: attendance.slice(0, 10)
      }
    };

    res.json(progress);
  } catch (error) {
    console.error('Error fetching child progress:', error);
    res.status(500).json({ message: 'Error fetching child progress' });
  }
});

module.exports = router; 