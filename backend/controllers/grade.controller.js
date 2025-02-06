const Grade = require('../models/Grade');
const Class = require('../models/Class');

// Create grade
exports.createGrade = async (req, res) => {
  try {
    const {
      studentId,
      classId,
      subject,
      assessmentType,
      assessmentName,
      maxScore,
      score,
      feedback
    } = req.body;

    // Verify class exists and student belongs to it
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    if (!classData.students.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Student does not belong to this class'
      });
    }

    const grade = await Grade.create({
      student: studentId,
      class: classId,
      subject,
      assessmentType,
      assessmentName,
      maxScore,
      score,
      feedback,
      gradedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: grade
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Grade already exists for this assessment'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get student grades
exports.getStudentGrades = async (req, res) => {
  try {
    const { studentId, classId, subject } = req.query;
    const query = { student: studentId };

    if (classId) query.class = classId;
    if (subject) query.subject = subject;

    const grades = await Grade.find(query)
      .populate('gradedBy', 'firstName lastName')
      .populate('class', 'name grade section');

    res.json({
      success: true,
      data: grades
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update grade
exports.updateGrade = async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const grade = await Grade.findByIdAndUpdate(
      req.params.id,
      { 
        score, 
        feedback,
        gradedBy: req.user._id 
      },
      { new: true, runValidators: true }
    );

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    res.json({
      success: true,
      data: grade
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get class performance summary
exports.getClassPerformance = async (req, res) => {
  try {
    const { classId, subject } = req.params;

    const grades = await Grade.find({
      class: classId,
      subject: subject
    }).populate('student', 'firstName lastName');

    const summary = {
      totalStudents: new Set(grades.map(g => g.student._id.toString())).size,
      assessments: {},
      averageScore: 0
    };

    grades.forEach(grade => {
      if (!summary.assessments[grade.assessmentType]) {
        summary.assessments[grade.assessmentType] = {
          count: 0,
          averageScore: 0,
          scores: []
        };
      }

      const assessment = summary.assessments[grade.assessmentType];
      assessment.count++;
      assessment.scores.push((grade.score / grade.maxScore) * 100);
      assessment.averageScore = assessment.scores.reduce((a, b) => a + b) / assessment.scores.length;
    });

    const allScores = grades.map(g => (g.score / g.maxScore) * 100);
    summary.averageScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 