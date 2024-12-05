
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://vidcleaner-production.up.railway.app';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Unable to load user data. Please try again later.');
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleCancelSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/subscriptions/cancel`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchUserData(); // refresh user data after cancellation
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      setError('Failed to cancel subscription. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getRenewalDate = (startDate) => {
    const renewalDate = new Date(startDate);
    renewalDate.setMonth(renewalDate.getMonth() + 1);
    return formatDate(renewalDate);
  };

  if (loading) return <div className="user-profile"><p className="loading">Loading...</p></div>;
  if (error) return <div className="user-profile"><p className="error-message">{error}</p></div>;
  if (!user) return <div className="user-profile"><p className="error-message">Unable to load user data.</p></div>;

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div className="profile-section">
        <h3>Account Information</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Member Since:</strong> {formatDate(user.createdAt)}</p>
      </div>
      <div className="profile-section">
        <h3>Subscription Details</h3>
        <p><strong>Status:</strong> <span className={`status ${user.subscriptionStatus}`}>
          {user.subscriptionStatus === 'cancelling' ? 'Active (Cancels at period end)' : user.subscriptionStatus}
        </span></p>
        {(user.subscriptionStatus === 'active' || user.subscriptionStatus === 'cancelling') && (
          <>
            <p><strong>Plan:</strong> {user.subscriptionPlan}</p>
            <p><strong>Next Billing Date:</strong> {getRenewalDate(user.subscriptionStartDate)}</p>
            <p><strong>Amount:</strong> ${user.subscriptionAmount.toFixed(2)} USD</p>
          </>
        )}
        {user.subscriptionEndDate && (
          <p><strong>Subscription End Date:</strong> {formatDate(user.subscriptionEndDate)}</p>
        )}
      </div>
      {user.subscriptionStatus === 'active' && user.lastFourDigits && (
        <div className="profile-section">
          <h3>Payment Method</h3>
          <p><strong>Card:</strong> •••• •••• •••• {user.lastFourDigits}</p>
          <p><strong>Expiry:</strong> {user.cardExpiry}</p>
        </div>
      )}
      {user.subscriptionStatus === 'active' && (
        <button onClick={handleCancelSubscription} className="cancel-subscription">
          Cancel Subscription
        </button>
      )}
      {!['active', 'cancelling'].includes(user.subscriptionStatus) && (
        <button onClick={() => navigate('/subscription')} className="resubscribe">
          Resubscribe
        </button>
      )}
    </div>
  );
};

export default UserProfile;