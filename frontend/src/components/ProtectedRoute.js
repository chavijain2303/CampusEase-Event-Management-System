// ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole'); // Store role during login
  const location = useLocation();

  // Prevent back button after logout
  useEffect(() => {
    if (!token) {
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = function() {
        window.history.pushState(null, '', window.location.href);
      };
    }
    return () => {
      window.onpopstate = null;
    };
  }, [token]);

  if (!token) {
    // Redirect to login but save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to unauthorized or home page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;