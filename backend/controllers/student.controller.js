const Student = require('../models/Student');

// Create new student
exports.createStudent = async (req, res) => {
  try {
    // Check if student with email already exists
    const existingStudent = await Student.findOne({ email: req.body.email });
    if (existingStudent) {
      return res.status(400).json({ 
        message: 'Email already exists' 
      });
    }

    const student = new Student(req.body);
    const savedStudent = await student.save();
    
    console.log('Student created:', savedStudent);
    
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(400).json({ 
      message: error.message || 'Failed to create student',
      error: error
    });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    console.log(`Found ${students.length} students`);
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to fetch students',
      error: error
    });
  }
}; 