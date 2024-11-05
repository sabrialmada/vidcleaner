/* import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Pricing from '../components/Pricing/Pricing';
import Stats from '../components/Stats';


const Home = () => {

  useEffect(() => {
    console.log("Home page mounted");
    // Any side effects or API calls could go here.
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section">
        <Hero />
        <div className="pricing-card">
          <Pricing />
        </div>
      </div>
      <Stats />
    </div>
  );
};

export default Home; */

import React from 'react';
import Hero from '../components/Hero';
import Pricing from '../components/Pricing/Pricing';
import Stats from '../components/Stats';
import Steps from '../components/Steps';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <Hero />
        <Pricing />
      </div>
      <Stats />
      <Steps />
    </div>
  );
};

export default Home;