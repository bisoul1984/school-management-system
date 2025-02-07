const config = {
  // If accessing from deployed frontend URL, use deployed backend URL
  API_URL: window.location.hostname.includes('vercel.app')
    ? 'https://school-management-system-zuu2.vercel.app/api'  // Deployed backend
    : process.env.REACT_APP_API_URL || 'http://localhost:8081/api' // Local backend
};

console.log('Current configuration:', {
  hostname: window.location.hostname,
  apiUrl: config.API_URL
});

export default config;