import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Alert,
  Dimensions,
  Linking,
  Share
} from 'react-native';
import { useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getPropertyById } from '../api/properties';
import { Property } from '../types';
import { Feather } from '@expo/vector-icons';

// Define navigation param types for type safety
type RootStackParamList = {
  PropertiesList: undefined;
  PropertyDetails: { propertyId: number; refreshFlag?: number };
  PropertyEdit: { propertyId: number };
};

type PropertyDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type RouteParams = {
  propertyId: number;
  refreshFlag?: number; // Optional timestamp for refresh
};

const { width } = Dimensions.get('window');

const PropertyDetailsScreen = () => {
  const navigation = useNavigation<PropertyDetailsScreenNavigationProp>();
  const route = useRoute();
  const { propertyId, refreshFlag } = route.params as RouteParams;
  
  // Keep track of current image index for carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState<Property | null>(null);

  // This useEffect will run when the component mounts or when the refreshFlag changes
  useEffect(() => {
    fetchPropertyDetails();
  }, [propertyId, refreshFlag]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const data = await getPropertyById(propertyId);
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      Alert.alert('Error', 'Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (property) {
      Share.share({
        title: property.title,
        message: `Check out this property: ${property.title} - ${property.address}, ${property.city} - $${formatPrice(property)}`,
      });
    }
  };

  const handleContactAgent = () => {
    // This would typically contact the listing agent
    Alert.alert(
      'Contact Agent',
      'Would you like to contact the listing agent?',
      [
        {
          text: 'Call',
          onPress: () => Linking.openURL('tel:+15551234567'),
        },
        {
          text: 'Message',
          onPress: () => navigation.navigate('ChatScreen', { userId: property?.listedById }),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleEditProperty = () => {
    navigation.navigate('PropertyEdit', { propertyId });
  };

  const formatPrice = (property?: Property) => {
    if (!property) return '';
    return property.price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading property details...</Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.errorContainer}>
        <Text>Property not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Property Images Carousel */}
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageCarousel}
          onScroll={(event) => {
            const contentOffsetX = event.nativeEvent.contentOffset.x;
            const currentIndex = Math.round(contentOffsetX / width);
            setCurrentImageIndex(currentIndex);
          }}
          scrollEventThrottle={16}
        >
          {/* Always include the main image first */}
          <Image
            source={{ uri: property.mainImage }}
            style={styles.carouselImage}
            resizeMode="cover"
          />
          
          {/* Then map through any additional images */}
          {property.images && property.images.length > 0 && 
            property.images
              .filter(img => img !== property.mainImage) // Don't show duplicate of main image
              .map((imageUrl, index) => (
                <Image
                  key={index}
                  source={{ uri: imageUrl }}
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
              ))
          }
        </ScrollView>
        
        {/* Overlay for image navigation */}
        {property.images && property.images.length > 0 && (
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              {`${currentImageIndex + 1}/${property.images.filter(img => img !== property.mainImage).length + 1}`}
            </Text>
          </View>
        )}
        
        <View style={styles.imageActions}>
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Feather name="share-2" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Property Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.price}>{formatPrice(property)}</Text>
          <Text style={styles.title}>{property.title}</Text>
          <Text style={styles.address}>{property.address}, {property.city}, {property.state} {property.zipCode}</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProperty}>
          <Feather name="edit-2" size={20} color="#007AFF" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Property Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Feather name="home" size={18} color="#666" />
            <Text style={styles.detailValue}>{property.type}</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="tag" size={18} color="#666" />
            <Text style={styles.detailValue}>{property.status}</Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Feather name="bed" size={18} color="#666" />
            <Text style={styles.detailValue}>{property.bedrooms} Beds</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="droplet" size={18} color="#666" />
            <Text style={styles.detailValue}>{property.bathrooms} Baths</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="maximize" size={18} color="#666" />
            <Text style={styles.detailValue}>{property.squareFeet.toLocaleString()} Sq Ft</Text>
          </View>
        </View>
      </View>

      {/* Property Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{property.description || 'No description available.'}</Text>
      </View>

      {/* Property Features */}
      {property.features && property.features.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresList}>
            {property.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Feather name="check" size={16} color="#007AFF" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Contact Agent Button */}
      <TouchableOpacity style={styles.contactButton} onPress={handleContactAgent}>
        <Text style={styles.contactButtonText}>Contact Agent</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  imageCarousel: {
    flex: 1,
  },
  carouselImage: {
    width: width,
    height: 250,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  imageCounterText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  mainImage: {
    width: '100%',
    height: 250,
  },
  imageActions: {
    position: 'absolute',
    top: 15,
    right: 15,
    flexDirection: 'row',
  },
  iconButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerContent: {
    flex: 1,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    color: '#666',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 5,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailValue: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  featureText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#444',
  },
  contactButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PropertyDetailsScreen;