// General imports
import Navbar from '@components/sections/common-sections/Navbar';
import FooterSection from '@components/sections/common-sections/FooterSection';

// Lazy load sections for performance
import React, { lazy, Suspense, useEffect } from 'react';
const HeroSection = lazy(() => import('@components/sections/join-us-sections/HeroSection'));
const WhyWeSection = lazy(() => import('@components/sections/join-us-sections/WhyWeSection'));
const ApplicationSection = lazy(() => import('@components/sections/join-us-sections/ApplicationSection'));

const JoinUs = () => {
  useEffect(() => {
    document.title = 'Join Us | RoboTUM';
  }, []);

  return (
    <>
      <Navbar />

      {/* Lazy load sections */}
      <Suspense fallback={<div className="w-full py-24 text-center text-white/70">Loading…</div>}>
        <HeroSection />
        <WhyWeSection />
        <ApplicationSection />
      </Suspense>

      <FooterSection />
    </>
  );
}

export default JoinUs;