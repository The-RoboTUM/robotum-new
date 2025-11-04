// General imports
import Navbar from '@components/sections/common-sections/Navbar';
import FooterSection from '@components/sections/common-sections/FooterSection';

// Lazy load sections for performance
import React, { lazy, Suspense, useEffect } from 'react';
const HeroSection = lazy(() => import('@components/sections/about-us-sections/HeroSection'));
const TeamSection = lazy(() => import('@components/sections/about-us-sections/TeamSection'));

const About = () => {
  useEffect(() => {
    document.title = 'About Us | RoboTUM';
  }, []);

  return (
    <>
      <Navbar />

      {/* Lazy load sections */}
      <Suspense fallback={<div className="w-full py-24 text-center text-white/70">Loading…</div>}>
        <HeroSection />
        <TeamSection />
      </Suspense>

      <FooterSection />
    </>
  );
}

export default About;