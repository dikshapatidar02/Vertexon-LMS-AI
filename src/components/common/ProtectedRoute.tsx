import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  allowedRoles?: ('student' | 'instructor' | 'admin')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to proper role dashboard if attempting to access unauthorized route
    if (user.role === 'admin') return <Navigate to="/admin-panel" replace />;
    if (user.role === 'instructor') return <Navigate to="/instructor-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
