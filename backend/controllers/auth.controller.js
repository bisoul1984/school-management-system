const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      role,
      // Teacher specific fields
      subject,
      qualifications,
      // Student specific fields
      grade,
      dateOfBirth,
      // Parent specific fields
      childName,
      phone
    } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    // Create user with role-specific fields
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role
    };

    // Add role-specific fields
    if (role === 'teacher') {
      if (!subject || !qualifications) {
        return res.status(400).json({
          message: 'Subject and qualifications are required for teachers'
        });
      }
      userData.subject = subject;
      userData.qualifications = qualifications;
    }

    if (role === 'student') {
      if (!grade || !dateOfBirth) {
        return res.status(400).json({
          message: 'Grade and date of birth are required for students'
        });
      }
      userData.grade = grade;
      userData.dateOfBirth = dateOfBirth;
    }

    if (role === 'parent') {
      if (!childName) {
        return res.status(400).json({
          message: 'Child name is required for parents'
        });
      }
      userData.childName = childName;
      userData.phone = phone;
    }

    const user = await User.create(userData);

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user._id);
    
    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
}; 