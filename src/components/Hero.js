

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <section className="hero">
      <div className="hero-text">
        <h1><span className="highlight">ReUse</span> Your Most Viral Clip 1000x a month with <span className="brand-name">VidCleaner</span>!</h1>
        <p>Don't let algorithms sabotage your reposted content - use VidCleaner to reset metadata and go viral again.</p>
        <button className="get-started-btn" onClick={handleGetStarted}>Get Started</button>
      </div>
    </section>
  );
};

export default Hero;