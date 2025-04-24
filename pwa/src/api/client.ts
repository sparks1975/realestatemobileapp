import axios from 'axios';

// Set the base URL for API requests
const getBaseUrl = () => {
  // Check if we have an environment variable for the API URL
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Default to same domain as PWA for production
  // This assumes the API is hosted on the same domain as the PWA
  if (import.meta.env.PROD) {
    return window.location.origin;
  }
  
  // For development, connect to the local API server
  return 'http://localhost:5000';
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
`);
    } else {
      // Something happened in setting up the request
      console.error('Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;