const config = {
  API_URL: window.location.hostname === 'localhost'
    ? 'http://localhost:8081/api'
    : 'https://school-management-system-zuu2.vercel.app/api'
};

export default config;