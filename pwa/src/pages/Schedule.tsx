import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiUser, FiHome } from 'react-icons/fi';
import apiClient from '../api/client';
import { Appointment } from '../types';

const Schedule = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  useEffect(() => {
    fetchAppointments();
  }, []);
  
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/appointments');
      setAppointments(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatTime = (dateString: Date | string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  const isTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear()
    );
  };
  
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };
  
  const getTodayAppointments = () => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return isToday(appointmentDate);
    });
  };
  
  const getTomorrowAppointments = () => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return isTomorrow(appointmentDate);
    });
  };
  
  const getSelectedDateAppointments = () => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return isSameDay(appointmentDate, selectedDate) && 
             !isToday(appointmentDate) && 
             !isTomorrow(appointmentDate);
    });
  };
  
  const todayAppointments = getTodayAppointments();
  const tomorrowAppointments = getTomorrowAppointments();
  const selectedDateAppointments = getSelectedDateAppointments();
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="loading-text">Loading appointments...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-lg">
        <p className="text-error mb-md">{error}</p>
        <button className="btn btn-primary" onClick={fetchAppointments}>
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="schedule-page">
      <h1 className="page-title mb-lg">Schedule</h1>
      
      <div className="schedule-container">
        {/* Calendar section to be implemented */}
        <div className="card mb-lg">
          <div className="text-center">
            <p className="mb-sm">Calendar component will be implemented here.</p>
            <p className="text-tertiary mb-md">You can select dates to view appointments.</p>
            
            {/* Placeholder for date selection */}
            <input 
              type="date" 
              className="form-input" 
              style={{ maxWidth: '250px' }}
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
          </div>
        </div>
        
        {/* Today's appointments */}
        <div className="appointment-section mb-lg">
          <h2 className="section-title mb-md flex items-center gap-sm">
            <FiCalendar className="text-accent" />
            <span>Today</span>
          </h2>
          
          {todayAppointments.length === 0 ? (
            <div className="card text-center py-md">
              <p className="text-tertiary">No appointments for today</p>
            </div>
          ) : (
            <div className="appointments-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card card">
                  <div className="appointment-time text-accent font-semibold mb-xs">
                    {formatTime(appointment.date)}
                  </div>
                  <div className="appointment-title font-semibold mb-sm">
                    {appointment.title}
                  </div>
                  <div className="appointment-details">
                    <div className="appointment-location flex items-center gap-sm mb-xs">
                      <FiMapPin />
                      <span>{appointment.location}</span>
                    </div>
                    {appointment.clientId && (
                      <div className="appointment-client flex items-center gap-sm mb-xs">
                        <FiUser />
                        <span>Client #{appointment.clientId}</span>
                      </div>
                    )}
                    {appointment.propertyId && (
                      <div className="appointment-property flex items-center gap-sm mb-xs">
                        <FiHome />
                        <span>Property #{appointment.propertyId}</span>
                      </div>
                    )}
                  </div>
                  {appointment.notes && (
                    <div className="appointment-notes mt-sm pt-sm" style={{ borderTop: '1px solid var(--color-border)' }}>
                      <p className="text-tertiary">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Tomorrow's appointments */}
        <div className="appointment-section mb-lg">
          <h2 className="section-title mb-md flex items-center gap-sm">
            <FiCalendar className="text-accent" />
            <span>Tomorrow</span>
          </h2>
          
          {tomorrowAppointments.length === 0 ? (
            <div className="card text-center py-md">
              <p className="text-tertiary">No appointments for tomorrow</p>
            </div>
          ) : (
            <div className="appointments-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {tomorrowAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card card">
                  <div className="appointment-time text-accent font-semibold mb-xs">
                    {formatTime(appointment.date)}
                  </div>
                  <div className="appointment-title font-semibold mb-sm">
                    {appointment.title}
                  </div>
                  <div className="appointment-details">
                    <div className="appointment-location flex items-center gap-sm mb-xs">
                      <FiMapPin />
                      <span>{appointment.location}</span>
                    </div>
                    {/* Other appointment details */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Selected date appointments */}
        {!isToday(selectedDate) && !isTomorrow(selectedDate) && (
          <div className="appointment-section">
            <h2 className="section-title mb-md flex items-center gap-sm">
              <FiCalendar className="text-accent" />
              <span>{formatDate(selectedDate)}</span>
            </h2>
            
            {selectedDateAppointments.length === 0 ? (
              <div className="card text-center py-md">
                <p className="text-tertiary">No appointments for this date</p>
              </div>
            ) : (
              <div className="appointments-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {selectedDateAppointments.map((appointment) => (
                  <div key={appointment.id} className="appointment-card card">
                    <div className="appointment-time text-accent font-semibold mb-xs">
                      {formatTime(appointment.date)}
                    </div>
                    <div className="appointment-title font-semibold mb-sm">
                      {appointment.title}
                    </div>
                    <div className="appointment-details">
                      <div className="appointment-location flex items-center gap-sm mb-xs">
                        <FiMapPin />
                        <span>{appointment.location}</span>
                      </div>
                      {/* Other appointment details */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;