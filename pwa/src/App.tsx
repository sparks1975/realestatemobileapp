import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
// Import pages
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import PropertyEdit from './pages/PropertyEdit';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import Schedule from './pages/Schedule';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Import icons from react-icons (replacing Expo vector icons)
import { FiHome, FiGrid, FiMessageCircle, FiCalendar, FiUser } from 'react-icons/fi';

// Bottom Navigation Component for mobile
const BottomNav = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Check if the current path matches or starts with the given path
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="bottom-nav show-on-mobile">
      <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}>
        <FiHome className="bottom-nav-icon" />
        <span className="bottom-nav-label">Home</span>
      </Link>
      <Link to="/properties" className={`bottom-nav-item ${isActive('/properties') ? 'active' : ''}`}>
        <FiGrid className="bottom-nav-icon" />
        <span className="bottom-nav-label">Properties</span>
      </Link>
      <Link to="/messages" className={`bottom-nav-item ${isActive('/messages') ? 'active' : ''}`}>
        <FiMessageCircle className="bottom-nav-icon" />
        <span className="bottom-nav-label">Messages</span>
      </Link>
      <Link to="/schedule" className={`bottom-nav-item ${isActive('/schedule') ? 'active' : ''}`}>
        <FiCalendar className="bottom-nav-icon" />
        <span className="bottom-nav-label">Schedule</span>
      </Link>
      <Link to="/profile" className={`bottom-nav-item ${isActive('/profile') ? 'active' : ''}`}>
        <FiUser className="bottom-nav-icon" />
        <span className="bottom-nav-label">Profile</span>
      </Link>
    </div>
  );
};

// Sidebar Component for desktop
const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Check if the current path matches or starts with the given path
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="sidebar hide-on-mobile">
      <h1 className="nav-logo mb-lg">Realtor</h1>
      <nav>
        <ul className="flex flex-column gap-md">
          <li>
            <Link to="/" className={`flex items-center gap-sm ${isActive('/') ? 'text-accent' : 'text-secondary'}`}>
              <FiHome size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/properties" className={`flex items-center gap-sm ${isActive('/properties') ? 'text-accent' : 'text-secondary'}`}>
              <FiGrid size={20} />
              <span>Properties</span>
            </Link>
          </li>
          <li>
            <Link to="/messages" className={`flex items-center gap-sm ${isActive('/messages') ? 'text-accent' : 'text-secondary'}`}>
              <FiMessageCircle size={20} />
              <span>Messages</span>
            </Link>
          </li>
          <li>
            <Link to="/schedule" className={`flex items-center gap-sm ${isActive('/schedule') ? 'text-accent' : 'text-secondary'}`}>
              <FiCalendar size={20} />
              <span>Schedule</span>
            </Link>
          </li>
          <li>
            <Link to="/profile" className={`flex items-center gap-sm ${isActive('/profile') ? 'text-accent' : 'text-secondary'}`}>
              <FiUser size={20} />
              <span>Profile</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

function App() {
  // Check if the app is online
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Update online status when it changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Show offline message if the app is offline
  if (!isOnline) {
    return (
      <div className="app-container">
        <div className="flex items-center justify-center" style={{ minHeight: '100vh', textAlign: 'center', padding: '2rem' }}>
          <div>
            <h1>You're Offline</h1>
            <p>Please check your internet connection and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/properties/:id/edit" element={<PropertyEdit />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:id" element={<Chat />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;