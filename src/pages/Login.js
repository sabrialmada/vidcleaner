/* // Login.js
import React from 'react';
import Form from '../components/Form/Form';

const Login = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic
  };

  return <Form type="login" title="Login" buttonText="Login" onSubmit={handleSubmit} />;
};

export default Login;
 */

// Login.js
/* import React from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form/Form';

const Login = ({ setUserEmail }) => {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Assuming authentication is successful
    const email = 'user-email@gmail.com'; // Replace with real email from form or auth
    setUserEmail(email);
    navigate('/dashboard'); // Redirect to dashboard
  };

  return <Form type="login" title="Login" buttonText="Login" onSubmit={handleSubmit} />;
};

export default Login;
 */

/* import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from '../components/Form/Form';

const Login = ({ setUserEmail }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Send login request to the backend
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // If login is successful
      const { token, userEmail } = res.data;
      setUserEmail(userEmail); // Update user state with email
      localStorage.setItem('token', token); // Save token in localStorage
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err.response.data);
    }
  };

  return (
    <Form
      type="login"
      title="Login"
      buttonText="Login"
      onSubmit={handleSubmit}
      setEmail={setEmail}
      setPassword={setPassword}
    />
  );
};

export default Login;
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from '../components/Form/Form';

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
      /* console.log('Password being sent:', password); */ // New console log
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
      navigate('/dashboard');
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