import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../services/api';

const StudentSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await api.get(`/students/${user.id}/schedule`);
        setSchedule(response.data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [user.id]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Schedule</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-6 gap-4 p-4">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
            <div key={day} className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">{day}</h2>
              {schedule
                .filter((class_) => class_.day === day)
                .map((class_) => (
                  <div
                    key={class_._id}
                    className="p-3 bg-indigo-50 rounded-lg"
                  >
                    <p className="font-medium text-indigo-900">{class_.subject}</p>
                    <p className="text-sm text-indigo-700">{class_.time}</p>
                    <p className="text-sm text-indigo-600">{class_.room}</p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentSchedule; 