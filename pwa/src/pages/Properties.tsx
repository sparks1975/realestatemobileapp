import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiEdit, FiTrash2, FiPlus, FiFilter, FiSearch } from 'react-icons/fi';
import apiClient from '../api/client';
import { Property } from '../types';

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  useEffect(() => {
    fetchProperties();
  }, []);
  
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/properties');
      setProperties(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteProperty = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }
    
    try {
      await apiClient.delete(`/api/properties/${id}`);
      // Remove from local state
      setProperties(properties.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('Failed to delete property. Please try again.');
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const filteredProperties = properties
    .filter(property => {
      // Apply status filter
      if (filterStatus !== 'all' && property.status !== filterStatus) {
        return false;
      }
      
      // Apply search query filter
      const query = searchQuery.toLowerCase();
      return (
        property.title.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query) ||
        property.state.toLowerCase().includes(query)
      );
    });
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="loading-text">Loading properties...</p>
      </div>
    );
  }
  
  return (
    <div className="properties">
      <div className="flex flex-col md:flex-row justify-between items-center mb-lg">
        <h1 className="page-title mb-sm md:mb-0">Properties</h1>
        
        <Link to="/properties/new" className="btn btn-primary flex items-center gap-sm">
          <FiPlus size={18} />
          <span>Add Property</span>
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row gap-md mb-lg">
        <div className="search-container flex-1 relative">
          <FiSearch size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-bg-elevated w-full py-sm px-lg pl-10 rounded-md border border-color-border"
          />
        </div>
        
        <div className="filter-container">
          <div className="flex items-center gap-sm bg-bg-elevated px-md py-sm rounded-md border border-color-border">
            <FiFilter size={18} className="text-tertiary" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent border-0 outline-none"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Sold">Sold</option>
              <option value="Off Market">Off Market</option>
            </select>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="text-center py-lg">
          <p className="text-error mb-md">{error}</p>
          <button className="btn btn-primary" onClick={fetchProperties}>
            Retry
          </button>
        </div>
      )}
      
      {!error && filteredProperties.length === 0 && (
        <div className="text-center py-lg">
          <FiHome size={48} className="text-tertiary mx-auto mb-md" />
          <p className="text-tertiary mb-md">No properties found</p>
          {searchQuery || filterStatus !== 'all' ? (
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
              }}
            >
              Clear Filters
            </button>
          ) : (
            <Link to="/properties/new" className="btn btn-primary flex items-center gap-sm justify-center mx-auto" style={{ width: 'fit-content' }}>
              <FiPlus size={18} />
              <span>Add Your First Property</span>
            </Link>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {filteredProperties.map((property) => (
          <div key={property.id} className="card hover:shadow-md transition-shadow">
            <div className="flex">
              <div className="property-image mr-md" style={{ width: '120px', height: '100px', overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}>
                <img 
                  src={property.mainImage} 
                  alt={property.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{property.title}</h3>
                  <div className={`status-badge py-xs px-sm rounded-pill text-xs ${
                    property.status === 'Active' ? 'bg-success text-black' :
                    property.status === 'Pending' ? 'bg-warning text-black' :
                    property.status === 'Sold' ? 'bg-info text-black' :
                    'bg-tertiary'
                  }`}>
                    {property.status}
                  </div>
                </div>
                
                <p className="text-secondary text-sm mb-xs">{property.address}, {property.city}, {property.state}</p>
                
                <div className="flex items-center gap-xl mb-sm">
                  <div className="text-tertiary text-sm">{property.bedrooms} bed</div>
                  <div className="text-tertiary text-sm">{property.bathrooms} bath</div>
                  <div className="text-tertiary text-sm">{property.squareFeet.toLocaleString()} sqft</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="price font-semibold gradient-text">{formatCurrency(property.price)}</div>
                  
                  <div className="actions flex gap-sm">
                    <Link to={`/properties/${property.id}/edit`} className="action-btn p-xs rounded-full hover:bg-bg-elevated">
                      <FiEdit size={16} className="text-secondary" />
                    </Link>
                    <button 
                      className="action-btn p-xs rounded-full hover:bg-bg-elevated"
                      onClick={() => handleDeleteProperty(property.id)}
                    >
                      <FiTrash2 size={16} className="text-error" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Properties;