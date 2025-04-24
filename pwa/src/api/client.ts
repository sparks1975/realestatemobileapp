import axios from 'axios';

// Base axios instance
const apiClient = axios.create({
  baseURL: '/',  // Using relative path for easier deployment
  timeout: 30000,  // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Track network status
let isOffline = false;

// Add request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Check if browser is online
    if (!navigator.onLine) {
      isOffline = true;
      throw new Error('You are currently offline. Please check your internet connection.');
    }
    
    isOffline = false;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (isOffline || !navigator.onLine) {
      // Handle offline errors differently
      console.error('Network error while offline:', error);
      return Promise.reject(new Error('You are currently offline. Please check your internet connection.'));
    }
    
    // Handle API errors
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error('API error:', error.response.status, error.response.data);
      
      // Handle 401 Unauthorized (expired session, etc.)
      if (error.response.status === 401) {
        console.log('Session expired, redirecting to login...');
        // We could redirect to login here if needed
      }
      
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request was made but no response was received
      console.error('Network error (no response):', error.request);
      return Promise.reject(new Error('Network error. Please try again.'));
    } else {
      // Something else happened
      console.error('Request error:', error.message);
      return Promise.reject(error);
    }
  }
);

export default apiClient;