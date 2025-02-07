const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://school-management-system-94li-4whx4c7zq.vercel.app/api'  // Your Vercel frontend URL
    : process.env.REACT_APP_API_URL || 'http://localhost:8081/api' // Development backend URL
};

export default config;