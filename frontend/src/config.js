const config = {
  // If accessing from deployed frontend URL, use deployed backend URL
  API_URL: window.location.hostname.includes('localhost')
    ? 'http://localhost:8081/api' // Local development
    : 'https://school-management-system-production-9f34.up.railway.app/api'  // Railway backend URL
};

// Add debugging
console.log('Environment Configuration:', {
  hostname: window.location.hostname,
  isLocalhost: window.location.hostname.includes('localhost'),
  apiUrl: config.API_URL,
  nodeEnv: process.env.NODE_ENV
});

export default config;