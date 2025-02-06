const Attendance = require('../models/Attendance');
const Class = require('../models/Class');

// Create attendance record
exports.createAttendance = async (req, res) => {
  try {
    const { classId, date, subject, records } = req.body;

    // Verify class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    const attendance = await Attendance.create({
      class: classId,
      date,
      subject,
      teacher: req.user._id,
      records
    });

    res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Attendance record already exists for this class, date and subject'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get attendance by class and date range
exports.getAttendance = async (req, res) => {
  try {
    const { classId, startDate, endDate } = req.query;

    const query = {
      class: classId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    const attendance = await Attendance.find(query)
      .populate('teacher', 'firstName lastName')
      .populate('records.student', 'firstName lastName');

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update attendance record
exports.updateAttendance = async (req, res) => {
  try {
    const { records } = req.body;
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { records },
      { new: true, runValidators: true }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 