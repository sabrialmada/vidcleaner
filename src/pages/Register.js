/* // Register.js
import React from 'react';
import Form from '../components/Form/Form';

const Register = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle registration logic
  };

  return <Form type="register" title="Register" buttonText="Create Account" onSubmit={handleSubmit} />;
};

export default Register;
 */

// Register.js
/* import React from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form/Form';

const Register = ({ setUserEmail }) => {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Assuming registration is successful
    const email = 'new-user-email@gmail.com'; // Replace with real email from form or auth
    setUserEmail(email);
    navigate('/dashboard'); // Redirect to dashboard
  };

  return <Form type="register" title="Register" buttonText="Create Account" onSubmit={handleSubmit} />;
};

export default Register;
 */

/* import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from '../components/Form/Form';

const Register = ({ setUserEmail }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== repeatPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      // Send registration request to the backend
      const res = await axios.post('http://localhost:5000/api/auth/register', { email, password });

      // If registration is successful
      const { token, userEmail } = res.data;
      setUserEmail(userEmail); // Set user email state
      localStorage.setItem('token', token); // Save token in localStorage

      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err.response.data);
      alert(err.response.data.message || "Registration failed");
    }
  };

  return (
    <Form
      type="register"
      title="Register"
      buttonText="Create Account"
      onSubmit={handleSubmit}
      setEmail={setEmail}
      setPassword={setPassword}
      setRepeatPassword={setRepeatPassword} // Add handler for repeat password
    />
  );
};

export default Register;
 */

/* import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Form from '../components/Form/Form';

const Register = ({ setUserEmail }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== repeatPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      // Send registration request to the backend
      const res = await axios.post('http://localhost:5000/api/auth/register', { email, password });

      // If registration is successful
      const { token, email } = res.data; // 'email' from the backend response
      setUserEmail(email); // Set user email state
      localStorage.setItem('token', token); // Save token in localStorage
      localStorage.setItem('userEmail', email); // Save email to localStorage for persistence

      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err.response?.data || 'Error occurred');
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Form
      type="register"
      title="Register"
      buttonText="Create Account"
      onSubmit={handleSubmit}
      setEmail={setEmail}
      setPassword={setPassword}
      setRepeatPassword={setRepeatPassword} // Add handler for repeat password
    />
  );
};

export default Register;
 */

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
  
    if (password !== repeatPassword) {
      setError("Passwords don't match");
      return;
    }
  
    try {
      console.log('Attempting registration for:', email);
      /* console.log('Password being sent:', password); */ // New console log
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, { email, password });
      
  
      console.log('Registration response:', res.data);
      const { accessToken, email: registeredEmail } = res.data;
      setUserEmail(registeredEmail);
      localStorage.setItem('token', accessToken);
  
      console.log('Token stored in localStorage:', accessToken);
      console.log('Redirecting to dashboard');
      navigate('/dashboard/cleaner/video');
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <>
      <Form
        type="register"
        title="Register"
        buttonText="Create Account"
        onSubmit={handleSubmit}
        setEmail={setEmail}
        setPassword={setPassword}
        setRepeatPassword={setRepeatPassword}
      />
      {error && <p className="error-message">{error}</p>}
    </>
  );
};

export default Register;