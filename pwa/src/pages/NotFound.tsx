import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="not-found-page flex flex-column items-center justify-center text-center" style={{ minHeight: '70vh' }}>
      <h1 className="text-accent" style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
      <h2 className="mb-md">Page Not Found</h2>
      <p className="text-secondary mb-lg">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary flex items-center gap-sm">
        <FiArrowLeft size={18} />
        <span>Back to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFound;