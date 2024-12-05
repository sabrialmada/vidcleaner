import React from 'react';
import './Stats.css';

const Stats = () => {
  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stats-content">
          <div className="stats-info">
            <h2 className="stats-title">
              <span className="stats-title-green">Get the Newest Viral Software</span>
              {' '}VidCleaner
            </h2>
            <p className="stats-description">
              This revolutionary software is saving creators 1000s of dollars a month.
              No need to film and edit all new content every month. Just Reuse old viral
              content with VidCleaner! So all we're doing is cleaning video data and
              making it new again. You reuse it and enjoy the free ReNewed Content!
            </p>
            <div className="stats-grid">
              <div className="stat-item">
                <h3>0</h3>
                <p>Avg Copyright strikes</p>
              </div>
              <div className="stat-item">
                <h3>7K+</h3>
                <p>Avg Views Per post Generated</p>
              </div>
              <div className="stat-item">
                <h3>500</h3>
                <p>Avg New Followers/Subs per week</p>
              </div>
              <div className="stat-item">
                <h3>7</h3>
                <p>Avg Accts Running Per User</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;