import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check if user has the right role
  if (allowedRoles.length > 0) {
    const userRole = user.role.toLowerCase();
    const hasPermission = allowedRoles.some(role => role.toLowerCase() === userRole);
    
    if (!hasPermission) {
      // Redirect to appropriate dashboard based on user's actual role
      switch (userRole) {
        case 'admin':
          return <Navigate to="/admin" replace />;
        case 'agent':
          return <Navigate to="/agent" replace />;
        case 'user':
        default:
          return <Navigate to="/user" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;