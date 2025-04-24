import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getPropertyById, updateProperty } from '../api/properties';
import { Property } from '../types';
import { Feather } from '@expo/vector-icons';
// Assuming expo-image-picker is already installed in the Expo project

// Define navigation param types for type safety
type RootStackParamList = {
  PropertiesList: undefined;
  PropertyDetails: { propertyId: number; refreshFlag?: number };
  PropertyEdit: { propertyId: number };
};

type PropertyEditScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type RouteParams = {
  propertyId: number;
};

const PropertyEditScreen = () => {
  const navigation = useNavigation<PropertyEditScreenNavigationProp>();
  const route = useRoute();
  const { propertyId } = route.params as RouteParams;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [form, setForm] = useState({
    title: '',
    type: '',
    status: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    lotSize: '',
    yearBuilt: '',
    parkingSpaces: '',
    description: '',
    features: [] as string[],
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await getPropertyById(propertyId);
        setProperty(data);
        
        // Set all the form fields with the fetched data
        setForm({
          title: data.title,
          type: data.type,
          status: data.status,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          price: data.price.toString(),
          bedrooms: data.bedrooms.toString(),
          bathrooms: data.bathrooms.toString(),
          squareFeet: data.squareFeet.toString(),
          lotSize: data.lotSize ? data.lotSize.toString() : '',
          yearBuilt: data.yearBuilt ? data.yearBuilt.toString() : '',
          parkingSpaces: data.parkingSpaces || '',
          description: data.description || '',
          features: data.features || [],
        });
        
        // Initialize the image states
        setMainImage(data.mainImage);
        
        // Initialize the images array with all property images
        if (data.images && data.images.length > 0) {
          setImages(data.images);
        } else if (data.mainImage) {
          // If no images array but main image exists, use that
          setImages([data.mainImage]);
        }
        
      } catch (error) {
        console.error('Error fetching property:', error);
        Alert.alert('Error', 'Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Basic validation
      if (!form.title || !form.price || !form.address) {
        Alert.alert('Error', 'Please fill in all required fields');
        setSaving(false);
        return;
      }

      // Create a clean update object with proper type conversions
      const updates = {
        title: form.title,
        type: form.type,
        status: form.status,
        address: form.address,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        price: parseFloat(form.price),
        bedrooms: parseInt(form.bedrooms, 10) || 0,
        bathrooms: parseInt(form.bathrooms, 10) || 0,
        squareFeet: parseInt(form.squareFeet, 10) || 0,
        lotSize: form.lotSize ? parseInt(form.lotSize, 10) : null,
        yearBuilt: form.yearBuilt ? parseInt(form.yearBuilt, 10) : null,
        parkingSpaces: form.parkingSpaces,
        description: form.description,
        features: form.features,
        // Update images
        mainImage: mainImage,
        images: images,
      };
      
      console.log('Submitting property update:', JSON.stringify(updates));
      
      // Call the API to update the property
      await updateProperty(propertyId, updates);
      
      Alert.alert(
        'Success', 
        'Property updated successfully',
        [
          { 
            text: 'OK',
            onPress: () => {
              // Navigate back to the property details screen with refreshFlag to trigger a refresh
              navigation.navigate('PropertyDetails', { 
                propertyId, 
                refreshFlag: Date.now() // Add a timestamp to force a refresh
              });
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('Error updating property:', error);
      Alert.alert('Error', 'Failed to update property details');
    } finally {
      setSaving(false);
    }
  };

  const handleChangeText = (name: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Pick an image from the gallery
  const pickImage = async () => {
    try {
      setUploadingImage(true);
      // We'll use a mock image picker for now since we're having dependency issues
      // In a real app, we would use expo-image-picker
      Alert.alert(
        'Image Selection',
        'This is a mock image picker. In a real app, this would open the device gallery.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Simulate Selected Image',
            onPress: () => {
              // Simulate adding a new image
              const newImageUrl = 'https://via.placeholder.com/500x300?text=New+Image';
              setImages(prev => [...prev, newImageUrl]);
              
              // If it's the first image, set it as main image
              if (!mainImage) {
                setMainImage(newImageUrl);
              }
              
              Alert.alert('Success', 'Image added successfully');
            },
          }
        ]
      );
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setUploadingImage(false);
    }
  };
  
  // Set an image as the main image
  const setAsMainImage = (imageUrl: string) => {
    setMainImage(imageUrl);
  };
  
  // Remove an image from the list
  const removeImage = (imageUrl: string) => {
    setImages(prev => prev.filter(img => img !== imageUrl));
    
    // If the main image is removed, set a new main image
    if (mainImage === imageUrl) {
      setMainImage(images.length > 1 ? images.filter(img => img !== imageUrl)[0] : '');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading property details...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Edit Property</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title*</Text>
          <TextInput
            style={styles.input}
            value={form.title}
            onChangeText={(value) => handleChangeText('title', value)}
            placeholder="Property Title"
          />
        </View>

        <View style={styles.formRow}>
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Type</Text>
            <TextInput
              style={styles.input}
              value={form.type}
              onChangeText={(value) => handleChangeText('type', value)}
              placeholder="House, Condo, etc."
            />
          </View>
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Status</Text>
            <TextInput
              style={styles.input}
              value={form.status}
              onChangeText={(value) => handleChangeText('status', value)}
              placeholder="For Sale, For Rent, etc."
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Address*</Text>
          <TextInput
            style={styles.input}
            value={form.address}
            onChangeText={(value) => handleChangeText('address', value)}
            placeholder="Street Address"
          />
        </View>

        <View style={styles.formRow}>
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={form.city}
              onChangeText={(value) => handleChangeText('city', value)}
              placeholder="City"
            />
          </View>
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              value={form.state}
              onChangeText={(value) => handleChangeText('state', value)}
              placeholder="State"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Zip Code</Text>
          <TextInput
            style={styles.input}
            value={form.zipCode}
            onChangeText={(value) => handleChangeText('zipCode', value)}
            placeholder="Zip Code"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Price*</Text>
          <TextInput
            style={styles.input}
            value={form.price}
            onChangeText={(value) => handleChangeText('price', value)}
            placeholder="Price"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formRow}>
          <View style={[styles.formGroup, styles.thirdWidth]}>
            <Text style={styles.label}>Beds</Text>
            <TextInput
              style={styles.input}
              value={form.bedrooms}
              onChangeText={(value) => handleChangeText('bedrooms', value)}
              placeholder="Bedrooms"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formGroup, styles.thirdWidth]}>
            <Text style={styles.label}>Baths</Text>
            <TextInput
              style={styles.input}
              value={form.bathrooms}
              onChangeText={(value) => handleChangeText('bathrooms', value)}
              placeholder="Bathrooms"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formGroup, styles.thirdWidth]}>
            <Text style={styles.label}>Sq Ft</Text>
            <TextInput
              style={styles.input}
              value={form.squareFeet}
              onChangeText={(value) => handleChangeText('squareFeet', value)}
              placeholder="Square Feet"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.description}
            onChangeText={(value) => handleChangeText('description', value)}
            placeholder="Property Description"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Additional Details Section */}
        <View style={styles.formGroup}>
          <Text style={styles.sectionTitle}>Additional Details</Text>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Lot Size (sq ft)</Text>
              <TextInput
                style={styles.input}
                value={form.lotSize}
                onChangeText={(value) => handleChangeText('lotSize', value)}
                placeholder="Lot Size"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Year Built</Text>
              <TextInput
                style={styles.input}
                value={form.yearBuilt}
                onChangeText={(value) => handleChangeText('yearBuilt', value)}
                placeholder="Year Built"
                keyboardType="numeric"
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Parking Spaces</Text>
            <TextInput
              style={styles.input}
              value={form.parkingSpaces}
              onChangeText={(value) => handleChangeText('parkingSpaces', value)}
              placeholder="Garage, Street, etc."
            />
          </View>
        </View>

        {/* Image Management Section */}
        <View style={styles.formGroup}>
          <Text style={styles.sectionTitle}>Property Images</Text>
          
          <TouchableOpacity
            style={styles.addImageButton}
            onPress={pickImage}
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Feather name="camera" size={16} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.addImageButtonText}>Add Image</Text>
              </>
            )}
          </TouchableOpacity>
          
          {/* Image Gallery */}
          {images.length > 0 && (
            <View style={styles.imageGallery}>
              {images.map((imageUrl, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
                  
                  <View style={styles.imageActions}>
                    <TouchableOpacity
                      style={[
                        styles.imageAction,
                        mainImage === imageUrl && styles.mainImageAction
                      ]}
                      onPress={() => setAsMainImage(imageUrl)}
                    >
                      <Feather 
                        name="star" 
                        size={16} 
                        color={mainImage === imageUrl ? "#fff" : "#007AFF"} 
                      />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.imageAction}
                      onPress={() => removeImage(imageUrl)}
                    >
                      <Feather name="trash-2" size={16} color="#ff3b30" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
          
          {mainImage && (
            <View style={styles.mainImageInfo}>
              <Feather name="info" size={14} color="#555" />
              <Text style={styles.mainImageText}>
                Image with star is the main property image
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Text style={styles.saveButtonText}>Saving...</Text>
            ) : (
              <>
                <Feather name="save" size={16} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
    marginTop: 10,
  },
  formGroup: {
    marginBottom: 15,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  thirdWidth: {
    width: '31%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#555',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
    marginLeft: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#555',
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 5,
  },
  
  // Image Gallery Styles
  addImageButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  addImageButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  imageGallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  imageAction: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImageAction: {
    backgroundColor: '#CBA328', // Gold color for main image
  },
  mainImageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  mainImageText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
});

export default PropertyEditScreen;