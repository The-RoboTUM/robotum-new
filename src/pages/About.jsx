// General imports
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import HeroSection from "@/components/sections/about-us-sections/HeroSection";
import PageLoader from "@components/sections/common-sections/PageLoader";

// Lazy load sections for performance
import { lazy, Suspense, useEffect } from "react";
const WhatIsRobotum = lazy(
  () => import("@components/sections/about-us-sections/WhatIsRobotum"),
);
const TeamSection = lazy(
  () => import("@components/sections/about-us-sections/TeamSection"),
);
const PreviousEventsSection = lazy(
  () => import("@components/sections/about-us-sections/PreviousEventsSection"),
);

const About = () => {
  useEffect(() => {
    document.title = "About Us | RoboTUM";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />

      {/* Lazy load sections */}
      <Suspense fallback={<PageLoader />}>
        <WhatIsRobotum />
        <TeamSection />
        <PreviousEventsSection />
      </Suspense>

      <FooterSection />
    </>
  );
};

export default About;
