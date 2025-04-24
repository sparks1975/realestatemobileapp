import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProperties } from '../api/properties';
import { Property } from '../types';
import { FiBed, FiBath, FiSquare, FiPlus } from 'react-icons/fi';

const Properties = () => {
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
      console.log('Fetched properties:', data.length);
      setProperties(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
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
  
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    } else {
      return `$${price}`;
    }
  };
  
  // Function to get filtered properties based on active filter
  const getFilteredProperties = () => {
    if (activeFilter === 'All Properties') {
      return properties;
    } else if (activeFilter === 'For Sale') {
      return properties.filter(property => property.type === 'For Sale');
    } else if (activeFilter === 'For Rent') {
      return properties.filter(property => property.type === 'For Rent');
    } else if (activeFilter === 'Recent') {
      // Sort by created date, newest first
      return [...properties].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } else if (activeFilter === 'Pending') {
      return properties.filter(property => property.status === 'Pending');
    }
    
    return properties;
  };
  
  const filteredProperties = getFilteredProperties();
  
  return (
    <div className="properties-page">
      <div className="flex items-center justify-between mb-md">
        <h1>Properties</h1>
        <button className="btn btn-primary flex items-center gap-sm">
          <FiPlus size={18} />
          <span>New Property</span>
        </button>
      </div>
      
      <div className="filters-container flex mb-lg">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`btn ${activeFilter === filter ? 'btn-primary' : 'btn-secondary'} mr-sm`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p className="loading-text">Loading properties...</p>
        </div>
      ) : error ? (
        <div className="text-center py-lg">
          <p className="text-error mb-md">{error}</p>
          <button className="btn btn-primary" onClick={fetchProperties}>
            Retry
          </button>
        </div>
      ) : (
        <div className="properties-grid">
          {filteredProperties.length === 0 ? (
            <p className="text-center py-lg text-tertiary">No properties found</p>
          ) : (
            <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {filteredProperties.map((property) => (
                <Link 
                  to={`/properties/${property.id}`} 
                  key={property.id}
                  className="property-card"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="property-image-container" style={{ position: 'relative' }}>
                    <img 
                      src={property.mainImage} 
                      alt={property.title}
                      className="property-image"
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                    <div className="property-tag">
                      {property.type}
                    </div>
                    {property.status === 'Pending' && (
                      <div className="property-tag pending" style={{ right: '12px', left: 'auto' }}>
                        Pending
                      </div>
                    )}
                  </div>
                  <div className="property-details">
                    <div className="property-price">{formatPrice(property.price)}</div>
                    <div className="property-title">{property.title}</div>
                    <div className="property-address">{property.address}</div>
                    <div className="property-features">
                      <div className="flex items-center gap-sm">
                        <FiBed /> {property.bedrooms}
                      </div>
                      <div className="flex items-center gap-sm">
                        <FiBath /> {property.bathrooms}
                      </div>
                      <div className="flex items-center gap-sm">
                        <FiSquare /> {property.squareFeet.toLocaleString()} sqft
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Properties;