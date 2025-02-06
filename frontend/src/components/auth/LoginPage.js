import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../../store/slices/authSlice';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  UserIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../services/api';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState(location.state?.selectedRole || '');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userTypes = [
    {
      role: 'student',
      title: 'Student',
      icon: UserGroupIcon,
      color: 'indigo'
    },
    {
      role: 'teacher',
      title: 'Teacher',
      icon: AcademicCapIcon,
      color: 'emerald'
    },
    {
      role: 'parent',
      title: 'Parent',
      icon: UserIcon,
      color: 'blue'
    },
    {
      role: 'admin',
      title: 'Admin',
      icon: ShieldCheckIcon,
      color: 'red'
    }
  ];

  useEffect(() => {
    if (location.state?.selectedRole) {
      setSelectedRole(location.state.selectedRole);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select a user type');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const loginData = {
        ...formData,
        role: selectedRole
      };

      const response = await api.post('/auth/login', loginData);
      const { token, user } = response.data;

      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update Redux state
      dispatch(login({ token, user }));

      // Set auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Navigate to dashboard
      navigate('/dashboard', { replace: true });

    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {userTypes.map((type) => (
              <button
                key={type.role}
                type="button"
                onClick={() => setSelectedRole(type.role)}
                className={`${
                  selectedRole === type.role
                    ? `bg-${type.color}-100 border-${type.color}-500`
                    : 'bg-white border-gray-300'
                } flex items-center justify-center p-4 border-2 rounded-lg hover:bg-${
                  type.color
                }-50 transition-colors duration-200`}
              >
                <type.icon className={`h-6 w-6 text-${type.color}-600 mr-2`} />
                <span className={`text-${type.color}-600 font-medium`}>
                  {type.title}
                </span>
              </button>
            ))}
          </div>

          {selectedRole && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isLoading ? <LoadingSpinner size="sm" /> : 'Sign in'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate(`/${selectedRole}/register`)}
                className="text-indigo-600 hover:text-indigo-500"
              >
                Register now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 