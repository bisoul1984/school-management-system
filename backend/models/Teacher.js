const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9+\-() ]+$/, 'Please enter a valid phone number']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['male', 'female', 'other'],
      message: '{VALUE} is not a valid gender'
    }
  },
  subject: {
    type: String,
    required: [true, 'Subject is required']
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required']
  },
  experience: {
    type: Number,
    default: 0
  },
  joiningDate: {
    type: Date,
    required: [true, 'Joining date is required']
  },
  salary: {
    type: Number,
    default: 0
  },
  emergencyContact: String
}, {
  timestamps: true
});

// Add index on email field
teacherSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Teacher', teacherSchema); 