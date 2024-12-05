

import React from 'react';
import './Tutorial.css';

const Tutorial = () => {
  return (
    <section className="tutorial-section">
      <div className="tutorial-container">
        <div className="video-container">
          <iframe
            className="tutorial-video"
            src="https://www.youtube.com/embed/35aqAgTHIGs"
            title="VidCleaner Tutorial"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Tutorial;