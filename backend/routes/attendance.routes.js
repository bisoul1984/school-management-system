const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Attendance = require('../models/Attendance');

// Get attendance for a class on a specific date
router.get('/:classId/:date', protect, async (req, res) => {
  try {
    const { classId, date } = req.params;
    const attendance = await Attendance.find({
      class: classId,
      date: new Date(date)
    }).populate('student', 'firstName lastName email');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance' });
  }
});

// Mark attendance
router.post('/', protect, authorize(['teacher', 'admin']), async (req, res) => {
  try {
    const { classId, studentId, date, status } = req.body;
    const attendance = await Attendance.findOneAndUpdate(
      { class: classId, student: studentId, date: new Date(date) },
      { status },
      { upsert: true, new: true }
    );
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance' });
  }
});

module.exports = router; 