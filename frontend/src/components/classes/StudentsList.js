import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

const StudentsList = ({ classId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user.role === 'admin';
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getClassDetails(classId);
        setStudents(response.data.students || []);
      } catch (error) {
        setError('Error loading students');
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classId]);

  const fetchAvailableStudents = async () => {
    try {
      const response = await api.get('/students/available');
      setAvailableStudents(response.data);
    } catch (error) {
      console.error('Error fetching available students:', error);
    }
  };

  const handleAddStudent = async () => {
    try {
      await api.post(`/classes/${classId}/students`, {
        studentId: selectedStudent
      });
      // Refresh student list
      const response = await api.get(`/classes/${classId}`);
      setStudents(response.data.students || []);
      setShowAddModal(false);
      setSelectedStudent('');
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to remove this student from the class?')) {
      try {
        await api.delete(`/classes/${classId}/students/${studentId}`);
        setStudents(students.filter(student => student._id !== studentId));
      } catch (error) {
        console.error('Error removing student:', error);
      }
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-600 py-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      {isAdmin && (
        <div className="mb-6">
          <button
            onClick={() => {
              fetchAvailableStudents();
              setShowAddModal(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Student
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {students.map((student) => (
          <div
            key={student._id}
            className="relative bg-white px-6 py-5 shadow rounded-lg flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2"
          >
            <div className="flex-shrink-0">
              <UserIcon className="h-10 w-10 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="focus:outline-none">
                <p className="text-sm font-medium text-gray-900">
                  {student.firstName} {student.lastName}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <EnvelopeIcon className="h-4 w-4 mr-1" />
                  {student.email}
                </div>
                {student.phone && (
                  <div className="flex items-center text-sm text-gray-500">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    {student.phone}
                  </div>
                )}
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={() => handleRemoveStudent(student._id)}
                className="text-red-500 hover:text-red-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Student to Class</h3>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select a student</option>
              {availableStudents.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStudent}
                disabled={!selectedStudent}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList; 