/* import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Register from './pages/Register'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
 */

// App.js
/* import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
 */

/* // App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [userEmail, setUserEmail] = useState(null); // Use state to store the logged-in user's email

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUserEmail={setUserEmail} />} />
          <Route path="/register" element={<Register setUserEmail={setUserEmail} />} />
          <Route path="/dashboard" element={<Dashboard userEmail={userEmail} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
 */


// App.js
/* import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import './App.css';

function App() {
  const [userEmail, setUserEmail] = useState(null);

  const handleLogout = () => {
    setUserEmail(null); // Clear the email
    // Additional logout logic can be added here
  };

  return (
    <Router>
      <div className="App">
        <Header userEmail={userEmail} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUserEmail={setUserEmail} />} />
          <Route path="/register" element={<Register setUserEmail={setUserEmail} />} />
          <Route path="/dashboard" element={<Dashboard userEmail={userEmail} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
 */

/* import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import './App.css';

function App() {
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate(); // useNavigate hook to programmatically navigate

  const handleLogout = () => {
    setUserEmail(null); // Clear the email
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <div className="App">
      <Header userEmail={userEmail} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUserEmail={setUserEmail} />} />
        <Route path="/register" element={<Register setUserEmail={setUserEmail} />} />
        <Route path="/dashboard" element={<Dashboard userEmail={userEmail} />} />
      </Routes>
    </div>
  );
}

export default App;
 */

/* import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import VideoCleaner from './pages/Cleaner/VideoCleaner';
import ImageCleaner from './pages/Cleaner/ImageCleaner';
import InstagramReel from './pages/Scraper/InstagramReel';
import './App.css';

function App() {
  const [userEmail, setUserEmail] = useState(null);

  const handleLogout = () => {
    setUserEmail(null); // Clear the email
  };

  return (
    <Router>
      <div className="App">
        <Header userEmail={userEmail} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUserEmail={setUserEmail} />} />
          <Route path="/register" element={<Register setUserEmail={setUserEmail} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cleaner/video" element={<VideoCleaner />} />
          <Route path="/cleaner/image" element={<ImageCleaner />} />
          <Route path="/scraper/reel" element={<InstagramReel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
 */

/* import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom'; // Remove BrowserRouter here
import Header from './components/Header/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import VideoCleaner from './pages/Cleaner/VideoCleaner';
import ImageCleaner from './pages/Cleaner/ImageCleaner';
import InstagramReel from './pages/Scraper/InstagramReel';
import './App.css';

function App() {
  const [userEmail, setUserEmail] = useState(null);

  const handleLogout = () => {
    setUserEmail(null); // Clear the email
  };

  return (
    <div className="App">
      <Header userEmail={userEmail} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUserEmail={setUserEmail} />} />
        <Route path="/register" element={<Register setUserEmail={setUserEmail} />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="cleaner/video" element={<VideoCleaner />} />
          <Route path="cleaner/image" element={<ImageCleaner />} />
          <Route path="scraper/reel" element={<InstagramReel />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

 */

/* import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import VideoCleaner from './pages/Cleaner/VideoCleaner';
import ImageCleaner from './pages/Cleaner/ImageCleaner';
import InstagramReel from './pages/Scraper/InstagramReel';
import './App.css';

function App() {
  const [userEmail, setUserEmail] = useState(null);

  const handleLogout = () => {
    setUserEmail(null); // Clear the email
  };

  return (
    <div className="App">
      <Header userEmail={userEmail} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUserEmail={setUserEmail} />} />
        <Route path="/register" element={<Register setUserEmail={setUserEmail} />} />

        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="cleaner/video" element={<VideoCleaner />} />
          <Route path="cleaner/image" element={<ImageCleaner />} />
          <Route path="scraper/reel" element={<InstagramReel />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
 */

/* import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import VideoCleaner from './pages/Cleaner/VideoCleaner';
import ImageCleaner from './pages/Cleaner/ImageCleaner';
import InstagramReel from './pages/Scraper/InstagramReel';
import './App.css';

function App() {
  const [userEmail, setUserEmail] = useState(null);

  const handleLogout = () => {
    setUserEmail(null); // Clear the email
  };

  return (
    <div className="App">
      <Header userEmail={userEmail} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUserEmail={setUserEmail} />} />
        <Route path="/register" element={<Register setUserEmail={setUserEmail} />} />

        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="cleaner/video" element={<VideoCleaner />} />
          <Route path="cleaner/image" element={<ImageCleaner />} />
          <Route path="scraper/reel" element={<InstagramReel />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
 */

