// General imports
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import HeroSection from "@components/sections/join-us-sections/HeroSection";
import PageLoader from "@components/sections/common-sections/PageLoader";

// Lazy load sections for performance
import { lazy, Suspense } from "react";
import { usePageTitle } from "@hooks/usePageTitle";
const WhyWeSection = lazy(
  () => import("@components/sections/join-us-sections/WhyWeSection"),
);
const ApplicationSection = lazy(
  () => import("@components/sections/join-us-sections/ApplicationSection"),
);
const MemberStoriesSection = lazy(
  () => import("@components/sections/join-us-sections/MemberStoriesSection"),
);
const ApplicationFormSection = lazy(
  () => import("@components/sections/join-us-sections/ApplicationFormSection"),
);

const JoinUs = () => {
  usePageTitle("Join Us | roboTUM");

  return (
    <>
      <Navbar />
      <HeroSection />

      {/* Lazy load sections */}
      <Suspense fallback={<PageLoader />}>
        <WhyWeSection />
        <MemberStoriesSection />
        <ApplicationSection />
        <ApplicationFormSection />
      </Suspense>

      <FooterSection />
    </>
  );
};

export default JoinUs;
