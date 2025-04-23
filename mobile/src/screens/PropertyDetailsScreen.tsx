import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const PropertyDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { propertyId } = route.params as { propertyId: number };
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Mock property data - in real app, this would be fetched from API based on propertyId
  const property = {
    id: 1,
    title: 'Luxury Villa',
    address: '123 Luxury Ave, Beverly Hills, CA 90210',
    price: 4500000,
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 6200,
    type: 'For Sale',
    status: 'Active',
    description: 'This stunning Mediterranean-inspired luxury villa offers breathtaking views of the city and ocean. The property features an open floor plan with high ceilings, a gourmet kitchen with top-of-the-line appliances, and a resort-style backyard with infinity pool and outdoor kitchen.',
    features: [
      'Infinity Pool',
      'Home Theater',
      'Wine Cellar',
      'Smart Home System',
      '3-Car Garage',
      'Outdoor Kitchen'
    ],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&h=800',
      'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1200&h=800',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1200&h=800',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&h=800',
    ],
    listedBy: {
      id: 1,
      name: 'Alex Morgan',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&h=500',
    },
    yearBuilt: 2018,
    lotSize: '0.5 acre',
  };
  
  const formatPrice = (price) => {
    return '$' + price.toLocaleString();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setActiveImageIndex(newIndex);
            }}
          >
            {property.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.propertyImage}
              />
            ))}
          </ScrollView>
          <View style={styles.imageIndicators}>
            {property.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.imageIndicator,
                  index === activeImageIndex && styles.activeImageIndicator,
                ]}
              />
            ))}
          </View>
          <View style={styles.propertyTypeTag}>
            <Text style={styles.propertyTypeText}>{property.type}</Text>
          </View>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.propertyDetails}>
          <Text style={styles.propertyPrice}>{formatPrice(property.price)}</Text>
          <Text style={styles.propertyTitle}>{property.title}</Text>
          <Text style={styles.propertyAddress}>{property.address}</Text>
          
          <View style={styles.propertyFeatures}>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>{property.bedrooms}</Text>
              <Text style={styles.featureLabel}>Beds</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>{property.bathrooms}</Text>
              <Text style={styles.featureLabel}>Baths</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>{property.squareFeet.toLocaleString()}</Text>
              <Text style={styles.featureLabel}>Sq Ft</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureValue}>{property.yearBuilt}</Text>
              <Text style={styles.featureLabel}>Year</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{property.description}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresList}>
              {property.features.map((feature, index) => (
                <View key={index} style={styles.featureTag}>
                  <Text style={styles.featureTagText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Listed By</Text>
            <View style={styles.agentContainer}>
              <Image
                source={{ uri: property.listedBy.photo }}
                style={styles.agentPhoto}
              />
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{property.listedBy.name}</Text>
                <Text style={styles.agentRole}>Real Estate Agent</Text>
              </View>
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Listing</Text>
          </TouchableOpacity>
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
    paddingBottom: 30,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  propertyImage: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeImageIndicator: {
    backgroundColor: '#FFFFFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  propertyTypeTag: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  propertyTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  propertyDetails: {
    padding: 16,
  },
  propertyPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  propertyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 16,
    color: '#6B6B6B',
    marginBottom: 16,
  },
  propertyFeatures: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
  },
  featureValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  featureLabel: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6B6B6B',
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureTag: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  featureTagText: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  agentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  agentPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  agentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  agentRole: {
    fontSize: 14,
    color: '#6B6B6B',
    marginTop: 2,
  },
  contactButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  editButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PropertyDetailsScreen;