import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Set the base URL for API requests
// When running in Expo Go on a physical device, we need to use the actual
// IP address of the Replit server rather than localhost
const getBaseUrl = () => {
  // Check if we have an environment variable for the API URL
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // Get the Replit app URL if available
  const replitUrl = process.env.REPLIT_URL || '';
  if (replitUrl) {
    return `https://${replitUrl}`;
  }
  
  // Default to localhost for development
  // Note: When testing on a physical device, you'll need to replace this
  // with your computer's local network IP address (e.g., 192.168.1.x)
  // For debugging, you can use the IP address of your machine on your local network
  // The port 5000 is the default Express server port
  return 'http://localhost:5000';
};

const BASE_URL = getBaseUrl();

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