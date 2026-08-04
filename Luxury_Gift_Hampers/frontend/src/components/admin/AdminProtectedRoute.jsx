import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAdminAuth from '../../hooks/admin/useAdminAuth';

export const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-light">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;
