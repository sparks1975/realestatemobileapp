import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getProperties } from '../api/properties';
import { Property } from '../types';

const PropertiesScreen = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('All Properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchProperties();
  }, []);
  
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await getProperties();
      console.log('Fetched properties:', JSON.stringify(data));
      setProperties(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
      // Handle error
      Alert.alert(
        'Error',
        'Could not load properties. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };
  
  const filters = [
    'All Properties',
    'For Sale',
    'For Rent',
    'Recent',
    'Pending',
  ];
  
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    } else {
      return `$${price}`;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Properties</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ New</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilterButton,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text 
                style={[
                  styles.filterButtonText,
                  activeFilter === filter && styles.activeFilterButtonText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Show loading indicator when fetching data */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading properties...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchProperties}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.propertiesContainer}>
            {properties.length === 0 ? (
              <Text style={styles.noPropertiesText}>No properties found</Text>
            ) : (
              properties.map((property) => (
            <TouchableOpacity 
              key={property.id}
              style={styles.propertyCard}
              onPress={() => navigation.navigate('PropertyDetails', { propertyId: property.id })}
            >
              <View style={styles.propertyImageContainer}>
                <Image 
                  source={{ uri: property.mainImage }}
                  style={styles.propertyImage}
                />
                <View style={styles.propertyTypeTag}>
                  <Text style={styles.propertyTypeText}>{property.type}</Text>
                </View>
                {property.status === 'Pending' && (
                  <View style={styles.pendingTag}>
                    <Text style={styles.pendingTagText}>Pending</Text>
                  </View>
                )}
              </View>
              <View style={styles.propertyDetails}>
                <Text style={styles.propertyPrice}>{formatPrice(property.price)}</Text>
                <Text style={styles.propertyTitle}>{property.title}</Text>
                <Text style={styles.propertyAddress}>{property.address}</Text>
                <View style={styles.propertyFeatures}>
                  <Text style={styles.propertyFeature}>{property.bedrooms} Beds</Text>
                  <Text style={styles.propertyFeature}>{property.bathrooms} Baths</Text>
                  <Text style={styles.propertyFeature}>{property.squareFeet.toLocaleString()} sqft</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  filtersContainer: {
    paddingBottom: 16,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    color: '#8E8E93',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  propertiesContainer: {
    marginTop: 8,
  },
  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyImageContainer: {
    height: 200,
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  propertyTypeTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  propertyTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  pendingTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 149, 0, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  pendingTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  propertyDetails: {
    padding: 16,
  },
  propertyPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: '#6B6B6B',
    marginBottom: 8,
  },
  propertyFeatures: {
    flexDirection: 'row',
    marginTop: 4,
  },
  propertyFeature: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 12,
  },
});

export default PropertiesScreen;