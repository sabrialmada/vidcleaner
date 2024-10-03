import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Pricing from '../components/Pricing/Pricing';

const Home = () => {
  /* const [message, setMessage] = useState(); */

  useEffect(() => {
    console.log("Home page mounted");
    // Any side effects or API calls could go here.
  }, []);

  return (
    <div className="home-container">
      {/* {<h2>{message}</h2>} */}
      <Hero />
      <Pricing />
    </div>
  );
};

export default Home;
