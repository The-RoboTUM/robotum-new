// General imports
import Navbar from '@components/sections/common-sections/Navbar';
import FooterSection from '@components/sections/common-sections/FooterSection';

// Lazy load sections for performance
import React, { lazy, Suspense, useEffect } from 'react';
const HeroSection = lazy(() => import('@components/sections/events-sections/HeroSection'));
const EventsSection = lazy(() => import('@components/sections/events-sections/EventsSection'));

const Events = () => {
  useEffect(() => {
    document.title = 'Events | RoboTUM';
  }, []);

  return (
    <>
      <Navbar />

      {/* Lazy load sections */}
      <Suspense fallback={<div className="w-full py-24 text-center text-white/70">Loading…</div>}>
        <HeroSection />
        <EventsSection />
      </Suspense>

      <FooterSection />
    </>
  );
}

export default Events;