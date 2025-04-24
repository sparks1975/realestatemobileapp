import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUp, FiArrowDown, FiHome, FiClock, FiDollarSign, FiUsers, FiActivity } from 'react-icons/fi';
import { Property, Appointment, Activity } from '../types';
import apiClient from '../api/client';

interface DashboardData {
  portfolioValue: number;
  statistics: {
    activeListings: number;
    pendingSales: number;
    closedSales: number;
    newLeads: number;
  };
  activities: Activity[];
  todayAppointments: Appointment[];
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/dashboard');
      setData(response.data);
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
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatTime = (dateString: string | Date) => {
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
        <p className="loading-text">Loading dashboard data...</p>
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="text-center py-lg">
        <p className="text-error mb-md">{error || 'No data available'}</p>
        <button className="btn btn-primary" onClick={fetchDashboardData}>
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="dashboard-page">
      <h1 className="page-title mb-lg">Dashboard</h1>
      
      {/* Portfolio value */}
      <div className="card mb-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="mb-sm text-tertiary">Portfolio Value</h3>
            <div className="text-3xl">{formatCurrency(data.portfolioValue)}</div>
          </div>
          <div className="portfolio-change flex items-center" style={{ color: 'var(--color-success)' }}>
            <FiArrowUp />
            <span>2.4%</span>
          </div>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="statistics-grid mb-lg" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        <div className="card">
          <div className="flex items-center gap-md mb-sm">
            <div className="icon-bg" style={{ backgroundColor: 'rgba(0, 122, 255, 0.1)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiHome size={20} color="var(--color-accent-primary)" />
            </div>
            <h3 className="text-tertiary">Active Listings</h3>
          </div>
          <div className="text-2xl">{data.statistics.activeListings}</div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-md mb-sm">
            <div className="icon-bg" style={{ backgroundColor: 'rgba(255, 149, 0, 0.1)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiClock size={20} color="var(--color-warning)" />
            </div>
            <h3 className="text-tertiary">Pending Sales</h3>
          </div>
          <div className="text-2xl">{data.statistics.pendingSales}</div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-md mb-sm">
            <div className="icon-bg" style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiDollarSign size={20} color="var(--color-success)" />
            </div>
            <h3 className="text-tertiary">Closed Sales</h3>
          </div>
          <div className="text-2xl">{data.statistics.closedSales}</div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-md mb-sm">
            <div className="icon-bg" style={{ backgroundColor: 'rgba(90, 200, 250, 0.1)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiUsers size={20} color="#5AC8FA" />
            </div>
            <h3 className="text-tertiary">New Leads</h3>
          </div>
          <div className="text-2xl">{data.statistics.newLeads}</div>
        </div>
      </div>
      
      <div className="dashboard-columns" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Recent Activities */}
        <div className="recent-activities">
          <h2 className="mb-md">Recent Activities</h2>
          <div className="card" style={{ height: '400px', overflow: 'auto' }}>
            {data.activities.length === 0 ? (
              <p className="text-tertiary text-center py-md">No recent activities</p>
            ) : (
              <div className="activities-list">
                {data.activities.map((activity) => (
                  <div key={activity.id} className="activity-item flex gap-md mb-md pb-md" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <div className="activity-icon" style={{ minWidth: '40px' }}>
                      <div className="icon-bg" style={{ backgroundColor: 'rgba(203, 163, 40, 0.1)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiActivity size={20} color="var(--color-accent-secondary)" />
                      </div>
                    </div>
                    <div className="activity-content">
                      <div className="activity-title font-semibold">{activity.title}</div>
                      <div className="activity-description text-secondary">{activity.description}</div>
                      <div className="activity-time text-tertiary text-sm">
                        {activity.createdAt && formatDate(activity.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Today's Appointments */}
        <div className="today-appointments">
          <h2 className="mb-md">Today's Appointments</h2>
          <div className="card" style={{ height: '400px', overflow: 'auto' }}>
            {data.todayAppointments.length === 0 ? (
              <p className="text-tertiary text-center py-md">No appointments scheduled for today</p>
            ) : (
              <div className="appointments-list">
                {data.todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="appointment-item mb-md pb-md" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <div className="appointment-time text-accent font-semibold">
                      {formatTime(appointment.date)}
                    </div>
                    <div className="appointment-title font-semibold mb-xs">
                      {appointment.title}
                    </div>
                    <div className="appointment-location text-secondary mb-xs">
                      {appointment.location}
                    </div>
                    {appointment.notes && (
                      <div className="appointment-notes text-tertiary text-sm">
                        {appointment.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;