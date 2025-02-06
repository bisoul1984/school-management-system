import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSchedule, getSchedule } from '../../store/slices/classSlice';
import LoadingSpinner from '../common/LoadingSpinner';

const ClassSchedule = ({ classId }) => {
  const dispatch = useDispatch();
  const { actionLoading, actionError } = useSelector((state) => state.classes);
  const [schedule, setSchedule] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = Array.from({ length: 8 }, (_, i) => ({
    startTime: `${String(8 + Math.floor(i)).padStart(2, '0')}:00`,
    endTime: `${String(9 + Math.floor(i)).padStart(2, '0')}:00`
  }));

  useEffect(() => {
    const fetchSchedule = async () => {
      const response = await dispatch(getSchedule(classId));
      if (response.payload?.data) {
        setSchedule(response.payload.data);
      }
    };
    fetchSchedule();
  }, [dispatch, classId]);

  const handlePeriodChange = (dayIndex, periodIndex, field, value) => {
    const newSchedule = [...schedule];
    if (!newSchedule[dayIndex]) {
      newSchedule[dayIndex] = { day: days[dayIndex], periods: [] };
    }
    if (!newSchedule[dayIndex].periods[periodIndex]) {
      newSchedule[dayIndex].periods[periodIndex] = {};
    }
    newSchedule[dayIndex].periods[periodIndex][field] = value;
    setSchedule(newSchedule);
  };

  const handleSave = async () => {
    await dispatch(updateSchedule({ id: classId, schedule }));
    setIsEditing(false);
  };

  if (actionLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mt-4">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Class Schedule</h3>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Edit Schedule
            </button>
          ) : (
            <div className="space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {actionError && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{actionError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                Time
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {timeSlots.map((timeSlot, timeIndex) => (
              <tr key={timeSlot.startTime}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
                  {timeSlot.startTime} - {timeSlot.endTime}
                </td>
                {days.map((day, dayIndex) => {
                  const period = schedule[dayIndex]?.periods[timeIndex];
                  return (
                    <td key={`${day}-${timeIndex}`} className="px-3 py-4 text-sm text-gray-500">
                      {isEditing ? (
                        <select
                          value={period?.subject || ''}
                          onChange={(e) => handlePeriodChange(dayIndex, timeIndex, 'subject', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="">No Class</option>
                          {/* Add your subjects here */}
                          <option value="Mathematics">Mathematics</option>
                          <option value="Science">Science</option>
                          <option value="English">English</option>
                        </select>
                      ) : (
                        period?.subject || '-'
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassSchedule; 