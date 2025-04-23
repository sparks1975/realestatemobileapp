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
export const updateProperty = async (id: number, propertyData: Partial<Property>): Promise<Property> => {
  try {
    // Log update operation for debugging
    console.log(`Updating property ${id} with data:`, JSON.stringify(propertyData));
    
    // Create a sanitized copy with only the fields we want to update
    const updates = {
      title: propertyData.title,
      type: propertyData.type,
      status: propertyData.status,
      address: propertyData.address,
      city: propertyData.city,
      state: propertyData.state,
      zipCode: propertyData.zipCode,
      price: propertyData.price,
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      squareFeet: propertyData.squareFeet,
      description: propertyData.description,
    };
    
    const response = await apiClient.patch(`/api/properties/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating property with ID ${id}:`, error);
    throw error;
  }
};