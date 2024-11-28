/* import React from 'react';
import './Pricing.css';

const Pricing = () => {
  return (
    <div className="pricing-card">
      <h2>Video & Reel Cleaner</h2>
      <div className="price">$49 <span>/month</span></div>
      <button className="get-started-btn">Get Started</button>
      <ul>
        <li>IDEAL for short form marketing.</li>
        <li>Use for Reels, Shorts, and Toks after each Clean.</li>
      </ul>
    </div>
  );
};

export default Pricing;
 */

/* import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Pricing.css';

const Pricing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  return (
    <div className="pricing-card">
      <h2>Video & Reel Cleaner</h2>
      <div className="price">$29 <span>/month</span></div>
      <button className="get-started-btn" onClick={handleGetStarted}>Get Started</button>
      <ul>
        <li>IDEAL for short form marketing.</li>
        <li>Use for Reels, Shorts, and Toks after each Clean.</li>
      </ul>
    </div>
  );
};

export default Pricing; */



import React from 'react';
import './Tutorial.css';

const Tutorial = () => {
  return (
    <section className="tutorial-section">
      <div className="tutorial-container">
        <div className="video-container">
          <video 
            className="tutorial-video"
            controls
            playsInline
            preload="metadata"
          >
            <source src="/tutorial.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
};

export default Tutorial;