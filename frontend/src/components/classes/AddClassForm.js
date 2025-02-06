import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { addClass } from '../../store/slices/classSlice';
import { fetchTeachers } from '../../store/slices/teacherSlice';

const AddClassForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const { teachers } = useSelector((state) => state.teachers);

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    className: '',
    grade: '',
    section: '',
    teacher: '',
    subject: '',
    capacity: 30,
    academicYear: new Date().getFullYear().toString(),
    schedule: [
      {
        day: 'Monday',
        startTime: '08:00',
        endTime: '09:00'
      }
    ]
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = {
      ...newSchedule[index],
      [field]: value
    };
    setFormData({
      ...formData,
      schedule: newSchedule
    });
  };

  const addScheduleRow = () => {
    setFormData({
      ...formData,
      schedule: [
        ...formData.schedule,
        { day: 'Monday', startTime: '', endTime: '' }
      ]
    });
  };

  const removeScheduleRow = (index) => {
    const newSchedule = formData.schedule.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      schedule: newSchedule
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addClass(formData)).unwrap();
      navigate('/classes');
    } catch (error) {
      setError(error.message || 'Failed to add class');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Class</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700">
              Class Name *
            </label>
            <input
              type="text"
              name="className"
              id="className"
              required
              value={formData.className}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">
              Grade *
            </label>
            <input
              type="text"
              name="grade"
              id="grade"
              required
              value={formData.grade}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="section" className="block text-sm font-medium text-gray-700">
              Section *
            </label>
            <input
              type="text"
              name="section"
              id="section"
              required
              value={formData.section}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="teacher" className="block text-sm font-medium text-gray-700">
              Teacher *
            </label>
            <select
              name="teacher"
              id="teacher"
              required
              value={formData.teacher}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.firstName} {teacher.lastName} - {teacher.subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              id="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
              Capacity *
            </label>
            <input
              type="number"
              name="capacity"
              id="capacity"
              required
              min="1"
              value={formData.capacity}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700">
              Academic Year *
            </label>
            <input
              type="text"
              name="academicYear"
              id="academicYear"
              required
              value={formData.academicYear}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Schedule Section */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Class Schedule</h3>
            <button
              type="button"
              onClick={addScheduleRow}
              className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-900"
            >
              + Add Time Slot
            </button>
          </div>
          
          {formData.schedule.map((slot, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <select
                  value={slot.day}
                  onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>
              <div>
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeScheduleRow(index)}
                    className="mt-1 text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/classes')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Class
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddClassForm; 