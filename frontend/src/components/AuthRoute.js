// AuthRoute.js (for login/signup pages)
import { Navigate } from 'react-router-dom';

const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // User is authenticated, redirect to appropriate dashboard
    const userRole = localStorage.getItem('userRole');
    return <Navigate to={userRole === 'admin' ? '/admin' : '/student-dashboard'} replace />;
  }
  
  return children;
};

export default AuthRoute;