import apiClient from './client';
import { Property } from '../types';

// Function to get all properties
export const getProperties = async (): Promise<Property[]> => {
  try {
    console.log('Attempting to fetch properties from API...');
    const response = await apiClient.get('/api/properties');
    console.log('Successfully fetched properties:', response.data.length);
    return response.data;
  } catch (error) {
    // Log detailed error information to help with debugging
    console.error('Error fetching properties:', error);
    
    // Network connection troubleshooting guide
    console.error(`
=========================================
📱 MOBILE APP NETWORK CONNECTION GUIDE 📱
=========================================

Error Details: ${error.message}

Common Solutions:
1. Make sure your backend server is running
   - Run 'npm run dev' in the project root directory
   
2. Update the IP address in mobile/src/api/client.ts
   - Current URL: ${apiClient.defaults.baseURL}
   - This should be YOUR COMPUTER'S NETWORK IP, not localhost
   - Find your IP by running:
     • Windows: Open CMD and type 'ipconfig'
     • Mac: Open Terminal and type 'ifconfig'
     • Linux: Open Terminal and type 'ip addr'
   
3. Make sure your phone and computer are on the same WiFi network

4. Check if your computer firewall is blocking connections

For testing purposes on the Expo simulator, you can restart the app
and try again.
`);
    
    // Re-throw the error to be handled by the component
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
export const createProperty = async (propertyData: Omit<Property, 'id' | 'createdAt'>): Promise<Property> => {
  try {
    console.log('Creating property with data:', JSON.stringify(propertyData));
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
      lotSize: propertyData.lotSize,
      yearBuilt: propertyData.yearBuilt,
      parkingSpaces: propertyData.parkingSpaces,
      description: propertyData.description,
      features: propertyData.features,
      mainImage: propertyData.mainImage,
      images: propertyData.images,
    };
    
    // Use raw endpoint to bypass middleware issues that strip request bodies
    console.log('📱 Mobile - Using raw endpoint for property update');
    console.log('📱 Mobile - Sending data:', JSON.stringify(updates));
    
    const response = await apiClient.put(`/api/properties/${id}/raw`, updates);
    console.log('📱 Mobile - Raw endpoint response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating property with ID ${id}:`, error);
    throw error;
  }
};