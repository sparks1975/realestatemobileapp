import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiPieChart, FiTrendingUp, FiCalendar, FiActivity, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import apiClient from '../api/client';
import { DashboardData, Activity, Appointment, Property } from '../types';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/dashboard');
      setDashboardData(response.data);
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
  
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="loading-text">Loading dashboard data...</p>
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
  
  if (!dashboardData) {
    return (
      <div className="text-center py-lg">
        <p className="text-tertiary mb-md">No dashboard data available.</p>
        <button className="btn btn-primary" onClick={fetchDashboardData}>
          Refresh
        </button>
      </div>
    );
  }
  
  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>
      
      {/* Portfolio Value */}
      <div className="card mb-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h3 className="text-lg font-semibold mb-xs">Portfolio Value</h3>
            <div className="flex items-center gap-sm">
              <span className="text-xxl font-bold gradient-text">
                {formatCurrency(dashboardData.portfolioValue)}
              </span>
              <div className={`flex items-center ${dashboardData.portfolioValueChange >= 0 ? 'text-success' : 'text-error'}`}>
                {dashboardData.portfolioValueChange >= 0 ? (
                  <FiArrowUp size={16} />
                ) : (
                  <FiArrowDown size={16} />
                )}
                <span className="font-semibold ml-1">
                  {Math.abs(dashboardData.portfolioValueChange).toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="text-tertiary text-sm mt-xs">Total portfolio value</p>
          </div>
          
          <div className="mt-md md:mt-0 flex gap-md">
            <Link to="/properties" className="btn btn-secondary flex items-center gap-sm">
              <FiHome size={18} />
              <span>View Properties</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Key Statistics */}
      <div className="section-title">Key Statistics</div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-lg">
        <div className="card">
          <div className="flex flex-col items-center">
            <div className="stat-icon mb-sm" style={{ backgroundColor: 'rgba(75, 192, 192, 0.2)', padding: '12px', borderRadius: '50%' }}>
              <FiHome size={24} style={{ color: 'rgb(75, 192, 192)' }} />
            </div>
            <span className="text-xl font-bold">{dashboardData.statistics.activeListings}</span>
            <span className="text-tertiary text-sm">Active Listings</span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex flex-col items-center">
            <div className="stat-icon mb-sm" style={{ backgroundColor: 'rgba(255, 159, 64, 0.2)', padding: '12px', borderRadius: '50%' }}>
              <FiPieChart size={24} style={{ color: 'rgb(255, 159, 64)' }} />
            </div>
            <span className="text-xl font-bold">{dashboardData.statistics.pendingSales}</span>
            <span className="text-tertiary text-sm">Pending Sales</span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex flex-col items-center">
            <div className="stat-icon mb-sm" style={{ backgroundColor: 'rgba(75, 192, 75, 0.2)', padding: '12px', borderRadius: '50%' }}>
              <FiTrendingUp size={24} style={{ color: 'rgb(75, 192, 75)' }} />
            </div>
            <span className="text-xl font-bold">{dashboardData.statistics.closedSales}</span>
            <span className="text-tertiary text-sm">Closed Sales</span>
          </div>
        </div>
        
        <div className="card">
          <div className="flex flex-col items-center">
            <div className="stat-icon mb-sm" style={{ backgroundColor: 'rgba(54, 162, 235, 0.2)', padding: '12px', borderRadius: '50%' }}>
              <FiActivity size={24} style={{ color: 'rgb(54, 162, 235)' }} />
            </div>
            <span className="text-xl font-bold">{dashboardData.statistics.newLeads}</span>
            <span className="text-tertiary text-sm">New Leads</span>
          </div>
        </div>
      </div>
      
      {/* Today's Appointments */}
      <div className="section-title">Today's Appointments</div>
      <div className="card mb-lg">
        {dashboardData.todayAppointments.length === 0 ? (
          <div className="text-center py-md">
            <FiCalendar size={32} className="text-tertiary mb-sm mx-auto" />
            <p className="text-tertiary">No appointments scheduled for today</p>
          </div>
        ) : (
          <div className="space-y-md">
            {dashboardData.todayAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-start gap-md" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-md)' }}>
                <div className="appointment-time flex flex-col items-center justify-center" style={{ minWidth: '60px' }}>
                  <span className="text-sm font-semibold">
                    {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold mb-xs">{appointment.title}</h4>
                  <p className="text-tertiary text-sm mb-xs">{appointment.location}</p>
                  {appointment.notes && (
                    <p className="text-secondary text-sm">{appointment.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Recent Activities */}
      <div className="section-title">Recent Activities</div>
      <div className="card">
        {dashboardData.activities.length === 0 ? (
          <div className="text-center py-md">
            <FiActivity size={32} className="text-tertiary mb-sm mx-auto" />
            <p className="text-tertiary">No recent activities</p>
          </div>
        ) : (
          <div className="space-y-md">
            {dashboardData.activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-md" style={{ borderBottom: activity !== dashboardData.activities[dashboardData.activities.length - 1] ? '1px solid var(--color-border)' : 'none', paddingBottom: 'var(--spacing-md)' }}>
                <div className="activity-icon flex flex-col items-center justify-center" style={{ minWidth: '40px' }}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold mb-xs">{activity.title}</h4>
                  <p className="text-secondary text-sm mb-xs">{activity.description}</p>
                  <p className="text-tertiary text-sm">
                    {activity.createdAt ? formatDate(activity.createdAt) : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get activity icon based on type
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'listing':
      return <FiHome size={18} style={{ color: 'rgb(75, 192, 192)' }} />;
    case 'lead':
      return <FiActivity size={18} style={{ color: 'rgb(54, 162, 235)' }} />;
    case 'property_update':
      return <FiPieChart size={18} style={{ color: 'rgb(255, 159, 64)' }} />;
    case 'appointment':
      return <FiCalendar size={18} style={{ color: 'rgb(75, 192, 75)' }} />;
    case 'message':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgb(153, 102, 255)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    default:
      return <FiActivity size={18} style={{ color: 'var(--color-text-tertiary)' }} />;
  }
};

export default Dashboard;