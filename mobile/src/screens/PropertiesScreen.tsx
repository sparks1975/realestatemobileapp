import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PropertiesScreen = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('All Properties');
  
  // Mock property data
  const properties = [
    {
      id: 1,
      title: 'Luxury Villa',
      address: '123 Luxury Ave, Beverly Hills, CA 90210',
      price: 4500000,
      bedrooms: 5,
      bathrooms: 4,
      squareFeet: 6200,
      type: 'For Sale',
      status: 'Active',
      mainImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=800',
    },
    {
      id: 2,
      title: 'Modern Apartment',
      address: '456 Downtown Blvd, Los Angeles, CA 90017',
      price: 1200000,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1800,
      type: 'For Sale',
      status: 'Pending',
      mainImage: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=1200&h=800',
    },
    {
      id: 3,
      title: 'Luxury Penthouse',
      address: '789 Skyline Blvd, San Francisco, CA 94121',
      price: 5800000,
      bedrooms: 3,
      bathrooms: 3.5,
      squareFeet: 3200,
      type: 'For Sale',
      status: 'Active',
      mainImage: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?auto=format&fit=crop&w=1200&h=800',
    },
    {
      id: 4,
      title: 'Waterfront House',
      address: '321 Coastal Hwy, Malibu, CA 90265',
      price: 8500000,
      bedrooms: 4,
      bathrooms: 4.5,
      squareFeet: 5600,
      type: 'For Sale',
      status: 'Active',
      mainImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&h=800',
    },
  ];
  
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
        
        <View style={styles.propertiesContainer}>
          {properties.map((property) => (
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