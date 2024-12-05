

import React, { useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/VidCleaner.png';

const Header = ({ userEmail, onLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogin = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleRegister = () => {
    navigate('/register');
    setIsMenuOpen(false);
  };

  const handleUserProfile = () => {
    navigate('/user-profile');
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (userEmail) {
      navigate('/dashboard/cleaner/video');
    } else {
      navigate('/');
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <nav>
        <div
          className="logo-container"
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
        >
          <img src={logo} alt="VidCleaner Logo" className="logo-image" />
        </div>

        {/* desktop navigation */}
        <div className="nav-links">
          {userEmail ? (
            <>
              <button className="user-profile-btn" onClick={handleUserProfile}>{userEmail}</button>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="register-btn" onClick={handleRegister}>Register</button>
              <button className="login-btn" onClick={handleLogin}>Login</button>
            </>
          )}
        </div>

        {/* hamburger menu */}
        <div
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* mobile menu */}
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          {userEmail ? (
            <>
              <button className="user-profile-btn" onClick={handleUserProfile}>{userEmail}</button>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="register-btn" onClick={handleRegister}>Register</button>
              <button className="login-btn" onClick={handleLogin}>Login</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;