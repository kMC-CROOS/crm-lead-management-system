import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';

function ProtectedRoute({ children }) {
  const isAuth = isAuthenticated();
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
