import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Get JWT token from localStorage

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If token exists, render the children (protected component)
  return children;
};

export default ProtectedRoute;
