import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no specific roles are required, allow any authenticated user
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user has required role
  if (user && allowedRoles.includes(user.role)) {
    return children;
  }

  // Redirect to unauthorized page if user doesn't have required role
  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute; 