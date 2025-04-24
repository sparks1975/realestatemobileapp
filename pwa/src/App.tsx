import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { FiHome, FiCalendar, FiMessageSquare, FiUser, FiMenu, FiX } from 'react-icons/fi';

// Import page components
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import PropertyEdit from './pages/PropertyEdit';
import Schedule from './pages/Schedule';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  }, [location]);
  
  // Determine if the current route is active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="app-container">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="container flex justify-between items-center py-md">
          <button className="menu-toggle btn btn-icon" onClick={toggleSidebar}>
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <h1 className="site-title">Realtor Dashboard</h1>
          <div className="w-10"></div> {/* Empty space for balance */}
        </div>
      </header>
      
      <div className="main-content">
        {/* Sidebar Navigation */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header py-lg px-md">
            <h2 className="gradient-text">Realtor Dashboard</h2>
          </div>
          
          <nav className="sidebar-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link 
                  to="/" 
                  className={`nav-link flex items-center gap-sm px-md py-sm ${isActive('/') ? 'active' : ''}`}
                >
                  <FiHome className="nav-icon" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/properties" 
                  className={`nav-link flex items-center gap-sm px-md py-sm ${isActive('/properties') ? 'active' : ''}`}
                >
                  <FiHome className="nav-icon" />
                  <span>Properties</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/schedule" 
                  className={`nav-link flex items-center gap-sm px-md py-sm ${isActive('/schedule') ? 'active' : ''}`}
                >
                  <FiCalendar className="nav-icon" />
                  <span>Schedule</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/messages" 
                  className={`nav-link flex items-center gap-sm px-md py-sm ${isActive('/messages') ? 'active' : ''}`}
                >
                  <FiMessageSquare className="nav-icon" />
                  <span>Messages</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/profile" 
                  className={`nav-link flex items-center gap-sm px-md py-sm ${isActive('/profile') ? 'active' : ''}`}
                >
                  <FiUser className="nav-icon" />
                  <span>Profile</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main Content Area */}
        <main className="content-area">
          <div className="page-container">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/properties/:id/edit" element={<PropertyEdit />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/messages/:id" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="bottom-nav-content">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <FiHome size={20} />
            <span className="text-sm">Home</span>
          </Link>
          <Link to="/properties" className={`nav-link ${isActive('/properties') ? 'active' : ''}`}>
            <FiHome size={20} />
            <span className="text-sm">Properties</span>
          </Link>
          <Link to="/schedule" className={`nav-link ${isActive('/schedule') ? 'active' : ''}`}>
            <FiCalendar size={20} />
            <span className="text-sm">Schedule</span>
          </Link>
          <Link to="/messages" className={`nav-link ${isActive('/messages') ? 'active' : ''}`}>
            <FiMessageSquare size={20} />
            <span className="text-sm">Messages</span>
          </Link>
          <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
            <FiUser size={20} />
            <span className="text-sm">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default App;