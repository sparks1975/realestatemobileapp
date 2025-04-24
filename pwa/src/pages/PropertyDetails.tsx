import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPropertyById } from '../api/properties';
import { Property } from '../types';
import { FiArrowLeft, FiEdit2, FiBed, FiBath, FiSquare, FiCalendar, FiHome, FiClock, FiMapPin, FiTag, FiCheck } from 'react-icons/fi';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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
      setError(null);
    } catch (err) {
      console.error(`Error fetching property with ID ${propertyId}:`, err);
      setError('Failed to load property details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const handlePrevImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex(prev => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };
  
  const handleNextImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex(prev => 
        (prev + 1) % property.images.length
      );
    }
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
    <div className="property-details-page">
      <div className="flex items-center justify-between mb-md">
        <button 
          className="btn btn-secondary flex items-center gap-sm" 
          onClick={() => navigate('/properties')}
        >
          <FiArrowLeft size={18} />
          <span>Back</span>
        </button>
        <Link 
          to={`/properties/${property.id}/edit`} 
          className="btn btn-primary flex items-center gap-sm"
        >
          <FiEdit2 size={18} />
          <span>Edit Property</span>
        </Link>
      </div>
      
      {/* Image carousel */}
      <div className="property-images-carousel mb-lg" style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {property.images.length > 0 && (
          <>
            <img 
              src={property.images[currentImageIndex]} 
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
              style={{ 
                width: '100%', 
                height: '400px', 
                objectFit: 'cover',
                display: 'block'
              }}
            />
            
            {/* Navigation buttons */}
            <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', display: 'flex', justifyContent: 'space-between', transform: 'translateY(-50%)' }}>
              <button 
                onClick={handlePrevImage}
                className="btn btn-secondary"
                style={{ 
                  margin: '0 10px', 
                  borderRadius: '50%', 
                  width: '40px', 
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                ←
              </button>
              <button 
                onClick={handleNextImage}
                className="btn btn-secondary"
                style={{ 
                  margin: '0 10px', 
                  borderRadius: '50%', 
                  width: '40px', 
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                →
              </button>
            </div>
            
            {/* Image indicator */}
            <div style={{ 
              position: 'absolute', 
              bottom: '10px', 
              left: '50%', 
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: '5px 10px',
              borderRadius: '20px',
              color: 'white',
              fontSize: '14px'
            }}>
              {currentImageIndex + 1} / {property.images.length}
            </div>
            
            {/* Property type tag */}
            <div className="property-tag" style={{ position: 'absolute', top: '10px', left: '10px' }}>
              {property.type}
            </div>
            
            {/* Status tag if pending */}
            {property.status === 'Pending' && (
              <div className="property-tag pending" style={{ position: 'absolute', top: '10px', right: '10px' }}>
                Pending
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="property-details-content">
        <div className="flex justify-between items-center mb-md">
          <h1>{property.title}</h1>
          <div className="property-price text-accent" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {formatPrice(property.price)}
          </div>
        </div>
        
        <div className="property-address mb-lg">
          <div className="flex items-center gap-sm text-secondary">
            <FiMapPin />
            <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
          </div>
        </div>
        
        <div className="property-main-features flex gap-lg mb-lg">
          <div className="feature-item text-center">
            <div className="flex items-center justify-center mb-sm" style={{ fontSize: '1.5rem' }}>
              <FiBed className="text-accent" />
            </div>
            <div className="feature-value" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{property.bedrooms}</div>
            <div className="feature-label text-tertiary">Bedrooms</div>
          </div>
          
          <div className="feature-item text-center">
            <div className="flex items-center justify-center mb-sm" style={{ fontSize: '1.5rem' }}>
              <FiBath className="text-accent" />
            </div>
            <div className="feature-value" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{property.bathrooms}</div>
            <div className="feature-label text-tertiary">Bathrooms</div>
          </div>
          
          <div className="feature-item text-center">
            <div className="flex items-center justify-center mb-sm" style={{ fontSize: '1.5rem' }}>
              <FiSquare className="text-accent" />
            </div>
            <div className="feature-value" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{property.squareFeet.toLocaleString()}</div>
            <div className="feature-label text-tertiary">Square Feet</div>
          </div>
          
          <div className="feature-item text-center">
            <div className="flex items-center justify-center mb-sm" style={{ fontSize: '1.5rem' }}>
              <FiHome className="text-accent" />
            </div>
            <div className="feature-value" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{property.lotSize?.toLocaleString() || 'N/A'}</div>
            <div className="feature-label text-tertiary">Lot Size</div>
          </div>
          
          <div className="feature-item text-center">
            <div className="flex items-center justify-center mb-sm" style={{ fontSize: '1.5rem' }}>
              <FiCalendar className="text-accent" />
            </div>
            <div className="feature-value" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{property.yearBuilt || 'N/A'}</div>
            <div className="feature-label text-tertiary">Year Built</div>
          </div>
        </div>
        
        <div className="property-additional-info mb-lg">
          <h2 className="mb-md">Details</h2>
          <div className="card">
            <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="detail-item">
                <div className="detail-label text-tertiary">Property Type</div>
                <div className="detail-value">{property.type}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label text-tertiary">Status</div>
                <div className="detail-value">{property.status}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label text-tertiary">Parking</div>
                <div className="detail-value">{property.parkingSpaces}</div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label text-tertiary">Listed Date</div>
                <div className="detail-value">
                  {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="property-description mb-lg">
          <h2 className="mb-md">Description</h2>
          <div className="card">
            <p>{property.description || 'No description available.'}</p>
          </div>
        </div>
        
        {property.features && property.features.length > 0 && (
          <div className="property-features mb-lg">
            <h2 className="mb-md">Features</h2>
            <div className="card">
              <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {property.features.map((feature, index) => (
                  <div key={index} className="feature-item flex items-center gap-sm">
                    <FiCheck className="text-accent" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetails;