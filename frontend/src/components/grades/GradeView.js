import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentGrades } from '../../store/slices/gradeSlice';

const GradeView = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { grades, loading, error } = useSelector((state) => state.grade);
  const [selectedSubject, setSelectedSubject] = useState('all');

  const subjects = [...new Set(grades.map(grade => grade.subject))];
  
  const calculateGradeStats = (gradesList) => {
    const filteredGrades = selectedSubject === 'all' 
      ? gradesList 
      : gradesList.filter(g => g.subject === selectedSubject);

    const stats = filteredGrades.reduce((acc, grade) => {
      const percentage = (grade.score / grade.maxScore) * 100;
      acc.total += percentage;
      acc.count += 1;
      acc.byType[grade.assessmentType] = acc.byType[grade.assessmentType] || [];
      acc.byType[grade.assessmentType].push(percentage);
      return acc;
    }, { total: 0, count: 0, byType: {} });

    return {
      average: stats.count ? (stats.total / stats.count).toFixed(1) : 0,
      byType: Object.entries(stats.byType).map(([type, scores]) => ({
        type,
        average: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
        count: scores.length
      }))
    };
  };

  const stats = calculateGradeStats(grades);

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:flex md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Grade Report</h3>
          <p className="mt-1 text-sm text-gray-500">
            View your academic performance and grades.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Overall Average
            </dt>
            <dd className={`mt-1 text-3xl font-semibold ${getGradeColor(stats.average)}`}>
              {stats.average}%
            </dd>
          </div>
        </div>
        {stats.byType.map(({ type, average, count }) => (
          <div key={type} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                {type.charAt(0).toUpperCase() + type.slice(1)} Average
              </dt>
              <dd className={`mt-1 text-3xl font-semibold ${getGradeColor(average)}`}>
                {average}%
              </dd>
              <p className="mt-1 text-sm text-gray-500">
                {count} assessment{count !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assessment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Feedback
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {grades
                      .filter(grade => selectedSubject === 'all' || grade.subject === selectedSubject)
                      .map((grade) => {
                        const percentage = ((grade.score / grade.maxScore) * 100).toFixed(1);
                        return (
                          <tr key={grade._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {grade.subject}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {grade.assessmentName}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {grade.assessmentType.charAt(0).toUpperCase() + grade.assessmentType.slice(1)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {grade.score} / {grade.maxScore}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getGradeColor(percentage)}`}>
                                {percentage}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {grade.feedback || '-'}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeView; 