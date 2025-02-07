const config = {
  // Use the environment variable, fallback to localhost for development
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8081/api'
};

export default config;