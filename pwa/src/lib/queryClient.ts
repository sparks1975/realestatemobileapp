import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Create a custom axios instance
export const apiClient = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Utility function for making API requests
export const apiRequest = async ({ 
  url, 
  method = 'GET', 
  data = undefined, 
  config = {} 
}: { 
  url: string; 
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; 
  data?: any; 
  config?: Record<string, any>; 
}) => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error: any) {
    // Handle Axios error
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    console.error(`API Error (${url}):`, errorMessage);
    throw new Error(errorMessage);
  }
};

// Create QueryClient with default config
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      queryFn: async ({ queryKey }) => {
        // The first element of queryKey should be the URL
        const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;
        
        if (typeof url !== 'string') {
          throw new Error('QueryKey must be a string or start with a string URL');
        }
        
        return apiRequest({ url });
      },
    },
  },
});