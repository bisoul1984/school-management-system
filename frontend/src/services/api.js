import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
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
  getClassDetails: (classId) => axios.get(`/api/classes/${classId}`),
  getClassAssignments: (classId) => axios.get(`/api/classes/${classId}/assignments`),
  createAssignment: (classId, data) => axios.post(`/api/classes/${classId}/assignments`, data),
  deleteAssignment: (classId, assignmentId) => axios.delete(`/api/classes/${classId}/assignments/${assignmentId}`),
  addStudentToClass: (classId, studentId) => axios.post(`/api/classes/${classId}/students`, { studentId }),
  removeStudentFromClass: (classId, studentId) => axios.delete(`/api/classes/${classId}/students/${studentId}`),
  getAvailableStudents: () => axios.get('/api/students/available'),
};

export default api; 