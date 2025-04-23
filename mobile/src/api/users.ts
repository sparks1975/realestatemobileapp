import apiClient from './client';
import { User } from '../types';

// Function to get the current user's information
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get('/api/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

// Function to update the user's profile
export const updateProfile = async (userData: any): Promise<User> => {
  try {
    const response = await apiClient.patch('/api/users/me', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};