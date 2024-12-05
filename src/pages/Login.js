
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from '../components/Form/Form';
import { API_BASE_URL } from '../config';

const Login = ({ setUserEmail }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      console.log('Attempting login for:', email);
      /* console.log('Password being sent:', password); */ 
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });

      console.log('Login response:', res.data);
      const { accessToken, email: userEmail } = res.data;

      if (!accessToken) {
        throw new Error('No token received from server');
      }

      setUserEmail(userEmail);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('userEmail', userEmail);

      console.log('Token stored in localStorage:', accessToken);
      console.log('Redirecting to dashboard');
      navigate('/dashboard/cleaner/video');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <>
      {error && <div className="error-message">{error}</div>}
      <Form
        type="login"
        title="Login"
        buttonText="Login"
        onSubmit={handleSubmit}
        setEmail={setEmail}
        setPassword={setPassword}
      />
    </>
  );
};

export default Login;