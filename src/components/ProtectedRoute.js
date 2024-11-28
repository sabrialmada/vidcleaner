// components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const [isSubscribed, setIsSubscribed] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkSubscription = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/subscriptions/status`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setIsSubscribed(response.data.isSubscribed);
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
      setLoading(false);
    };

    checkSubscription();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // If on subscription page, don't check subscription status
  if (location.pathname === '/subscription') {
    return children;
  }

  // If not subscribed and not on subscription page, redirect to subscription
  if (!isSubscribed) {
    return <Navigate to="/subscription" state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;