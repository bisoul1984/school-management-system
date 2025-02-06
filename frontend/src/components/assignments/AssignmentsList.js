import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import {
  DocumentTextIcon,
  CalendarIcon,
  PlusIcon,
  TrashIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

const AssignmentsList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    points: 0
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

  const fetchAssignments = async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);
      const response = await api.get(`/classes/${selectedClass}/assignments`);
      setAssignments(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setError('Failed to load assignments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      fetchAssignments();
    }
  }, [selectedClass]);

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/classes/${selectedClass}/assignments`, newAssignment);
      setShowAddModal(false);
      setNewAssignment({ title: '', description: '', dueDate: '', points: 0 });
      fetchAssignments();
    } catch (error) {
      console.error('Error adding assignment:', error);
      setError('Failed to add assignment. Please try again.');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await api.delete(`/classes/${selectedClass}/assignments/${assignmentId}`);
      fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      setError('Failed to delete assignment. Please try again.');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => selectedClass ? fetchAssignments() : fetchClasses()}
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
        <h1 className="text-2xl font-bold text-gray-900">Assignment Management</h1>
        <p className="mt-2 text-gray-600">Create and manage class assignments</p>
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
          Add Assignment
        </button>
      )}

      {assignments.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {assignments.map((assignment) => (
              <li key={assignment._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-6 w-6 text-gray-400 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{assignment.title}</h3>
                      <p className="text-sm text-gray-500">{assignment.description}</p>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          Points: {assignment.points}
                        </div>
                      </div>
                    </div>
                  </div>
                  {isTeacherOrAdmin && (
                    <button
                      onClick={() => handleDeleteAssignment(assignment._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        selectedClass && (
          <div className="text-center py-12 bg-white rounded-lg">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new assignment.
            </p>
          </div>
        )
      )}

      {/* Add Assignment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Assignment</h3>
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