import { useState, useEffect, ChangeEvent } from 'react';
import { FiUser, FiMail, FiPhone, FiEdit2, FiCamera, FiCheck } from 'react-icons/fi';
import apiClient from '../api/client';
import { User } from '../types';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/profile');
      setUser(response.data);
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        bio: response.data.bio || ''
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await apiClient.patch('/api/profile', formData);
      setUser(response.data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: ''
      });
    }
    setIsEditing(false);
  };
  
  const handleProfileImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const formData = new FormData();
    formData.append('profileImage', file);
    
    try {
      setSaving(true);
      const response = await apiClient.post('/api/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setUser(prev => prev ? { ...prev, profileImage: response.data.profileImage } : null);
      setError(null);
    } catch (err) {
      console.error('Error uploading profile image:', err);
      setError('Failed to upload profile image. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-lg">
        <p className="text-error mb-md">{error}</p>
        <button className="btn btn-primary" onClick={fetchProfile}>
          Retry
        </button>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="text-center py-lg">
        <p className="text-error mb-md">User profile not found</p>
      </div>
    );
  }
  
  return (
    <div className="profile-page">
      <h1 className="page-title">Profile</h1>
      
      <div className="card mb-lg">
        <div className="flex flex-col md:flex-row gap-lg">
          {/* Profile image section */}
          <div className="profile-image-container text-center">
            <div className="profile-image-wrapper mb-md" style={{ 
              position: 'relative',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto'
            }}>
              <img 
                src={user.profileImage || 'https://via.placeholder.com/150?text=User'} 
                alt={user.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              
              <label className="image-upload-button" style={{ 
                position: 'absolute',
                bottom: '0',
                right: '0',
                backgroundColor: 'var(--color-accent-primary)',
                color: '#000000',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <FiCamera size={18} />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleProfileImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            
            <h2 className="text-lg font-semibold mb-xs">{user.name}</h2>
            <p className="text-tertiary">{user.role || 'Realtor'}</p>
          </div>
          
          {/* Profile details section */}
          <div className="profile-details flex-1">
            <div className="flex justify-between items-center mb-md">
              <h2 className="section-title mb-0">Personal Information</h2>
              
              {isEditing ? (
                <div className="flex gap-sm">
                  <button 
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary flex items-center gap-sm"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <FiCheck size={18} />
                    <span>Save</span>
                  </button>
                </div>
              ) : (
                <button 
                  className="btn btn-secondary flex items-center gap-sm"
                  onClick={() => setIsEditing(true)}
                >
                  <FiEdit2 size={18} />
                  <span>Edit</span>
                </button>
              )}
            </div>
            
            {isEditing ? (
              <div className="profile-form">
                <div className="form-group mb-md">
                  <label className="form-label" htmlFor="name">Full Name</label>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <FiUser style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      className="form-input" 
                      value={formData.name}
                      onChange={handleInputChange}
                      style={{ paddingLeft: '36px' }}
                    />
                  </div>
                </div>
                
                <div className="form-group mb-md">
                  <label className="form-label" htmlFor="email">Email</label>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <FiMail style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      className="form-input" 
                      value={formData.email}
                      onChange={handleInputChange}
                      style={{ paddingLeft: '36px' }}
                    />
                  </div>
                </div>
                
                <div className="form-group mb-md">
                  <label className="form-label" htmlFor="phone">Phone</label>
                  <div className="input-with-icon" style={{ position: 'relative' }}>
                    <FiPhone style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      className="form-input" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={{ paddingLeft: '36px' }}
                    />
                  </div>
                </div>
                
                <div className="form-group mb-md">
                  <label className="form-label" htmlFor="bio">Bio</label>
                  <textarea 
                    id="bio" 
                    name="bio" 
                    className="form-input" 
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Write a short bio about yourself"
                  ></textarea>
                </div>
              </div>
            ) : (
              <div className="profile-info">
                <div className="info-item flex items-center gap-md mb-md">
                  <div className="info-icon" style={{ 
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(203, 163, 40, 0.1)',
                    color: 'var(--color-accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FiUser size={20} />
                  </div>
                  <div>
                    <div className="text-tertiary text-sm">Full Name</div>
                    <div className="font-semibold">{user.name}</div>
                  </div>
                </div>
                
                <div className="info-item flex items-center gap-md mb-md">
                  <div className="info-icon" style={{ 
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(203, 163, 40, 0.1)',
                    color: 'var(--color-accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FiMail size={20} />
                  </div>
                  <div>
                    <div className="text-tertiary text-sm">Email</div>
                    <div className="font-semibold">{user.email}</div>
                  </div>
                </div>
                
                <div className="info-item flex items-center gap-md mb-md">
                  <div className="info-icon" style={{ 
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(203, 163, 40, 0.1)',
                    color: 'var(--color-accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FiPhone size={20} />
                  </div>
                  <div>
                    <div className="text-tertiary text-sm">Phone</div>
                    <div className="font-semibold">{user.phone || 'Not provided'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;