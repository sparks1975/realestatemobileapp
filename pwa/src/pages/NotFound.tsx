import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="not-found flex flex-col items-center justify-center py-xl">
      <FiAlertTriangle size={64} className="text-warning mb-md" />
      
      <h1 className="text-xl font-bold mb-sm">Page Not Found</h1>
      
      <p className="text-tertiary text-center mb-lg" style={{ maxWidth: '400px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link to="/" className="btn btn-primary flex items-center gap-sm">
        <FiHome size={18} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFound;