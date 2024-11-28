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

/* import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Steps from '../components/Steps';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer'; 
import Tutorial from '../components/Tutorial/Tutorial';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <Hero />
        <Tutorial />
      </div>
      <Stats />
      <Steps />
      <FAQ /> 
      <Footer />
    </div>
  );
};

export default Home; */


import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Steps from '../components/Steps';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer'; 
import Tutorial from '../components/Tutorial/Tutorial';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <Hero />
        </div>
        <div className="tutorial-content">
          <Tutorial />
        </div>
      </div>
      <Stats />
      <Steps />
      <FAQ /> 
      <Footer />
    </div>
  );
};

export default Home;