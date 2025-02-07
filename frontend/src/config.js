const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://school-management-system-zuu2.vercel.app/api'  // Update this to match your backend Vercel URL
    : process.env.REACT_APP_API_URL || 'http://localhost:8081/api' // Development backend URL
};

export default config;