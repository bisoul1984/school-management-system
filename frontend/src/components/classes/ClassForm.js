import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addClass, updateClass } from '../../store/slices/classSlice';
import { fetchTeachers } from '../../store/slices/teacherSlice';
import FormInput from '../common/FormInput';
import LoadingSpinner from '../common/LoadingSpinner';
import { HomeIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const ClassForm = ({ classData, onClose }) => {
  const dispatch = useDispatch();
  const { actionLoading, actionError } = useSelector((state) => state.classes);
  const { teachers } = useSelector((state) => state.teachers);

  const [formData, setFormData] = useState({
    grade: '',
    section: '',
    roomNumber: '',
    capacity: '',
    teacher: '',
    academicYear: new Date().getFullYear().toString()
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchTeachers());
    if (classData) {
      setFormData({
        ...classData,
        teacher: classData.teacher || ''
      });
    }
  }, [dispatch, classData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.grade) errors.grade = 'Grade is required';
    if (!formData.section) errors.section = 'Section is required';
    if (!formData.roomNumber) errors.roomNumber = 'Room number is required';
    if (!formData.capacity) errors.capacity = 'Capacity is required';
    if (formData.capacity && (isNaN(formData.capacity) || formData.capacity < 1)) {
      errors.capacity = 'Capacity must be a positive number';
    }
    if (!formData.teacher) errors.teacher = 'Teacher assignment is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const payload = {
        ...formData,
        grade: parseInt(formData.grade),
        capacity: parseInt(formData.capacity),
        roomNumber: formData.roomNumber.toString()
      };

      if (classData) {
        await dispatch(updateClass({ id: classData._id, data: payload })).unwrap();
      } else {
        await dispatch(addClass(payload)).unwrap();
      }
      onClose();
    } catch (err) {
      console.error('Class form submission error:', err);
      setFormErrors({ submit: err.message || 'Failed to save class' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formErrors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {formErrors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormInput
          label="Grade"
          name="grade"
          type="number"
          min="1"
          max="12"
          value={formData.grade}
          onChange={handleChange}
          error={formErrors.grade}
          required
        />

        <FormInput
          label="Section"
          name="section"
          value={formData.section}
          onChange={handleChange}
          error={formErrors.section}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="relative">
          <FormInput
            label="Room Number"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            error={formErrors.roomNumber}
            required
            icon={<HomeIcon className="h-5 w-5 text-gray-400" />}
          />
        </div>

        <div className="relative">
          <FormInput
            label="Capacity"
            name="capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            error={formErrors.capacity}
            required
            icon={<UserGroupIcon className="h-5 w-5 text-gray-400" />}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assigned Teacher
        </label>
        <select
          name="teacher"
          value={formData.teacher}
          onChange={handleChange}
          className={`block w-full rounded-md shadow-sm ${
            formErrors.teacher 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
          required
        >
          <option value="">Select a teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.firstName} {teacher.lastName} ({teacher.subject})
            </option>
          ))}
        </select>
        {formErrors.teacher && (
          <p className="mt-1 text-sm text-red-600">{formErrors.teacher}</p>
        )}
      </div>

      <FormInput
        label="Academic Year"
        name="academicYear"
        value={formData.academicYear}
        onChange={handleChange}
        error={formErrors.academicYear}
        required
      />

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={actionLoading}
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
        >
          {actionLoading ? <LoadingSpinner size="sm" /> : classData ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default ClassForm; 