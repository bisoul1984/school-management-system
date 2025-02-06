import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import {
  CalendarIcon,
  UserGroupIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';

const AttendanceList = () => {
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { user } = useSelector((state) => state.auth);

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

  const fetchAttendance = async () => {
    if (!selectedClass) return;
    try {
      setLoading(true);
      const response = await api.get(`/attendance/${selectedClass}/${date}`);
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (studentId, status) => {
    try {
      await api.post('/attendance', {
        classId: selectedClass,
        studentId,
        date,
        status
      });
      await fetchAttendance();
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
        <p className="mt-2 text-gray-600">Mark and view student attendance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <button
        onClick={fetchAttendance}
        disabled={!selectedClass}
        className="mb-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300"
      >
        <CalendarIcon className="h-5 w-5 mr-2" />
        View Attendance
      </button>

      {attendance.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {attendance.map((record) => (
              <li key={record.student._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-6 w-6 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {record.student.firstName} {record.student.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{record.student.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => markAttendance(record.student._id, 'present')}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        record.status === 'present'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <CheckIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => markAttendance(record.student._id, 'absent')}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        record.status === 'absent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AttendanceList; 