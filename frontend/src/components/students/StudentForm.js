import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addStudent, updateStudent, fetchStudents } from '../../store/slices/studentSlice';
import { fetchClasses } from '../../store/slices/classSlice';
import FormInput from '../common/FormInput';
import LoadingSpinner from '../common/LoadingSpinner';

const StudentFormComponent = ({ student = null, onClose }) => {
  const dispatch = useDispatch();
  const { actionLoading, actionError } = useSelector((state) => state.students);
  const { classes } = useSelector((state) => state.classes);

  const initialFormData = useMemo(() => ({
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    email: student?.email || '',
    password: '',
    class: student?.class?._id || '',
    dateOfBirth: student?.dateOfBirth?.split('T')[0] || '',
    address: student?.address || '',
    phone: student?.phone || '',
    rollNumber: student?.rollNumber || ''
  }), [student]);

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  // Fetch classes only once when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!classes?.length) {
        await dispatch(fetchClasses());
      }
    };
    fetchData();
  }, [dispatch, classes?.length]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name.startsWith('fees.')) {
      const feesField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        fees: {
          ...prev.fees,
          [feesField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [formErrors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);

    // Form validation
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.class) errors.class = 'Class is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (student) {
        await dispatch(updateStudent({ id: student._id, data: formData })).unwrap();
      } else {
        await dispatch(addStudent(formData)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      setFormErrors({
        email: error === 'Email already exists' ? error : null,
        submit: error !== 'Email already exists' ? error : null
      });
    }
  }, [dispatch, formData, student, onClose]);

  // Memoize the form JSX
  const formContent = useMemo(() => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formErrors.submit && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">
            {formErrors.submit}
          </div>
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

        {!student && (
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required={!student}
          />
        )}

        <FormInput
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
        />

        <FormInput
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <div className="sm:col-span-2">
          <FormInput
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={formErrors.address}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Class
          </label>
          <select
            name="class"
            value={formData.class}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a class</option>
            {classes?.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.grade} - {cls.section}
              </option>
            ))}
          </select>
        </div>

        <FormInput
          label="Roll Number"
          name="rollNumber"
          value={formData.rollNumber}
          onChange={handleChange}
        />
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
          {actionLoading ? <LoadingSpinner size="sm" /> : student ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  ), [handleSubmit, formData, actionLoading, classes, formErrors]);

  return formContent;
};

const StudentForm = React.memo(StudentFormComponent, (prevProps, nextProps) => {
  // Custom comparison function
  return prevProps.student?._id === nextProps.student?._id;
});

StudentForm.displayName = 'StudentForm';

export default StudentForm; 