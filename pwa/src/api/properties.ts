import apiClient from './client';
import { Property } from '../types';

// Get all properties
export const getProperties = async (): Promise<Property[]> => {
  try {
    const response = await apiClient.get('/api/properties');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

// Get property by id
export const getPropertyById = async (id: number): Promise<Property> => {
  try {
    const response = await apiClient.get(`/api/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching property with ID ${id}:`, error);
    throw error;
  }
};

// Create a new property
export const createProperty = async (propertyData: Partial<Property>): Promise<Property> => {
  try {
    const response = await apiClient.post('/api/properties', propertyData);
    return response.data;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

// Update an existing property
export const updateProperty = async (id: number, propertyData: Partial<Property>): Promise<Property> => {
  try {
    const response = await apiClient.put(`/api/properties/${id}`, propertyData);
    return response.data;
  } catch (error) {
    console.error(`Error updating property with ID ${id}:`, error);
    throw error;
  }
};

// Delete a property
export const deleteProperty = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/properties/${id}`);
  } catch (error) {
    console.error(`Error deleting property with ID ${id}:`, error);
    throw error;
  }
};

// Upload property images
export const uploadPropertyImages = async (id: number, formData: FormData): Promise<string[]> => {
  try {
    const response = await apiClient.post(`/api/properties/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.imageUrls;
  } catch (error) {
    console.error(`Error uploading images for property with ID ${id}:`, error);
    throw error;
  }
};