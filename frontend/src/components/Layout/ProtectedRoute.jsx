// src/components/Layout/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ children, roles }) => {
  const { auth } = useAuth();

  if (auth.loading) {
    // Optionally, display a loading spinner or placeholder
    return <div>Loading...</div>;
  }

  if (!auth.user) {
    // Not authenticated
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(auth.user.role)) {
    // Role not authorized
    return <Navigate to="/" replace />;
  }

  // Authorized
  return children;
};

export default ProtectedRoute;
