/* import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_live_51OFLsiGvQcDuKt0jT7TIVmYvus9XDWzPkB3HNJRHOL1Su03wjwiFViFj0vQPTGCAy8It8TYT4rGyebl35mMeTFnz00pXAnLSqV');

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

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
        navigate('/login');
        return;
      }

      // Create subscription
      const response = await axios.post(
        'http://localhost:5000/api/subscriptions/create',
        {},
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      console.log('Subscription response:', response.data);

      // Confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(response.data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            // You can add more billing details here if needed
          },
        }
      });

      if (result.error) {
        console.error('Payment error:', result.error);
        alert(`Payment failed: ${result.error.message}`);
      } else {
        console.log('Payment succeeded');
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
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Subscribe Now'}
      </button>
    </form>
  );
};

const Subscription = () => {
  return (
    <div>
      <h2>Subscribe to VidCleaner</h2>
      <p>$49/month</p>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default Subscription; */


/* import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from '../stripe';
import './Subscription.css'; // Create this file for styles


const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

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
          navigate('/login');
          return;
        }
  
        // Create subscription
        const response = await axios.post(
          'http://localhost:5000/api/subscriptions/create',
          {},
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
  
        console.log('Subscription response:', response.data);
  
        // Confirm the payment with Stripe
        const result = await stripe.confirmCardPayment(response.data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              // You can add more billing details here if needed
            },
          }
        });
  
        if (result.error) {
          console.error('Payment error:', result.error);
          alert(`Payment failed: ${result.error.message}`);
        } else {
          console.log('Payment succeeded');
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
        <CardElement options={{
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
        }}/>
      </div>
      <button type="submit" disabled={!stripe || loading} className="subscribe-btn">
        {loading ? 'Processing...' : 'Subscribe Now'}
      </button>
    </form>
  );
};

const Subscription = () => {
  return (
    <div className="subscription-container">
      <div className="subscription-card">
        <h2>Subscribe to VidCleaner</h2>
        <p className="price">$49<span>/month</span></p>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default Subscription; */

/* import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '../stripe';
import CheckoutForm from '../components/CheckoutForm';
import './Subscription.css';

const Subscription = () => {
  return (
    <div className="subscription-container">
      <div className="subscription-card">
        <h2>Subscribe to VidCleaner</h2>
        <p className="price">$29<span>/month</span></p>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
};

export default Subscription; */

import React from 'react';
import './Subscription.css';

const Subscription = () => {
  return (
    <div className="subscription-container">
      <div className="subscription-card">
        <h2>Subscribe to VidCleaner</h2>
        <p className="price">$29<span>/month</span></p>
        <a href="https://buy.stripe.com/14k02685Y4mzgMg5ks" className="subscribe-btn">
          Subscribe Now
        </a>
      </div>
    </div>
  );
};

export default Subscription;