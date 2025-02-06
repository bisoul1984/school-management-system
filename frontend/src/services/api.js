import axios from 'axios';

// Add more detailed debugging
console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL
});

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  console.error('API_URL is not set! Using fallback URL');
}

console.log('Final API_URL:', API_URL || 'http://localhost:8081/api');

const api = axios.create({
  baseURL: API_URL || 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor with more detailed logging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('Request Config:', {
      url: config.baseURL + config.url,
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