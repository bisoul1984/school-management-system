import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../services/api';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get(`/students/${user.id}/assignments`);
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [user.id]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Assignments</h1>
      <div className="grid gap-6">
        {assignments.map((assignment) => (
          <div
            key={assignment._id}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {assignment.title}
                </h2>
                <p className="text-gray-600 mt-1">{assignment.subject}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                assignment.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {assignment.status}
              </span>
            </div>
            <p className="mt-4 text-gray-700">{assignment.description}</p>
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
              <span>Points: {assignment.points}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentAssignments; 