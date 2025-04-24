import axios from 'axios';

// Create base axios instance
const apiClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for handling common request tasks
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    // config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common response tasks
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors and show appropriate user feedback
    if (!error.response) {
      console.error('Network Error: Could not connect to the server');
      // You could dispatch to a notification system here
    } else {
      // Log API errors
      console.error(
        'API Error:',
        error.response.status,
        error.response.data?.message || error.message
      );
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;