// General imports
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import HeroSection from "@components/sections/about-us-sections/HeroSection";
import PageLoader from "@components/sections/common-sections/PageLoader";

// Lazy load sections for performance
import { lazy, Suspense } from "react";
import { usePageTitle } from "@hooks/usePageTitle";
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
  usePageTitle("About Us | roboTUM");

  return (
    <>
      <Navbar />
      <HeroSection />

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
