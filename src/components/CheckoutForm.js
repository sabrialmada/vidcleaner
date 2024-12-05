
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://vidcleaner-production.up.railway.app';

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe has not been initialized.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      console.log('Creating subscription...');
      const { data: { clientSecret, subscriptionId } } = await axios.post(
        `${API_BASE_URL}/api/subscriptions/create`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Subscription created, confirming payment...');

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
          },
        }
      });

      if (result.error) {
        throw new Error(result.error.message);
      } else {
        console.log('Payment confirmed, now confirming subscription');
        try {
          const response = await axios.post(
            `${API_BASE_URL}/api/subscriptions/confirm`,
            { subscriptionId },
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          console.log('Subscription confirmed:', response.data);
          setSuccess(true);
          setTimeout(() => navigate('/dashboard'), 2000);
        } catch (confirmError) {
          console.error('Error confirming subscription:', confirmError);
          throw new Error('Payment successful, but subscription confirmation failed. Please contact support.');
        }
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="subscription-form">
      <div className="card-element-container">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
            hidePostalCode: true,
          }}
        />
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Subscription successful! Redirecting to dashboard...</div>}
      <button type="submit" disabled={!stripe || loading} className="subscribe-btn">
        {loading ? 'Processing...' : 'Subscribe Now'}
      </button>
      {loading && <div className="loading-indicator">Processing your subscription...</div>}
    </form>
  );
};

export default CheckoutForm;