const Class = require('../models/Class');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Create new class
exports.createClass = async (req, res) => {
  try {
    console.log('Creating class with data:', req.body);

    const newClass = new Class({
      className: req.body.className,
      grade: req.body.grade,
      section: req.body.section,
      teacher: req.body.teacher,
      subject: req.body.subject,
      capacity: req.body.capacity || 30,
      academicYear: req.body.academicYear,
      schedule: req.body.schedule || []
    });

    const savedClass = await newClass.save();
    console.log('Class created:', savedClass);
    res.status(201).json(savedClass);
  } catch (error) {
    console.error('Error creating class:', error);
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors: messages
      });
    }

    // Handle other errors
    res.status(500).json({ 
      message: 'Failed to create class',
      error: error.message
    });
  }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('teacher', 'firstName lastName')
      .sort({ createdAt: -1 });
    console.log(`Found ${classes.length} classes`);
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to fetch classes',
      error: error
    });
  }
};

// Get single class
exports.getClass = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id)
      .populate('teacher', 'firstName lastName email')
      .populate('students', 'firstName lastName email');

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.json({
      success: true,
      data: classItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update class
exports.updateClass = async (req, res) => {
  try {
    const classItem = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.json({
      success: true,
      data: classItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete class
exports.deleteClass = async (req, res) => {
  try {
    const classItem = await Class.findByIdAndDelete(req.params.id);

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Add student to class
exports.addStudent = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    const student = await User.findById(req.body.studentId);
    if (!student || student.role !== 'student') {
      return res.status(400).json({
        success: false,
        message: 'Invalid student'
      });
    }

    // Check if student is already in class
    if (classData.students.includes(student._id)) {
      return res.status(400).json({
        success: false,
        message: 'Student already in class'
      });
    }

    classData.students.push(student._id);
    await classData.save();

    await classData.populate('students', 'firstName lastName email');

    res.json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Remove student from class
exports.removeStudent = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    const studentIndex = classData.students.indexOf(req.params.studentId);
    if (studentIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Student not found in class'
      });
    }

    classData.students.splice(studentIndex, 1);
    await classData.save();

    res.json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update class schedule
exports.updateSchedule = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    classData.schedule = req.body.schedule;
    await classData.save();

    res.json({
      success: true,
      data: classData.schedule
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get class schedule
exports.getSchedule = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .select('schedule');

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.json({
      success: true,
      data: classData.schedule || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 