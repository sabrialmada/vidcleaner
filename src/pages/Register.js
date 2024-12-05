
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