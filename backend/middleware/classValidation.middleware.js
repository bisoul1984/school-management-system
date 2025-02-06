const { body, param, validationResult } = require('express-validator');

exports.validateClassCreation = [
  body('className').trim().notEmpty().withMessage('Class name is required'),
  body('grade').trim().notEmpty().withMessage('Grade is required'),
  body('section').trim().notEmpty().withMessage('Section is required'),
  body('teacher').notEmpty().withMessage('Teacher is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('academicYear').trim().notEmpty().withMessage('Academic year is required'),
  body('schedule').isArray().withMessage('Schedule must be an array'),
  body('schedule.*.day').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
    .withMessage('Invalid day'),
  body('schedule.*.startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid start time format'),
  body('schedule.*.endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid end time format'),
  
  // Add validation result handler
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }
    next();
  }
];

exports.validateScheduleUpdate = [
  body('schedule').isArray().withMessage('Schedule must be an array'),
  body('schedule.*.day').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
    .withMessage('Invalid day'),
  body('schedule.*.startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid start time format'),
  body('schedule.*.endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid end time format')
]; 