/* import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          navigate('/login');
          return;
        }
    
        const response = await axios.post(
          'http://localhost:5000/api/subscriptions/create',
          {},
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

      const { clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            // You can add billing details here if needed
          },
        }
      });

      if (result.error) {
        alert(`Payment failed: ${result.error.message}`);
      } else {
        alert('Subscription successful!');
        navigate('/dashboard');
      }
    } catch (error) {
        console.error('Subscription error:', error);
        if (error.response) {
          console.error('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
          alert(`Subscription failed: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          console.error('Error request:', error.request);
          alert('No response from server. Please try again later.');
        } else {
          console.error('Error message:', error.message);
          alert('An error occurred. Please try again.');
        }
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
      <button type="submit" disabled={!stripe || loading} className="subscribe-btn">
        {loading ? 'Processing...' : 'Subscribe Now'}
      </button>
    </form>
  );
};

export default CheckoutForm; */


// FOR PRODUCTION

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://vidcleaner-production.up.railway.app';

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            // You can add billing details here if needed
          },
        }
      });

      if (result.error) {
        throw new Error(result.error.message);
      } else {
        // Optionally, you can make another API call here to confirm the subscription on your backend
        await axios.post(
          `${API_BASE_URL}/api/subscriptions/confirm`,
          { subscriptionId },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
      
      // You might want to send this error to your error tracking service
      // errorTrackingService.logError(error);
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
      <button type="submit" disabled={!stripe || loading} className="subscribe-btn">
        {loading ? 'Processing...' : 'Subscribe Now'}
      </button>
    </form>
  );
};

export default CheckoutForm;