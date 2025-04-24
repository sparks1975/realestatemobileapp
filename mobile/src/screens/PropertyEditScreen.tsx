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
import * as ImagePicker from 'expo-image-picker';

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
    description: '',
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await getPropertyById(propertyId);
        setProperty(data);
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
          description: data.description || '',
        });
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
        description: form.description,
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
});

export default PropertyEditScreen;