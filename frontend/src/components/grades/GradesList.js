import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import {
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

const GradesList = () => {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [grades, setGrades] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const isTeacherOrAdmin = ['teacher', 'admin'].includes(user.role);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setLoading(false);
    }
  };

  const fetchGrades = async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);
      const response = await api.get(`/classes/${selectedClass}/grades`);
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchGrades();
    }
  }, [selectedClass]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Grade Management</h1>
        <p className="mt-2 text-gray-600">View and manage student grades</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Select Class</label>
        <select
          value={selectedClass || ''}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select a class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      {grades.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {grades.map((grade) => (
              <li key={grade._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AcademicCapIcon className="h-6 w-6 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {grade.student.firstName} {grade.student.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{grade.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500">
                      <ChartBarIcon className="h-5 w-5 inline mr-1" />
                      Score: {grade.score}
                    </div>
                    <div className="text-sm text-gray-500">
                      <ClockIcon className="h-5 w-5 inline mr-1" />
                      {new Date(grade.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        selectedClass && (
          <div className="text-center py-12 bg-white rounded-lg">
            <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No grades found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No grades have been recorded for this class yet.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default GradesList; 