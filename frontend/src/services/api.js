import axios from 'axios';
import config from '../config';

/**
 * API Service Configuration
 * 
 * Centralized API service for making HTTP requests to the backend server.
 * Provides interceptors for authentication, error handling, and request/response logging.
 * 
 * Features:
 * - Automatic token management
 * - Request/response interceptors
 * - Error handling and logging
 * - Authentication header management
 * - CORS support
 * - Connection error handling
 * 
 * @module apiService
 */

// Enhanced debugging
console.log('API Service Configuration:', {
  baseURL: config.API_URL,
  currentOrigin: window.location.origin,
  isVercel: window.location.hostname.includes('vercel.app')
});

/**
 * Axios instance configured for the school management system API
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

/**
 * Response interceptor for handling connection errors
 * Provides detailed error logging and user-friendly error messages
 */
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_CONNECTION_REFUSED') {
      console.error('Connection refused. Are you trying to connect to:', config.API_URL);
      return Promise.reject('Backend server is not accessible. Please try again later.');
    }
    return Promise.reject(error);
  }
);

/**
 * Request interceptor for authentication and logging
 * Automatically adds authentication headers and logs request details
 * 
 * @param {import('axios').AxiosRequestConfig} config - Axios request configuration
 * @returns {import('axios').AxiosRequestConfig} Modified request configuration
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add detailed request logging
    console.log('Making API Request:', {
      baseURL: config.baseURL,
      url: config.url,
      fullURL: config.baseURL + config.url,
      method: config.method,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for authentication and error handling
 * Handles 401 unauthorized responses and automatically logs out users
 * 
 * @param {import('axios').AxiosResponse} response - Axios response
 * @returns {import('axios').AxiosResponse} Response object
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Remove auth header
      delete api.defaults.headers.common['Authorization'];
      
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data?.message || 'An error occurred');
  }
);

/**
 * Class-related API endpoints
 * Provides methods for managing classes, assignments, and student enrollments
 * 
 * @type {Object}
 * @property {Function} getClassDetails - Get detailed information about a class
 * @property {Function} getClassAssignments - Get assignments for a specific class
 * @property {Function} createAssignment - Create a new assignment for a class
 * @property {Function} deleteAssignment - Delete an assignment from a class
 * @property {Function} addStudentToClass - Add a student to a class
 * @property {Function} removeStudentFromClass - Remove a student from a class
 * @property {Function} getAvailableStudents - Get list of students not enrolled in any class
 */
const apiClass = {
  /**
   * Get detailed information about a specific class
   * @param {string} classId - The ID of the class
   * @returns {Promise<Object>} Class details
   */
  getClassDetails: (classId) => api.get(`/classes/${classId}`),
  
  /**
   * Get all assignments for a specific class
   * @param {string} classId - The ID of the class
   * @returns {Promise<Array>} List of assignments
   */
  getClassAssignments: (classId) => api.get(`/classes/${classId}/assignments`),
  
  /**
   * Create a new assignment for a class
   * @param {string} classId - The ID of the class
   * @param {Object} data - Assignment data
   * @param {string} data.title - Assignment title
   * @param {string} data.description - Assignment description
   * @param {Date} data.dueDate - Assignment due date
   * @param {number} data.maxScore - Maximum score for the assignment
   * @returns {Promise<Object>} Created assignment
   */
  createAssignment: (classId, data) => api.post(`/classes/${classId}/assignments`, data),
  
  /**
   * Delete an assignment from a class
   * @param {string} classId - The ID of the class
   * @param {string} assignmentId - The ID of the assignment
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteAssignment: (classId, assignmentId) => api.delete(`/classes/${classId}/assignments/${assignmentId}`),
  
  /**
   * Add a student to a class
   * @param {string} classId - The ID of the class
   * @param {string} studentId - The ID of the student
   * @returns {Promise<Object>} Enrollment confirmation
   */
  addStudentToClass: (classId, studentId) => api.post(`/classes/${classId}/students`, { studentId }),
  
  /**
   * Remove a student from a class
   * @param {string} classId - The ID of the class
   * @param {string} studentId - The ID of the student
   * @returns {Promise<Object>} Removal confirmation
   */
  removeStudentFromClass: (classId, studentId) => api.delete(`/classes/${classId}/students/${studentId}`),
  
  /**
   * Get list of students not enrolled in any class
   * @returns {Promise<Array>} List of available students
   */
  getAvailableStudents: () => api.get('/students/available'),
};

export { api as default, apiClass };