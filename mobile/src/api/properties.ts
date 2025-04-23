import apiClient from './client';
import { Property } from '../types';

// Function to get all properties
export const getProperties = async (): Promise<Property[]> => {
  try {
    const response = await apiClient.get('/api/properties');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

// Function to get a specific property by ID
export const getPropertyById = async (id: number): Promise<Property> => {
  try {
    const response = await apiClient.get(`/api/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching property with ID ${id}:`, error);
    throw error;
  }
};

// Function to create a new property
export const createProperty = async (propertyData: any): Promise<Property> => {
  try {
    const response = await apiClient.post('/api/properties', propertyData);
    return response.data;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

// Function to update a property
export const updateProperty = async (id: number, propertyData: any): Promise<Property> => {
  try {
    const response = await apiClient.patch(`/api/properties/${id}`, propertyData);
    return response.data;
  } catch (error) {
    console.error(`Error updating property with ID ${id}:`, error);
    throw error;
  }
};