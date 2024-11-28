/* import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Header.css';

const Header = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  return (
    <header>
      <nav>
        <div className="logo">VidCleaner</div>
        <div className="nav-links">
          <button className="register-btn" onClick={() => navigate('/register')}>
            Register
            </button>
          <button className="login-btn">
            Login
            </button> 
        </div>
      </nav>
    </header>
  );
};

export default Header;
 */

/* // Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header>
      <nav>
        <div className="logo">VidCleaner</div>
        <div className="nav-links">
          <Link to="/register">
            <button className="register-btn">Register</button>
          </Link>
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header; */

// Header.js
/* import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = ({ userEmail, onLogout }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <header>
      <nav>
        <div className="logo">VidCleaner</div>
        <div className="nav-links">
          {userEmail ? (
            <>
              <span>{userEmail}</span>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
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

 */


/* import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Update this path to where your logo is located

const Header = ({ userEmail, onLogout }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <header>
      <nav>
        <div className="logo-container">
          <img src={logo} alt="VidCleaner Logo" className="logo-image" />
          <div className="logo-text">VidCleaner</div>
        </div>
        <div className="nav-links">
          {userEmail ? (
            <>
              <span>{userEmail}</span>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
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

export default Header; */


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

        {/* Desktop Navigation */}
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

        {/* Hamburger Menu */}
        <div 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Mobile Menu */}
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