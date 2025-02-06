import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import {
  CalendarIcon,
  DocumentTextIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

const AssignmentsList = ({ classId }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    points: 0,
  });
  const { user } = useSelector((state) => state.auth);
  const isTeacherOrAdmin = ['teacher', 'admin'].includes(user.role);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get(`/classes/${classId}/assignments`);
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [classId]);

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/classes/${classId}/assignments`, newAssignment);
      setAssignments([...assignments, response.data]);
      setShowAddModal(false);
      setNewAssignment({
        title: '',
        description: '',
        dueDate: '',
        points: 0,
      });
    } catch (error) {
      console.error('Error adding assignment:', error);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await api.delete(`/classes/${classId}/assignments/${assignmentId}`);
        setAssignments(assignments.filter(a => a._id !== assignmentId));
      } catch (error) {
        console.error('Error deleting assignment:', error);
      }
    }
  };

  const getStatusColor = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    if (due < now) return 'text-red-600 bg-red-50';
    if (due - now < 24 * 60 * 60 * 1000) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {isTeacherOrAdmin && (
        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Assignment
          </button>
        </div>
      )}

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div
            key={assignment._id}
            className="bg-white shadow rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{assignment.title}</h3>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.dueDate)}`}>
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
                {isTeacherOrAdmin && (
                  <button
                    onClick={() => handleDeleteAssignment(assignment._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            <p className="mt-2 text-gray-600">{assignment.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-1" />
                Points: {assignment.points}
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-1" />
                Submissions: {assignment.submissions?.length || 0}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Assignment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Assignment</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddAssignment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    required
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="datetime-local"
                    required
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Points</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newAssignment.points}
                    onChange={(e) => setNewAssignment({ ...newAssignment, points: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Add Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsList; 