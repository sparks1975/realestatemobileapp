import axios from 'axios';
import Constants from 'expo-constants';

// Set the base URL for API requests
// In development, use the IP address of your machine running the Express server
// For Expo Go app, you'll need to use your machine's IP instead of localhost
// Example: const BASE_URL = 'http://192.168.1.100:5000';
const BASE_URL = 'http://localhost:5000';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding authorization headers, etc.
apiClient.interceptors.request.use(
  (config) => {
    // You could add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle error responses
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);

      // Handle specific error codes
      if (error.response.status === 401) {
        // Unauthorized - handle auth failures
        console.log('Authentication required');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;