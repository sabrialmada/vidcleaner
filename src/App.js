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

const Subscription = lazy(() => import('./pages/Subscription'));

function App() {
  const [userEmail, setUserEmail] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const canceled = urlParams.get('canceled');

    if (success === 'true') {
      window.history.replaceState({}, document.title, window.location.pathname);
      setIsSubscribed(true);
    } else if (canceled === 'true') {
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/subscription');
    }
  }, [navigate]);

  const handleLogout = () => {
    setUserEmail(null);
    setIsSubscribed(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <div className="App">
      <Header userEmail={userEmail} onLogout={handleLogout} />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUserEmail={setUserEmail} />} />
          <Route path="/register" element={<Register setUserEmail={setUserEmail} />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/subscription-policy" element={<SubscriptionPolicy />} />
          <Route path="/dmca-policy" element={<DMCAPolicy />} />
          
          {/* Protected routes */}
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
          
          {/* Dashboard route - no subscription check */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Routes>
                <Route path="/" element={<DashboardLayout />}>
                  {/* Features with subscription check */}
                  <Route path="cleaner/video" element={
                    <ProtectedRoute checkSubscription>
                      <VideoCleaner />
                    </ProtectedRoute>
                  } />
                  <Route path="scraper/reel" element={
                    <ProtectedRoute checkSubscription>
                      <InstagramReel />
                    </ProtectedRoute>
                  } />
                </Route>
              </Routes>
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;