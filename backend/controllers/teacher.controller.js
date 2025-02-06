const Teacher = require('../models/Teacher');

// Create new teacher
exports.createTeacher = async (req, res) => {
  try {
    // Check if teacher with email already exists
    const existingTeacher = await Teacher.findOne({ email: req.body.email });
    if (existingTeacher) {
      return res.status(400).json({ 
        message: 'Email already exists' 
      });
    }

    const teacher = new Teacher(req.body);
    const savedTeacher = await teacher.save();
    
    console.log('Teacher created:', savedTeacher);
    
    res.status(201).json(savedTeacher);
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(400).json({ 
      message: error.message || 'Failed to create teacher',
      error: error
    });
  }
};

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    console.log(`Found ${teachers.length} teachers`);
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to fetch teachers',
      error: error
    });
  }
};

// Update teacher
exports.updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 