/* import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import VideoCleaner from './pages/Cleaner/VideoCleaner';
import ImageCleaner from './pages/Cleaner/ImageCleaner';
import InstagramReel from './pages/Scraper/InstagramReel';
import './App.css';

function App() {
  // Check localStorage for userEmail when the app loads
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || null);

  const handleLogout = () => {
    setUserEmail(null); // Clear the email in state
    localStorage.removeItem('userEmail'); // Remove userEmail from localStorage
    localStorage.removeItem('token'); // Optionally remove the token
  };

  useEffect(() => {
    // Anytime userEmail changes, save it in localStorage
    if (userEmail) {
      localStorage.setItem('userEmail', userEmail);
    }
  }, [userEmail]);

  return (
    <div className="App">
      <Header userEmail={userEmail} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUserEmail={setUserEmail} />} />
        <Route path="/register" element={<Register setUserEmail={setUserEmail} />} />

        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="cleaner/video" element={<VideoCleaner />} />
          <Route path="cleaner/image" element={<ImageCleaner />} />
          <Route path="scraper/reel" element={<InstagramReel />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
 */

/* import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; // Added useNavigate
import Header from './components/Header/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import VideoCleaner from './pages/Cleaner/VideoCleaner';
import ImageCleaner from './pages/Cleaner/ImageCleaner';
import InstagramReel from './pages/Scraper/InstagramReel';
import './App.css';

function App() {
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate(); // Use navigate to programmatically redirect

  const handleLogout = () => {
    setUserEmail(null); // Clear the email
    localStorage.removeItem('token'); // Remove the token from localStorage
    localStorage.removeItem('userEmail'); // Remove the email from localStorage

    navigate('/'); // Redirect to home page
  };

  return (
    <div className="App">
      <Header userEmail={userEmail} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUserEmail={setUserEmail} />} />
        <Route path="/register" element={<Register setUserEmail={setUserEmail} />} />

        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="cleaner/video" element={<VideoCleaner />} />
          <Route path="cleaner/image" element={<ImageCleaner />} />
          <Route path="scraper/reel" element={<InstagramReel />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
 */

/* import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom'; // Added useNavigate
import Header from './components/Header/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import VideoCleaner from './pages/Cleaner/VideoCleaner';
import InstagramReel from './pages/Scraper/InstagramReel';
import Subscription from './pages/Subscription';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute HOC
import './App.css';

function App() {
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate(); // Use navigate to programmatically redirect

  useEffect(() => {
    // Retrieve email from localStorage when app loads to maintain session
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail); // Set the email if found in localStorage
    }
  }, []);

  const handleLogout = () => {
    setUserEmail(null); // Clear the email
    localStorage.removeItem('token'); // Remove the token from localStorage
    localStorage.removeItem('userEmail'); // Remove the email from localStorage

    navigate('/'); // Redirect to home page
  };

  return (
    <div className="App">
      <Header userEmail={userEmail} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUserEmail={setUserEmail} />} />
        <Route path="/register" element={<Register setUserEmail={setUserEmail} />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="cleaner/video" element={<VideoCleaner />} />
          <Route path="scraper/reel" element={<InstagramReel />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
 */


import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import VideoCleaner from './pages/Cleaner/VideoCleaner';
import InstagramReel from './pages/Scraper/InstagramReel';
import UserProfile from './components/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import TermsAndConditions from './pages/Terms/TermsAndConditions';
import PrivacyPolicy from './pages/Terms/PrivacyPolicy';
import RefundPolicy from './pages/Terms/RefundPolicy';
import SubscriptionPolicy from './pages/Terms/SubscriptionPolicy';
import DMCAPolicy from './pages/Terms/DMCAPolicy';
import './App.css';

// Lazy load the Subscription component
const Subscription = lazy(() => import('./pages/Subscription'));

function App() {
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const handleLogout = () => {
    setUserEmail(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <div className="App">
      <Header userEmail={userEmail} onLogout={handleLogout} />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUserEmail={setUserEmail} />} />
          <Route path="/register" element={<Register setUserEmail={setUserEmail} />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} /> 
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/subscription-policy" element={<SubscriptionPolicy />} />
          <Route path="/dmca-policy" element={<DMCAPolicy />} />          
          <Route path="/subscription" element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          } />
          <Route path="/user-profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          
          {/* Protected Dashboard Layout with nested routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="cleaner/video" element={<VideoCleaner />} />
            <Route path="scraper/reel" element={<InstagramReel />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;