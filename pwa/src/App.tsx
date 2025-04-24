import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { FiHome, FiList, FiCalendar, FiMessageCircle, FiUser } from 'react-icons/fi';

// Import pages
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import PropertyEdit from './pages/PropertyEdit';
import Schedule from './pages/Schedule';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// CSS imports
import './index.css';

const App = () => {
  const location = useLocation();
  const [isNavVisible, setIsNavVisible] = useState(true);

  // Hide bottom navigation on these routes
  useEffect(() => {
    const pathsWithoutNav = ['/login', '/register', '/chat/'];
    const shouldHideNav = pathsWithoutNav.some(path => 
      location.pathname === path || location.pathname.startsWith(path)
    );
    setIsNavVisible(!shouldHideNav);
  }, [location]);

  return (
    <div className="app">
      <div className="main-content">
        <Routes>
          {/* Dashboard routes */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Property routes */}
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/properties/new" element={<PropertyEdit />} />
          <Route path="/properties/:id/edit" element={<PropertyEdit />} />
          
          {/* Schedule route */}
          <Route path="/schedule" element={<Schedule />} />
          
          {/* Messages routes */}
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:userId" element={<Chat />} />
          
          {/* Profile route */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Catch-all and redirect routes */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
      
      {isNavVisible && (
        <div className="bottom-nav">
          <div className="nav-container">
            <NavLink to="/" icon={<FiHome size={22} />} label="Home" />
            <NavLink to="/properties" icon={<FiList size={22} />} label="Properties" />
            <NavLink to="/schedule" icon={<FiCalendar size={22} />} label="Schedule" />
            <NavLink to="/messages" icon={<FiMessageCircle size={22} />} label="Messages" />
            <NavLink to="/profile" icon={<FiUser size={22} />} label="Profile" />
          </div>
        </div>
      )}
    </div>
  );
};

// Bottom navigation link component
interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavLink = ({ to, icon, label }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
                   (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <a 
      href={to} 
      className={`nav-link ${isActive ? 'active' : ''}`}
      onClick={(e) => {
        // Only prevent default if we're not already on this route
        if (!isActive) {
          window.location.href = to;
        }
        e.preventDefault();
      }}
    >
      <div className="nav-icon">{icon}</div>
      <div className="nav-label">{label}</div>
    </a>
  );
};

export default App;