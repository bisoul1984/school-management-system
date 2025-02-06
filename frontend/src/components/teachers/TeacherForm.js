import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTeacher, updateTeacher, fetchTeachers } from '../../store/slices/teacherSlice';
import { fetchClasses } from '../../store/slices/classSlice';
import FormInput from '../common/FormInput';
import LoadingSpinner from '../common/LoadingSpinner';
import { PhoneIcon, CurrencyDollarIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

function TeacherForm({ teacher = null, onClose }) {
  const dispatch = useDispatch();
  const { actionLoading, actionError } = useSelector((state) => state.teachers);
  const { classes } = useSelector((state) => state.classes);
  
  const initialFormData = useMemo(() => ({
    firstName: teacher?.firstName || '',
    lastName: teacher?.lastName || '',
    email: teacher?.email || '',
    password: '',
    phone: teacher?.phone || '',
    address: teacher?.address || '',
    subject: teacher?.subject || '',
    qualification: teacher?.qualification || '',
    assignedClasses: teacher?.assignedClasses || [],
    salary: teacher?.salary || '',
    salaryHistory: teacher?.salaryHistory || []
  }), [teacher]);

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchClasses());
    if (teacher) {
      setFormData({
        ...teacher,
        assignedClasses: teacher.assignedClasses || [],
        salaryHistory: teacher.salaryHistory || []
      });
    }
  }, [dispatch, teacher]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [formErrors]);

  const handleClassAssignment = (classId) => {
    setFormData(prev => ({
      ...prev,
      assignedClasses: prev.assignedClasses.includes(classId)
        ? prev.assignedClasses.filter(id => id !== classId)
        : [...prev.assignedClasses, classId]
    }));
  };

  const handleSalaryUpdate = () => {
    const newSalary = prompt('Enter new salary amount:');
    if (newSalary && !isNaN(newSalary)) {
      const salaryUpdate = {
        amount: parseFloat(newSalary),
        date: new Date().toISOString(),
        previousAmount: formData.salary
      };
      setFormData(prev => ({
        ...prev,
        salary: parseFloat(newSalary),
        salaryHistory: [...prev.salaryHistory, salaryUpdate]
      }));
    }
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    console.log('Teacher form submitted:', formData);

    // Validation
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.salary) errors.salary = 'Salary is required';
    if (formData.phone && !/^\+?[\d\s-]+$/.test(formData.phone)) {
      errors.phone = 'Invalid phone number format';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (teacher) {
        await dispatch(updateTeacher({ id: teacher._id, data: formData })).unwrap();
      } else {
        await dispatch(addTeacher(formData)).unwrap();
      }
      onClose();
    } catch (error) {
      setFormErrors({
        email: error === 'Email already exists' ? error : null,
        submit: error !== 'Email already exists' ? error : null
      });
    }
  }, [dispatch, formData, teacher, onClose]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formErrors.submit && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{formErrors.submit}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <FormInput
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={formErrors.firstName}
          required
        />

        <FormInput
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={formErrors.lastName}
          required
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={formErrors.email}
          required
        />

        {!teacher && (
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required={!teacher}
          />
        )}

        <FormInput
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={formErrors.phone}
          icon={<PhoneIcon className="h-5 w-5 text-gray-400" />}
        />

        <FormInput
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          error={formErrors.subject}
          required
        />

        <div className="relative">
          <FormInput
            label="Salary"
            name="salary"
            type="number"
            value={formData.salary}
            onChange={handleChange}
            error={formErrors.salary}
            required
            icon={<CurrencyDollarIcon className="h-5 w-5 text-gray-400" />}
          />
        </div>

        <FormInput
          label="Qualification"
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
        />

        <div className="sm:col-span-2">
          <FormInput
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assigned Classes
          </label>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {classes.map((cls) => (
              <label
                key={cls._id}
                className={`flex items-center p-3 rounded-lg border ${
                  formData.assignedClasses.includes(cls._id)
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-indigo-300'
                } cursor-pointer transition-colors duration-150`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.assignedClasses.includes(cls._id)}
                  onChange={() => handleClassAssignment(cls._id)}
                />
                <AcademicCapIcon className={`h-5 w-5 mr-2 ${
                  formData.assignedClasses.includes(cls._id)
                    ? 'text-indigo-500'
                    : 'text-gray-400'
                }`} />
                <span className="text-sm">
                  Grade {cls.grade}-{cls.section}
                </span>
              </label>
            ))}
          </div>
        </div>

        {teacher && formData.salaryHistory.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Salary History</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {formData.salaryHistory.map((record, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{new Date(record.date).toLocaleDateString()}</span>
                  <div>
                    <span className="text-red-500">${record.previousAmount}</span>
                    <span className="mx-2">→</span>
                    <span className="text-green-500">${record.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
          className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {actionLoading ? <LoadingSpinner size="sm" /> : teacher ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
}

TeacherForm.displayName = 'TeacherForm';

export default React.memo(TeacherForm); 