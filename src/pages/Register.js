import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from '../components/Form/Form';
import { API_BASE_URL } from '../config';

const Register = ({ setUserEmail }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    // basic validation
    if (!email || !password || !repeatPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords don't match");
      return;
    }

    // email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting registration for:', email);

      const res = await axios.post(`${API_BASE_URL}/api/auth/register`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      console.log('Registration response:', res.data);
      const { accessToken, email: registeredEmail, message } = res.data;

      // store user data
      setUserEmail(registeredEmail);
      localStorage.setItem('token', accessToken);

      // show success message
      setSuccessMessage(message || 'Registration successful! Please check your email for confirmation.');

      setTimeout(() => {
        console.log('Redirecting to dashboard');
        navigate('/dashboard/cleaner/video');
      }, 3000);

    } catch (err) {
      console.error('Registration error:', err);

      // handle different types of errors
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (err.response?.status === 429) {
        setError('Too many attempts. Please try again later.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || 'Invalid registration details.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <Form
        type="register"
        title="Register"
        buttonText={isLoading ? 'Creating Account...' : 'Create Account'}
        onSubmit={handleSubmit}
        setEmail={setEmail}
        setPassword={setPassword}
        setRepeatPassword={setRepeatPassword}
        disabled={isLoading}
      />

      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="w-6 h-6 border-2 border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mt-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mt-4">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default Register;