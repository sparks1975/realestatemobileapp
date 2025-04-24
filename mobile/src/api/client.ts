import axios from 'axios';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';

// Set the base URL for API requests
// When running in Expo Go on a physical device, we need to use the actual
// IP address of the computer running the Replit server rather than localhost
const getBaseUrl = () => {
  // Check if we have an environment variable for the API URL
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // Get the Replit app URL if available (for production)
  const replitUrl = process.env.REPLIT_URL || '';
  if (replitUrl) {
    return `https://${replitUrl}`;
  }
  
  // For Expo on physical devices, we need to use the computer's network IP address
  // You need to get your computer's IP address on your local network
  // You can find it by:
  // - Windows: Open Command Prompt and type 'ipconfig'
  // - Mac: Open Terminal and type 'ifconfig' or go to System Preferences > Network
  // - Linux: Open Terminal and type 'ifconfig' or 'ip addr show'
  
  // ⚠️ IMPORTANT: Update this value with your computer's actual IP address
  // The format should be: http://YOUR_IP_ADDRESS:5000
  // For example: 'http://192.168.1.123:5000'

  const LOCAL_IP_ADDRESS = '192.168.1.100';
  return `http://${LOCAL_IP_ADDRESS}:5000`;
};

const BASE_URL = getBaseUrl();

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Increased timeout for slower connections
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Debug info about the API connection
console.log(`API client configured with base URL: ${BASE_URL}`);

// Request interceptor for adding authorization headers, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Log outgoing requests for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // You could add auth tokens here if needed
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    // Handle error responses
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`API Error ${error.response.status}:`, error.response.data);

      // Handle specific error codes
      if (error.response.status === 401) {
        // Unauthorized - handle auth failures
        console.log('Authentication required');
      } else if (error.response.status === 404) {
        console.error('API Endpoint not found. Check the URL and routes configuration');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error - No response received:', error.request);
      
      // Show helpful information for common network issues
      console.error(`
=== NETWORK TROUBLESHOOTING GUIDE ===
1. Is your server running? Run 'npm run dev' in the root directory.
2. Check your API URL: ${BASE_URL}
3. If using a physical device, make sure:
   - Your computer and phone are on the same WiFi network
   - You've updated the IP address in this file to your computer's actual IP
   - Your computer's firewall allows connections on port 5000
`);
    } else {
      // Something happened in setting up the request
      console.error('Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;