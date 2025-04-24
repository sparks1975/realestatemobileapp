import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FiHome, FiList, FiCalendar, FiMessageSquare, FiUser, FiMoon, FiSun } from 'react-icons/fi';

// Pages
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Schedule from './pages/Schedule';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// API
import apiClient from './api/client';

// Types
import { User } from './types';

// Styles
import './App.css';

// Navigation component with active route highlighting
const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;
  
  return (
    <div className="bottom-nav">
      <Link to="/" className={`nav-item ${path === '/' ? 'active' : ''}`}>
        <FiHome size={24} />
        <span className="nav-label">Home</span>
      </Link>
      <Link to="/properties" className={`nav-item ${path.includes('/properties') ? 'active' : ''}`}>
        <FiList size={24} />
        <span className="nav-label">Properties</span>
      </Link>
      <Link to="/schedule" className={`nav-item ${path === '/schedule' ? 'active' : ''}`}>
        <FiCalendar size={24} />
        <span className="nav-label">Schedule</span>
      </Link>
      <Link to="/messages" className={`nav-item ${path === '/messages' ? 'active' : ''}`}>
        <FiMessageSquare size={24} />
        <span className="nav-label">Messages</span>
      </Link>
      <Link to="/profile" className={`nav-item ${path === '/profile' ? 'active' : ''}`}>
        <FiUser size={24} />
        <span className="nav-label">Profile</span>
      </Link>
    </div>
  );
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Always default to dark mode
  
  useEffect(() => {
    // Apply dark mode class to body
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.body.classList.toggle('light-mode', !isDarkMode);
    
    // Set theme meta tag for mobile
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDarkMode ? '#0C0C0C' : '#ffffff');
    }
  }, [isDarkMode]);
  
  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/auth/user');
        setUser(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);
  
  return (
    <Router>
      <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <header className="app-header">
          <h1 className="app-title">Realtor Dashboard</h1>
          <button 
            className="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>
        </header>
        
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;