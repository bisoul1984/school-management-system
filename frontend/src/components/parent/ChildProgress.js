import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../services/api';

const ChildProgress = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get(`/parents/${user.id}/child-progress`);
        setProgress(response.data);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user.id]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Child's Progress</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Academic Performance</h2>
          {/* Add academic performance content */}
        </div>

        {/* Attendance Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Attendance Summary</h2>
          {/* Add attendance summary content */}
        </div>

        {/* Recent Grades */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Grades</h2>
          {/* Add recent grades content */}
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Assignments</h2>
          {/* Add upcoming assignments content */}
        </div>
      </div>
    </div>
  );
};

export default ChildProgress; 