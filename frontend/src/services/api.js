import axios from 'axios';
import config from '../config';

// Enhanced debugging
console.log('API Service Configuration:', {
  baseURL: config.API_URL,
  currentOrigin: window.location.origin,
  isVercel: window.location.hostname.includes('vercel.app')
});

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add error handling for connection refused
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

// Request interceptor with more detailed logging
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

// Response interceptor
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

// Class related endpoints
const apiClass = {
  getClassDetails: (classId) => api.get(`/classes/${classId}`),
  getClassAssignments: (classId) => api.get(`/classes/${classId}/assignments`),
  createAssignment: (classId, data) => api.post(`/classes/${classId}/assignments`, data),
  deleteAssignment: (classId, assignmentId) => api.delete(`/classes/${classId}/assignments/${assignmentId}`),
  addStudentToClass: (classId, studentId) => api.post(`/classes/${classId}/students`, { studentId }),
  removeStudentFromClass: (classId, studentId) => api.delete(`/classes/${classId}/students/${studentId}`),
  getAvailableStudents: () => api.get('/students/available'),
};

export { api as default, apiClass };