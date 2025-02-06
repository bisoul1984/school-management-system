import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import {
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

const ProgressReportsList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newReport, setNewReport] = useState({
    academicProgress: '',
    behavioralNotes: '',
    recommendations: '',
    period: new Date().toISOString().split('T')[0]
  });
  const { user } = useSelector((state) => state.auth);
  const isTeacherOrAdmin = ['teacher', 'admin'].includes(user.role);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to load classes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);
      const response = await api.get(`/classes/${selectedClass}`);
      setStudents(response.data.students || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  const handleAddReport = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/progress-reports`, {
        ...newReport,
        student: selectedStudent,
        class: selectedClass
      });
      setShowAddModal(false);
      setNewReport({
        academicProgress: '',
        behavioralNotes: '',
        recommendations: '',
        period: new Date().toISOString().split('T')[0]
      });
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error adding progress report:', error);
      setError('Failed to add progress report. Please try again.');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => selectedClass ? fetchStudents() : fetchClasses()}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Progress Reports</h1>
        <p className="mt-2 text-gray-600">Create and manage student progress reports</p>
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

      {selectedClass && isTeacherOrAdmin && (
        <button
          onClick={() => setShowAddModal(true)}
          className="mb-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Progress Report
        </button>
      )}

      {students.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {students.map((student) => (
              <li key={student._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-6 w-6 text-gray-400 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStudent(student._id);
                      setShowAddModal(true);
                    }}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Add Report
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        selectedClass && (
          <div className="text-center py-12 bg-white rounded-lg">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add students to this class to create progress reports.
            </p>
          </div>
        )
      )}

      {/* Add Progress Report Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Progress Report</h3>
            <form onSubmit={handleAddReport}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Academic Progress</label>
                  <textarea
                    required
                    value={newReport.academicProgress}
                    onChange={(e) => setNewReport({ ...newReport, academicProgress: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Behavioral Notes</label>
                  <textarea
                    value={newReport.behavioralNotes}
                    onChange={(e) => setNewReport({ ...newReport, behavioralNotes: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Recommendations</label>
                  <textarea
                    value={newReport.recommendations}
                    onChange={(e) => setNewReport({ ...newReport, recommendations: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Period</label>
                  <input
                    type="date"
                    required
                    value={newReport.period}
                    onChange={(e) => setNewReport({ ...newReport, period: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedStudent(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Add Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressReportsList; 