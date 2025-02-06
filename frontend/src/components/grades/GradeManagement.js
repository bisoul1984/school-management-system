import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGrade } from '../../store/slices/gradeSlice';

const GradeManagement = () => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.class);
  const { loading, error } = useSelector((state) => state.grade);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [assessmentType, setAssessmentType] = useState('');
  const [assessmentName, setAssessmentName] = useState('');
  const [maxScore, setMaxScore] = useState(100);
  const [grades, setGrades] = useState([]);

  const assessmentTypes = ['assignment', 'quiz', 'exam', 'project'];

  const handleGradeChange = (studentId, score) => {
    setGrades(prev =>
      prev.map(grade =>
        grade.student === studentId
          ? { ...grade, score: Math.min(Math.max(0, Number(score)), maxScore) }
          : grade
      )
    );
  };

  const handleFeedbackChange = (studentId, feedback) => {
    setGrades(prev =>
      prev.map(grade =>
        grade.student === studentId
          ? { ...grade, feedback }
          : grade
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const gradesData = grades.map(grade => ({
      student: grade.student,
      class: selectedClass,
      subject: selectedSubject,
      assessmentType,
      assessmentName,
      maxScore,
      score: grade.score,
      feedback: grade.feedback
    }));

    await dispatch(createGrade(gradesData));
  };

  return (
    <div className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Grade Management</h3>
          <p className="mt-1 text-sm text-gray-500">
            Enter grades for student assessments.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                  Class
                </label>
                <select
                  id="class"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.name} - {cls.grade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <select
                  id="subject"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select a subject</option>
                  {selectedClass && classes
                    .find(cls => cls._id === selectedClass)?.subjects
                    .map(subject => (
                      <option key={subject._id} value={subject.name}>
                        {subject.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="assessmentType" className="block text-sm font-medium text-gray-700">
                  Assessment Type
                </label>
                <select
                  id="assessmentType"
                  value={assessmentType}
                  onChange={(e) => setAssessmentType(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select type</option>
                  {assessmentTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="maxScore" className="block text-sm font-medium text-gray-700">
                  Maximum Score
                </label>
                <input
                  type="number"
                  id="maxScore"
                  value={maxScore}
                  onChange={(e) => setMaxScore(Number(e.target.value))}
                  min="1"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="assessmentName" className="block text-sm font-medium text-gray-700">
                  Assessment Name
                </label>
                <input
                  type="text"
                  id="assessmentName"
                  value={assessmentName}
                  onChange={(e) => setAssessmentName(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            {selectedClass && (
              <div className="mt-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Feedback
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {grades.map((grade) => (
                      <tr key={grade.student}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {grade.studentName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={grade.score}
                            onChange={(e) => handleGradeChange(grade.student, e.target.value)}
                            min="0"
                            max={maxScore}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={grade.feedback || ''}
                            onChange={(e) => handleFeedbackChange(grade.student, e.target.value)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {error && (
              <div className="mt-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading || !selectedClass || grades.length === 0}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Grades'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GradeManagement; 