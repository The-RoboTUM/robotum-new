// General imports
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";

// Lazy load sections for performance
import { lazy, Suspense, useEffect } from "react";
const HeroSection = lazy(
  () => import("@components/sections/about-us-sections/HeroSection"),
);
const WhatIsRobotum = lazy(
  () => import("@components/sections/about-us-sections/WhatIsRobotum"),
);
const TeamSection = lazy(
  () => import("@components/sections/about-us-sections/TeamSection"),
);
const PreviousEventsSection = lazy(
  () => import("@components/sections/about-us-sections/PreviousEventsSection"),
);
const FaqSection = lazy(
  () => import("@components/sections/about-us-sections/FaqSection"),
);

const About = () => {
  useEffect(() => {
    document.title = "About Us | RoboTUM";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <Navbar />

      {/* Lazy load sections */}
      <Suspense
        fallback={
          <div className="w-full py-24 text-center text-white/70">Loading…</div>
        }
      >
        <HeroSection />
        <WhatIsRobotum />
        <TeamSection />
        <PreviousEventsSection />
        <FaqSection />
      </Suspense>

      <FooterSection />
    </>
  );
};

export default About;
