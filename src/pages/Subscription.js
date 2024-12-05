

import React, { useEffect } from 'react';
import axios from 'axios';
import './Subscription.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://vidcleaner-production.up.railway.app';
const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/14k02685Y4mzgMg5ks';

const Subscription = () => {
  useEffect(() => {
    const handleSubscription = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        // get users email to pass to stripe
        const response = await axios.get(`${API_BASE_URL}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // append user id to stripe checkout url
        const checkoutUrl = `${STRIPE_CHECKOUT_URL}?client_reference_id=${response.data._id}`;
        window.location.href = checkoutUrl;
      } catch (error) {
        console.error('Error initiating subscription:', error);
      }
    };

    handleSubscription();
  }, []);

  return (
    <div className="subscription-container">
      <div className="subscription-card">
        <h2>Redirecting to secure checkout...</h2>
      </div>
    </div>
  );
};

export default Subscription;