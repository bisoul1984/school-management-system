const config = {
  // If accessing from deployed frontend URL, use deployed backend URL
  API_URL: window.location.hostname.includes('vercel.app')
    ? 'https://school-management-system-backend-zuu2.vercel.app/api'  // Your deployed backend URL
    : 'http://localhost:8081/api' // Local development
};

// Add debugging
console.log('Environment Configuration:', {
  hostname: window.location.hostname,
  isVercel: window.location.hostname.includes('vercel.app'),
  apiUrl: config.API_URL,
  nodeEnv: process.env.NODE_ENV
});

export default config;