import React from 'react';
import './Steps.css';

const Steps = () => {
  return (
    <section className="steps-section">
      <div className="steps-container">
        <h2 className="steps-title">
          Very simple, Rip, <span className="highlight-green">Rinse</span>, Repost, Repeat.
        </h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#44ACE9">
                <path d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7V11H7V13H12V17L17,12L12,7Z" />
              </svg>
            </div>
            <h3>Rip</h3>
            <p>We download your old content</p>
          </div>

          <div className="step-card">
            <div className="step-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#44ACE9">
                <path d="M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12C21,11.5 20.96,11 20.87,10.5C20.6,10 20,10 20,10H18V9C18,8 17,8 17,8H15V7C15,6 14,6 14,6H13V5C13,4 12,4 12,4C11,4 11,5 11,5V6H10C9,6 9,7 9,7V8H8C7,8 7,9 7,9V10H5C4.5,10 4,10.5 4,11V13H6V12H7V13H8V14H9V15H10V16H11V17H12V18H13V17H14V16H15V15H16V14H17V13H18V12H19V11C19,11.5 19.1,12 19.22,12.5C19.11,16.57 15.77,19.86 11.69,19.97C7.62,20.07 4.23,16.83 4,12.76C3.78,8.7 7,5.27 11.07,5.04C11.38,5.02 11.69,5.02 12,5.02C12,4.5 12,4 12,3Z" />
              </svg>
            </div>
            <h3>Rinse</h3>
            <p>Clear all the video's metadata</p>
          </div>

          <div className="step-card">
            <div className="step-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#44ACE9">
                <path d="M17,13L12,18V15H2V11H12V8L17,13M21,6V18A2,2 0 0,1 19,20H7A2,2 0 0,1 5,18V16H7V18H19V6H7V8H5V6A2,2 0 0,1 7,4H19A2,2 0 0,1 21,6Z" />
              </svg>
            </div>
            <h3>Repost</h3>
            <p>Upload as Reels, Shorts, and Toks.</p>
          </div>

          <div className="step-card">
            <div className="step-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#44ACE9">
                <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
              </svg>
            </div>
            <h3>Repeat</h3>
            <p>Redo Steps 1 through 3</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Steps;