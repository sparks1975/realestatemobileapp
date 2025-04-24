import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="not-found-page text-center py-xl">
      <div className="container">
        <h1 className="text-xxl font-bold mb-md gradient-text">404</h1>
        <h2 className="text-xl mb-lg">Page Not Found</h2>
        
        <p className="text-secondary mb-lg">
          The page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex items-center justify-center gap-md">
          <Link to="/" className="btn btn-primary flex items-center gap-sm">
            <FiHome size={18} />
            <span>Go to Dashboard</span>
          </Link>
          
          <button
            className="btn btn-secondary flex items-center gap-sm"
            onClick={() => window.history.back()}
          >
            <FiArrowLeft size={18} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;