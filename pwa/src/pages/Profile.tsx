import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit2 } from 'react-icons/fi';
import apiClient from '../api/client';
import { User } from '../types';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/users/me');
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="text-center py-lg">
        <p className="text-error mb-md">{error || 'Profile information not available'}</p>
        <button className="btn btn-primary" onClick={fetchUserProfile}>
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="profile-page">
      <h1 className="page-title mb-lg">Profile</h1>
      
      <div className="profile-container">
        <div className="card mb-lg">
          <div className="flex flex-column items-center mb-lg">
            <div className="profile-avatar mb-md" style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              overflow: 'hidden',
              border: '4px solid var(--color-accent-primary)'
            }}>
              <img 
                src={user.profileImage || 'https://via.placeholder.com/200x200?text=User'} 
                alt={user.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h2 className="profile-name mb-xs">{user.name}</h2>
            <p className="profile-role text-accent">{user.role || 'Realtor'}</p>
          </div>
          
          <div className="profile-info">
            <div className="profile-info-item flex items-center gap-md mb-md">
              <div className="profile-info-icon" style={{ minWidth: '24px' }}>
                <FiUser size={24} color="var(--color-accent-primary)" />
              </div>
              <div>
                <div className="profile-info-label text-tertiary">Username</div>
                <div className="profile-info-value">{user.username}</div>
              </div>
            </div>
            
            <div className="profile-info-item flex items-center gap-md mb-md">
              <div className="profile-info-icon" style={{ minWidth: '24px' }}>
                <FiMail size={24} color="var(--color-accent-primary)" />
              </div>
              <div>
                <div className="profile-info-label text-tertiary">Email</div>
                <div className="profile-info-value">{user.email}</div>
              </div>
            </div>
            
            <div className="profile-info-item flex items-center gap-md mb-md">
              <div className="profile-info-icon" style={{ minWidth: '24px' }}>
                <FiPhone size={24} color="var(--color-accent-primary)" />
              </div>
              <div>
                <div className="profile-info-label text-tertiary">Phone</div>
                <div className="profile-info-value">{user.phone || 'Not provided'}</div>
              </div>
            </div>
            
            <div className="profile-info-item flex items-center gap-md">
              <div className="profile-info-icon" style={{ minWidth: '24px' }}>
                <FiCalendar size={24} color="var(--color-accent-primary)" />
              </div>
              <div>
                <div className="profile-info-label text-tertiary">Member Since</div>
                <div className="profile-info-value">{formatDate(user.createdAt)}</div>
              </div>
            </div>
          </div>
          
          <div className="profile-actions mt-lg">
            <button className="btn btn-primary flex items-center gap-sm">
              <FiEdit2 size={18} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
        
        <div className="card">
          <h3 className="mb-md">Account Settings</h3>
          
          <div className="settings-section mb-md">
            <h4 className="settings-title mb-sm">Notifications</h4>
            <div className="setting-item flex items-center justify-between mb-sm">
              <div>Email Notifications</div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="setting-item flex items-center justify-between mb-sm">
              <div>SMS Notifications</div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="setting-item flex items-center justify-between">
              <div>Push Notifications</div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          
          <div className="settings-section">
            <h4 className="settings-title mb-sm">Security</h4>
            <button className="btn btn-secondary mb-sm w-full text-left">Change Password</button>
            <button className="btn btn-secondary w-full text-left">Two-Factor Authentication</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;