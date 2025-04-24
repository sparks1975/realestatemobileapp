import { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiPlus, FiX, FiCheck, FiHome } from 'react-icons/fi';
import { getPropertyById, updateProperty } from '../api/properties';
import { Property } from '../types';

const PropertyEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [mainImage, setMainImage] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [squareFeet, setSquareFeet] = useState<number>(0);
  const [lotSize, setLotSize] = useState<number | null>(null);
  const [yearBuilt, setYearBuilt] = useState<number | null>(null);
  const [parkingSpaces, setParkingSpaces] = useState('');
  const [description, setDescription] = useState<string>('');
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  
  useEffect(() => {
    if (id) {
      fetchPropertyDetails(parseInt(id));
    }
  }, [id]);
  
  const fetchPropertyDetails = async (propertyId: number) => {
    try {
      setLoading(true);
      const data = await getPropertyById(propertyId);
      setProperty(data);
      
      // Populate form fields with property data
      setTitle(data.title);
      setType(data.type);
      setStatus(data.status);
      setPrice(data.price);
      setAddress(data.address);
      setCity(data.city);
      setState(data.state);
      setZipCode(data.zipCode);
      setBedrooms(data.bedrooms);
      setBathrooms(data.bathrooms);
      setSquareFeet(data.squareFeet);
      setLotSize(data.lotSize);
      setYearBuilt(data.yearBuilt);
      setParkingSpaces(data.parkingSpaces);
      setDescription(data.description || '');
      setFeatures(data.features || []);
      setMainImage(data.mainImage);
      setImages(data.images);
      
      setError(null);
    } catch (err) {
      console.error(`Error fetching property with ID ${propertyId}:`, err);
      setError('Failed to load property details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !property) return;
    
    try {
      setSaving(true);
      
      const updatedPropertyData: Partial<Property> = {
        title,
        type,
        status,
        price,
        address,
        city,
        state,
        zipCode,
        bedrooms,
        bathrooms,
        squareFeet,
        lotSize,
        yearBuilt,
        parkingSpaces,
        description,
        features,
        mainImage,
        images
      };
      
      await updateProperty(parseInt(id), updatedPropertyData);
      
      // Redirect to property details page
      navigate(`/properties/${id}`);
    } catch (err) {
      console.error(`Error updating property:`, err);
      alert('Failed to update property. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // For a real implementation, you would upload these files to a server
    // and get back URLs. For now, we'll create object URLs as a demo.
    const newImageUrls = Array.from(files).map(file => URL.createObjectURL(file));
    
    // Add new images to the existing images array
    setImages(prev => [...prev, ...newImageUrls]);
    
    // If there's no main image, set the first uploaded image as main
    if (!mainImage && newImageUrls.length > 0) {
      setMainImage(newImageUrls[0]);
    }
  };
  
  const removeImage = (imageUrl: string) => {
    setImages(prev => prev.filter(url => url !== imageUrl));
    
    // If the removed image was the main image, set a new main image
    if (mainImage === imageUrl) {
      if (images.length > 1) {
        // Find the next available image
        const nextImage = images.find(url => url !== imageUrl);
        setMainImage(nextImage || '');
      } else {
        setMainImage('');
      }
    }
  };
  
  const setAsMainImage = (imageUrl: string) => {
    setMainImage(imageUrl);
  };
  
  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };
  
  const removeFeature = (feature: string) => {
    setFeatures(prev => prev.filter(f => f !== feature));
  };
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="loading-text">Loading property details...</p>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="text-center py-lg">
        <p className="text-error mb-md">{error || 'Property not found'}</p>
        <button className="btn btn-primary mr-md" onClick={() => navigate('/properties')}>
          Back to Properties
        </button>
        {id && (
          <button 
            className="btn btn-secondary" 
            onClick={() => fetchPropertyDetails(parseInt(id))}
          >
            Retry
          </button>
        )}
      </div>
    );
  }
  
  return (
    <div className="property-edit-page">
      <div className="flex items-center justify-between mb-lg">
        <div className="flex items-center gap-sm">
          <button 
            className="btn btn-secondary flex items-center gap-sm" 
            onClick={() => navigate(`/properties/${id}`)}
          >
            <FiArrowLeft size={18} />
            <span>Back</span>
          </button>
          <h1 className="ml-md">Edit Property</h1>
        </div>
        <button 
          className="btn btn-primary flex items-center gap-sm"
          onClick={handleSubmit}
          disabled={saving}
        >
          <FiSave size={18} />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="property-form">
        <div className="card mb-lg">
          <h2 className="mb-md">Property Images</h2>
          
          <div className="image-upload-container mb-md">
            <label className="image-upload-label btn btn-secondary flex items-center gap-sm">
              <FiPlus size={18} />
              <span>Upload Images</span>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </label>
            <p className="text-tertiary text-sm mt-sm">JPG, PNG or GIF, max 10MB each. You can upload multiple files.</p>
          </div>
          
          <div className="image-preview-container">
            {images.length === 0 ? (
              <div className="no-images text-center py-lg">
                <FiHome size={48} className="text-tertiary mb-md" style={{ margin: '0 auto' }} />
                <p className="text-tertiary">No images uploaded</p>
                <p className="text-secondary">Upload images to showcase the property</p>
              </div>
            ) : (
              <div className="image-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                {images.map((imageUrl, index) => (
                  <div 
                    key={index} 
                    className="image-item card"
                    style={{ position: 'relative', overflow: 'hidden' }}
                  >
                    <img 
                      src={imageUrl} 
                      alt={`Property ${index + 1}`}
                      style={{ 
                        width: '100%', 
                        height: '150px', 
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-md)'
                      }}
                    />
                    
                    <div className="image-actions" style={{ 
                      position: 'absolute', 
                      top: '8px', 
                      right: '8px',
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button 
                        type="button"
                        className="btn btn-icon"
                        onClick={() => removeImage(imageUrl)}
                        style={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                          color: 'white',
                          width: '30px',
                          height: '30px'
                        }}
                      >
                        <FiX size={16} />
                      </button>
                      
                      <button 
                        type="button"
                        className={`btn btn-icon ${mainImage === imageUrl ? 'active' : ''}`}
                        onClick={() => setAsMainImage(imageUrl)}
                        style={{ 
                          backgroundColor: mainImage === imageUrl ? 'var(--color-accent-primary)' : 'rgba(0, 0, 0, 0.5)', 
                          color: 'white',
                          width: '30px',
                          height: '30px'
                        }}
                      >
                        <FiCheck size={16} />
                      </button>
                    </div>
                    
                    {mainImage === imageUrl && (
                      <div style={{ 
                        position: 'absolute', 
                        bottom: '8px', 
                        left: '8px',
                        backgroundColor: 'var(--color-accent-primary)',
                        color: 'white',
                        fontSize: '0.75rem',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        Main Image
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="card mb-lg">
          <h2 className="mb-md">Basic Information</h2>
          
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="title">Title</label>
              <input 
                type="text" 
                id="title" 
                className="form-input" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="type">Property Type</label>
              <select 
                id="type" 
                className="form-input" 
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="">Select type</option>
                <option value="For Sale">For Sale</option>
                <option value="For Rent">For Rent</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="status">Status</label>
              <select 
                id="status" 
                className="form-input" 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">Select status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="price">Price ($)</label>
              <input 
                type="number" 
                id="price" 
                className="form-input" 
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min="0"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="card mb-lg">
          <h2 className="mb-md">Location</h2>
          
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="address">Address</label>
              <input 
                type="text" 
                id="address" 
                className="form-input" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="city">City</label>
              <input 
                type="text" 
                id="city" 
                className="form-input" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="state">State</label>
              <input 
                type="text" 
                id="state" 
                className="form-input" 
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="zipCode">Zip Code</label>
              <input 
                type="text" 
                id="zipCode" 
                className="form-input" 
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="card mb-lg">
          <h2 className="mb-md">Property Details</h2>
          
          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="bedrooms">Bedrooms</label>
              <input 
                type="number" 
                id="bedrooms" 
                className="form-input" 
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="bathrooms">Bathrooms</label>
              <input 
                type="number" 
                id="bathrooms" 
                className="form-input" 
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                min="0"
                step="0.5"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="squareFeet">Square Feet</label>
              <input 
                type="number" 
                id="squareFeet" 
                className="form-input" 
                value={squareFeet}
                onChange={(e) => setSquareFeet(Number(e.target.value))}
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="lotSize">Lot Size (sqft)</label>
              <input 
                type="number" 
                id="lotSize" 
                className="form-input" 
                value={lotSize || ''}
                onChange={(e) => setLotSize(e.target.value ? Number(e.target.value) : null)}
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="yearBuilt">Year Built</label>
              <input 
                type="number" 
                id="yearBuilt" 
                className="form-input" 
                value={yearBuilt || ''}
                onChange={(e) => setYearBuilt(e.target.value ? Number(e.target.value) : null)}
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="parkingSpaces">Parking</label>
              <input 
                type="text" 
                id="parkingSpaces" 
                className="form-input" 
                value={parkingSpaces}
                onChange={(e) => setParkingSpaces(e.target.value)}
                placeholder="e.g., 2-Car Garage"
              />
            </div>
          </div>
          
          <div className="form-group mt-md">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea 
              id="description" 
              className="form-input" 
              rows={6}
              value={description || ''}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the property..."
            ></textarea>
          </div>
        </div>
        
        <div className="card">
          <h2 className="mb-md">Features</h2>
          
          <div className="feature-input flex gap-sm mb-md">
            <input 
              type="text" 
              className="form-input flex-1" 
              placeholder="Add a feature (e.g., Swimming Pool, Fireplace)"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            />
            <button 
              type="button"
              className="btn btn-primary flex items-center gap-sm"
              onClick={addFeature}
            >
              <FiPlus size={18} />
              <span>Add</span>
            </button>
          </div>
          
          <div className="features-list">
            {features.length === 0 ? (
              <p className="text-tertiary text-center py-md">No features added yet</p>
            ) : (
              <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="feature-item flex justify-between items-center"
                    style={{
                      backgroundColor: 'var(--color-bg-card)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <span>{feature}</span>
                    <button 
                      type="button"
                      className="btn btn-icon"
                      onClick={() => removeFeature(feature)}
                      style={{ 
                        backgroundColor: 'transparent', 
                        color: 'var(--color-text-tertiary)'
                      }}
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyEdit;