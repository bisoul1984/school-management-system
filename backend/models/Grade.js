const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['quiz', 'test', 'homework', 'exam'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate grades
gradeSchema.index(
  { 
    student: 1, 
    subject: 1, 
    type: 1, 
    date: 1 
  }, 
  { unique: true }
);

module.exports = mongoose.model('Grade', gradeSchema); 