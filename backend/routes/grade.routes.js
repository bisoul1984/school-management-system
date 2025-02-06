const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  createGrade,
  getStudentGrades,
  updateGrade,
  getClassPerformance
} = require('../controllers/grade.controller');

router.use(protect);

// Routes accessible by teachers and admins
router
  .route('/')
  .post(authorize('teacher', 'admin'), createGrade)
  .get(getStudentGrades);

router
  .route('/:id')
  .put(authorize('teacher', 'admin'), updateGrade);

router
  .route('/performance/:classId/:subject')
  .get(authorize('teacher', 'admin'), getClassPerformance);

module.exports = router; 