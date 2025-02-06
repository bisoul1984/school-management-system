import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import {
  ClockIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

const ScheduleList = () => {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const isTeacherOrAdmin = ['teacher', 'admin'].includes(user.role);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await api.get('/classes');
      // Sort classes by day and time, handling missing schedule data
      const sortedClasses = response.data
        .filter(cls => cls.schedule && cls.schedule.day && cls.schedule.time) // Filter out classes with missing schedule
        .sort((a, b) => {
          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
          const dayA = days.indexOf(a.schedule.day);
          const dayB = days.indexOf(b.schedule.day);
          
          // Handle invalid days
          if (dayA === -1 || dayB === -1) return 0;
          
          const dayDiff = dayA - dayB;
          if (dayDiff !== 0) return dayDiff;
          
          // Handle time comparison safely
          const timeA = a.schedule.time || '';
          const timeB = b.schedule.time || '';
          return timeA.localeCompare(timeB);
        });
      
      setClasses(sortedClasses);
      setError(null);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setError('Failed to load schedule. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getDayColor = (day) => {
    const colors = {
      Monday: 'bg-blue-50 text-blue-700',
      Tuesday: 'bg-purple-50 text-purple-700',
      Wednesday: 'bg-green-50 text-green-700',
      Thursday: 'bg-yellow-50 text-yellow-700',
      Friday: 'bg-red-50 text-red-700'
    };
    return colors[day] || 'bg-gray-50 text-gray-700';
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchSchedule}
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
        <h1 className="text-2xl font-bold text-gray-900">Class Schedule</h1>
        <p className="mt-2 text-gray-600">View and manage class schedules</p>
      </div>

      <div className="grid gap-6">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
          <div key={day} className="bg-white rounded-lg shadow overflow-hidden">
            <div className={`px-4 py-3 ${getDayColor(day)}`}>
              <h2 className="text-lg font-medium">{day}</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {classes
                .filter((cls) => cls.schedule?.day === day)
                .map((cls) => (
                  <div key={cls._id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <AcademicCapIcon className="h-6 w-6 text-gray-400" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{cls.name}</h3>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {cls.schedule?.time || 'No time set'}
                            </div>
                            <div className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              Room {cls.room || 'TBD'}
                            </div>
                            <div className="flex items-center">
                              <UserGroupIcon className="h-4 w-4 mr-1" />
                              {cls.students?.length || 0} Students
                            </div>
                          </div>
                        </div>
                      </div>
                      {cls.teacher && (
                        <div className="text-sm text-gray-500">
                          Teacher: {cls.teacher.firstName} {cls.teacher.lastName}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              {classes.filter((cls) => cls.schedule?.day === day).length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No classes scheduled
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleList; 