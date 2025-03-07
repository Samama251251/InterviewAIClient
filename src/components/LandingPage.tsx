import React from 'react';
import Header from './LandingPage/Header';
import Hero from './LandingPage/Hero';
import HowItWorks from './LandingPage/HowItWorks';
import Features from './LandingPage/Features';
import Testimonials from './LandingPage/Testimonials';
import CallToAction from './LandingPage/CallToAction';
import Footer from './LandingPage/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Header />
        <Hero />
        <HowItWorks />
        <Features />
        <Testimonials />
        <CallToAction />
      <Footer />
    </div>
  );
};

export default App;