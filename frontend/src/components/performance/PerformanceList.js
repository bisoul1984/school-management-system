import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import {
  AcademicCapIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

const PerformanceList = () => {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [performance, setPerformance] = useState([]);
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

  const fetchPerformance = async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);
      const response = await api.get(`/classes/${selectedClass}/performance`);
      setPerformance(response.data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchPerformance();
    }
  }, [selectedClass]);

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
        <p className="mt-2 text-gray-600">Track and analyze student performance</p>
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

      {performance.length > 0 ? (
        <div className="space-y-6">
          {/* Class Overview */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Class Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center">
                  <ChartBarIcon className="h-6 w-6 text-indigo-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Average Score</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-indigo-600">
                  {Math.round(performance.reduce((acc, p) => acc + p.averageScore, 0) / performance.length)}%
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Highest Score</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-green-600">
                  {Math.max(...performance.map(p => p.averageScore))}%
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <UserGroupIcon className="h-6 w-6 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Total Students</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-blue-600">
                  {performance.length}
                </p>
              </div>
            </div>
          </div>

          {/* Individual Performance */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {performance.map((record) => (
                <li key={record.student._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AcademicCapIcon className="h-6 w-6 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {record.student.firstName} {record.student.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Assignments Completed: {record.completedAssignments}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(record.averageScore)}`}>
                        Average: {record.averageScore}%
                      </span>
                      <span className="text-sm text-gray-500">
                        Attendance: {record.attendanceRate}%
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        selectedClass && (
          <div className="text-center py-12 bg-white rounded-lg">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No performance data found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No performance data has been recorded for this class yet.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default PerformanceList; 