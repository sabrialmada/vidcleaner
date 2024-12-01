import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, requiresSubscription = false }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const [isSubscribed, setIsSubscribed] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const currentPath = location.pathname;

  React.useEffect(() => {
    const checkSubscription = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      // Only check subscription for feature routes
      if (currentPath.includes('/dashboard/cleaner') || currentPath.includes('/dashboard/scraper')) {
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
      } else {
        // For non-feature routes, don't check subscription
        setIsSubscribed(true);
      }
      setLoading(false);
    };

    checkSubscription();
  }, [token, currentPath]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // If on subscription page, always allow access
  if (location.pathname === '/subscription') {
    return children;
  }

  // Only check subscription for feature routes
  if ((currentPath.includes('/dashboard/cleaner') || currentPath.includes('/dashboard/scraper')) && !isSubscribed) {
    return <Navigate to="/subscription" state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;