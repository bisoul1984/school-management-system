const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  startTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  },
  endTime: {
    type: String,
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  }
});

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  schedule: {
    day: String,
    time: String
  },
  room: String,
  subject: String,
  capacity: {
    type: Number,
    required: [true, 'Class capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    default: 30
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Class', classSchema); 
module.exports = mongoose.model('Class', classSchema); 