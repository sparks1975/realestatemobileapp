import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiFilter, FiCheck, FiHome, FiMapPin, FiDollarSign } from 'react-icons/fi';
import apiClient from '../api/client';
import { Property } from '../types';

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    minBathrooms: ''
  });
  
  useEffect(() => {
    fetchProperties();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, properties]);
  
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/properties');
      setProperties(response.data);
      setFilteredProperties(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const applyFilters = () => {
    if (!properties.length) return;
    
    let result = [...properties];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(property => 
        property.title.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query) ||
        property.state.toLowerCase().includes(query) ||
        property.zipCode.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
    if (filters.status !== 'all') {
      result = result.filter(property => property.status === filters.status);
    }
    
    if (filters.type !== 'all') {
      result = result.filter(property => property.type === filters.type);
    }
    
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      result = result.filter(property => property.price >= minPrice);
    }
    
    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      result = result.filter(property => property.price <= maxPrice);
    }
    
    if (filters.minBedrooms) {
      const minBedrooms = parseInt(filters.minBedrooms);
      result = result.filter(property => property.bedrooms >= minBedrooms);
    }
    
    if (filters.minBathrooms) {
      const minBathrooms = parseFloat(filters.minBathrooms);
      result = result.filter(property => property.bathrooms >= minBathrooms);
    }
    
    setFilteredProperties(result);
  };
  
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      status: 'all',
      type: 'all',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      minBathrooms: ''
    });
    setSearchQuery('');
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="loading-text">Loading properties...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-lg">
        <p className="text-error mb-md">{error}</p>
        <button className="btn btn-primary" onClick={fetchProperties}>
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="properties-page">
      <div className="flex justify-between items-center mb-lg">
        <h1 className="page-title mb-0">Properties</h1>
        
        <Link 
          to="/properties/new" 
          className="btn btn-primary flex items-center gap-sm"
        >
          <FiPlus size={18} />
          <span>Add Property</span>
        </Link>
      </div>
      
      {/* Search and filter bar */}
      <div className="search-filter-bar card mb-lg">
        <div className="flex flex-col md:flex-row items-center gap-md">
          <div className="search-container flex-1 w-full">
            <div className="search-input-wrapper relative">
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search by address, title, city..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <FiSearch 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary" 
                size={18} 
              />
            </div>
          </div>
          
          <div className="filter-container">
            <button 
              className="btn btn-secondary flex items-center gap-sm"
              onClick={toggleFilters}
            >
              <FiFilter size={18} />
              <span>Filters</span>
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="filters-panel mt-md pt-md" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  name="status" 
                  className="form-input" 
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Type</label>
                <select 
                  name="type" 
                  className="form-input" 
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Types</option>
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Min. Bedrooms</label>
                <input 
                  type="number" 
                  name="minBedrooms" 
                  className="form-input" 
                  placeholder="Any"
                  value={filters.minBedrooms}
                  onChange={handleFilterChange}
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Min. Bathrooms</label>
                <input 
                  type="number" 
                  name="minBathrooms" 
                  className="form-input" 
                  placeholder="Any"
                  value={filters.minBathrooms}
                  onChange={handleFilterChange}
                  min="0"
                  step="0.5"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Min. Price</label>
                <input 
                  type="number" 
                  name="minPrice" 
                  className="form-input" 
                  placeholder="No minimum"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Max. Price</label>
                <input 
                  type="number" 
                  name="maxPrice" 
                  className="form-input" 
                  placeholder="No maximum"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  min="0"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-md mt-md">
              <button 
                className="btn btn-secondary"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
              
              <button 
                className="btn btn-primary flex items-center gap-sm"
                onClick={applyFilters}
              >
                <FiCheck size={18} />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Properties grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-lg card">
          <FiHome size={48} className="text-tertiary mb-md mx-auto" />
          <h3 className="mb-sm">No properties found</h3>
          <p className="text-tertiary mb-md">
            {searchQuery || Object.values(filters).some(v => v !== 'all' && v !== '') ? 
              'Try adjusting your filters or search query.' : 
              'Add your first property to get started.'}
          </p>
          
          {searchQuery || Object.values(filters).some(v => v !== 'all' && v !== '') ? (
            <button 
              className="btn btn-secondary"
              onClick={resetFilters}
            >
              Clear Filters
            </button>
          ) : (
            <Link 
              to="/properties/new" 
              className="btn btn-primary flex items-center gap-sm"
              style={{ margin: '0 auto', display: 'inline-flex' }}
            >
              <FiPlus size={18} />
              <span>Add Property</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="properties-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filteredProperties.map((property) => (
            <Link 
              key={property.id} 
              to={`/properties/${property.id}`}
              className="property-card card transition-transform hover:shadow-lg hover:-translate-y-1"
              style={{ overflow: 'hidden', textDecoration: 'none', color: 'inherit' }}
            >
              <div className="property-image" style={{ position: 'relative' }}>
                <img 
                  src={property.mainImage} 
                  alt={property.title}
                  style={{ 
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover',
                    borderTopLeftRadius: 'var(--radius-md)',
                    borderTopRightRadius: 'var(--radius-md)'
                  }}
                />
                
                <div className="property-status" style={{ 
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: property.status === 'Active' ? '#4CAF50' : 
                                     property.status === 'Pending' ? '#FF9800' : '#9E9E9E',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'white'
                }}>
                  {property.status}
                </div>
                
                <div className="property-price" style={{ 
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  color: 'white'
                }}>
                  {formatPrice(property.price)}
                </div>
                
                <div className="property-type" style={{ 
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  color: 'white'
                }}>
                  {property.type}
                </div>
              </div>
              
              <div className="property-details p-md">
                <h3 className="property-title text-lg font-semibold mb-xs">{property.title}</h3>
                
                <div className="property-address text-tertiary mb-sm flex items-center gap-xs">
                  <FiMapPin size={14} />
                  <span>{property.address}, {property.city}, {property.state}</span>
                </div>
                
                <div className="property-specs flex justify-between text-sm mt-md">
                  <div className="flex items-center gap-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 22v-2a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v2H3z"/>
                      <path d="M8 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                      <path d="M17 13h.01"/>
                      <path d="M21 13h.01"/>
                      <path d="M21 7h.01"/>
                      <path d="M17 7h.01"/>
                      <path d="M17 17h.01"/>
                      <path d="M21 17h.01"/>
                    </svg>
                    <span>{property.bedrooms} Beds</span>
                  </div>
                  
                  <div className="flex items-center gap-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-6 9 6M3 9v6m9-6v12m9-12v6"/>
                      <rect x="3" y="15" width="18" height="4" rx="1"/>
                    </svg>
                    <span>{property.bathrooms} Baths</span>
                  </div>
                  
                  <div className="flex items-center gap-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <line x1="3" y1="9" x2="21" y2="9"/>
                      <line x1="9" y1="21" x2="9" y2="9"/>
                    </svg>
                    <span>{property.squareFeet.toLocaleString()} sqft</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Properties;