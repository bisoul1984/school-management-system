const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
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
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9+\-() ]+$/, 'Please enter a valid phone number']
  },
  grade: {
    type: String,
    required: [true, 'Grade is required']
  },
  parentName: {
    type: String,
    required: [true, 'Parent/Guardian name is required']
  },
  parentEmail: {
    type: String,
    required: [true, 'Parent/Guardian email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  parentPhone: {
    type: String,
    required: [true, 'Parent/Guardian phone is required'],
    match: [/^[0-9+\-() ]+$/, 'Please enter a valid phone number']
  },
  emergencyContact: {
    type: String,
    required: [true, 'Emergency contact is required']
  },
  medicalInformation: {
    type: String
  }
}, {
  timestamps: true
});

// Add index on email field
studentSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema); 