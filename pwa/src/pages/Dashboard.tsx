import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiHome, FiMessageSquare, FiTrendingUp, FiUsers, FiDollarSign, FiActivity } from 'react-icons/fi';
import apiClient from '../api/client';
import { Property, Appointment, Activity } from '../types';

const Dashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [statistics, setStatistics] = useState({
    activeListings: 0,
    pendingSales: 0,
    closedSales: 0,
    newLeads: 0
  });
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [portfolioValueChange, setPortfolioValueChange] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all the data in parallel
      const [
        propertiesRes,
        appointmentsRes,
        activitiesRes,
        statisticsRes,
        portfolioValueRes
      ] = await Promise.all([
        apiClient.get('/api/properties'),
        apiClient.get('/api/appointments'),
        apiClient.get('/api/activities'),
        apiClient.get('/api/statistics'),
        apiClient.get('/api/portfolio-value')
      ]);
      
      setProperties(propertiesRes.data);
      setAppointments(appointmentsRes.data);
      setActivities(activitiesRes.data);
      setStatistics(statisticsRes.data);
      setPortfolioValue(portfolioValueRes.data.value);
      setPortfolioValueChange(portfolioValueRes.data.change);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatTime = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-lg">
        <p className="text-error mb-md">{error}</p>
        <button className="btn btn-primary" onClick={fetchDashboardData}>
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="dashboard-page">
      <h1 className="page-title">Dashboard</h1>
      
      {/* Portfolio Value section */}
      <div className="card mb-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg text-tertiary mb-xs">Portfolio Value</h2>
            <div className="flex items-center gap-sm">
              <p className="text-xxl font-bold gradient-text">
                {formatCurrency(portfolioValue)}
              </p>
              <span className={portfolioValueChange >= 0 ? 'text-success' : 'text-error'}>
                {portfolioValueChange > 0 ? '+' : ''}{portfolioValueChange.toFixed(1)}%
              </span>
            </div>
            <p className="text-tertiary text-sm">Overall portfolio performance</p>
          </div>
          
          <div className="flex-none mt-md md:mt-0">
            <Link to="/properties" className="btn btn-primary">
              View Properties
            </Link>
          </div>
        </div>
      </div>
      
      {/* Statistics cards */}
      <div className="statistics-grid mb-lg" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="stat-card card">
          <div className="flex items-center gap-sm mb-sm">
            <div className="stat-icon" style={{ 
              backgroundColor: 'rgba(203, 163, 40, 0.1)', 
              color: 'var(--color-accent-primary)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiHome size={18} />
            </div>
            <h3 className="stat-title text-tertiary">Active Listings</h3>
          </div>
          <p className="stat-value text-xl font-bold">{statistics.activeListings}</p>
        </div>
        
        <div className="stat-card card">
          <div className="flex items-center gap-sm mb-sm">
            <div className="stat-icon" style={{ 
              backgroundColor: 'rgba(203, 163, 40, 0.1)', 
              color: 'var(--color-accent-primary)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiTrendingUp size={18} />
            </div>
            <h3 className="stat-title text-tertiary">Pending Sales</h3>
          </div>
          <p className="stat-value text-xl font-bold">{statistics.pendingSales}</p>
        </div>
        
        <div className="stat-card card">
          <div className="flex items-center gap-sm mb-sm">
            <div className="stat-icon" style={{ 
              backgroundColor: 'rgba(203, 163, 40, 0.1)', 
              color: 'var(--color-accent-primary)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiDollarSign size={18} />
            </div>
            <h3 className="stat-title text-tertiary">Closed Sales</h3>
          </div>
          <p className="stat-value text-xl font-bold">{statistics.closedSales}</p>
        </div>
        
        <div className="stat-card card">
          <div className="flex items-center gap-sm mb-sm">
            <div className="stat-icon" style={{ 
              backgroundColor: 'rgba(203, 163, 40, 0.1)', 
              color: 'var(--color-accent-primary)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FiUsers size={18} />
            </div>
            <h3 className="stat-title text-tertiary">New Leads</h3>
          </div>
          <p className="stat-value text-xl font-bold">{statistics.newLeads}</p>
        </div>
      </div>
      
      {/* Two-column layout for desktop, single column for mobile */}
      <div className="dashboard-columns" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {/* Upcoming Appointments */}
        <div className="card">
          <div className="flex justify-between items-center mb-md">
            <h2 className="section-title mb-0 flex items-center gap-sm">
              <FiCalendar className="text-accent" />
              <span>Upcoming Appointments</span>
            </h2>
            <Link to="/schedule" className="text-accent text-sm">View All</Link>
          </div>
          
          {appointments.length === 0 ? (
            <div className="text-center py-md">
              <p className="text-tertiary">No upcoming appointments</p>
            </div>
          ) : (
            <div className="appointments-list">
              {appointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="appointment-item mb-md pb-md" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <div className="flex justify-between mb-xs">
                    <span className="font-semibold">{appointment.title}</span>
                    <span className="text-accent">{formatDate(appointment.date)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-tertiary">{appointment.location}</span>
                    <span className="text-tertiary">{formatTime(appointment.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Recent Activity */}
        <div className="card">
          <div className="flex justify-between items-center mb-md">
            <h2 className="section-title mb-0 flex items-center gap-sm">
              <FiActivity className="text-accent" />
              <span>Recent Activity</span>
            </h2>
          </div>
          
          {activities.length === 0 ? (
            <div className="text-center py-md">
              <p className="text-tertiary">No recent activities</p>
            </div>
          ) : (
            <div className="activities-list">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="activity-item mb-md pb-md" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <div className="flex items-center gap-sm mb-xs">
                    <div className="activity-icon" style={{ 
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(203, 163, 40, 0.1)',
                      color: 'var(--color-accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {activity.type === 'property' && <FiHome size={14} />}
                      {activity.type === 'appointment' && <FiCalendar size={14} />}
                      {activity.type === 'message' && <FiMessageSquare size={14} />}
                      {activity.type === 'client' && <FiUsers size={14} />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{activity.title}</div>
                      <div className="text-tertiary text-sm">{activity.description}</div>
                    </div>
                    <div className="text-tertiary text-sm">
                      {formatDate(activity.createdAt || new Date())}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;