import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../services/api';

const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await api.get(`/students/${user.id}/grades`);
        setGrades(response.data);
      } catch (error) {
        console.error('Error fetching grades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [user.id]);

  const filteredGrades = selectedSubject === 'all' 
    ? grades 
    : grades.filter(grade => grade.subject === selectedSubject);

  const subjects = [...new Set(grades.map(grade => grade.subject))];
  const averageGrade = grades.reduce((acc, curr) => acc + curr.score, 0) / grades.length;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Grades</h1>
        <p className="mt-2 text-gray-600">Overall Average: {averageGrade.toFixed(2)}%</p>
      </div>

      <div className="mb-6">
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="all">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredGrades.map((grade) => (
              <tr key={grade._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {grade.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {grade.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    grade.score >= 90 ? 'bg-green-100 text-green-800' :
                    grade.score >= 80 ? 'bg-blue-100 text-blue-800' :
                    grade.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {grade.score}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(grade.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentGrades; 