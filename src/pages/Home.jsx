// Above-the-fold imports (keep eager for fast first paint)
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import HeroSection from "@components/sections/homepage-sections/HeroSection";

// Lazily load below-the-fold sections to reduce initial bundle size
import { lazy, Suspense, useEffect } from "react";
const MissionSection = lazy(
  () => import("@components/sections/homepage-sections/MissionSection"),
);
const ProjectSection = lazy(
  () => import("@components/sections/homepage-sections/ProjectSection"),
);
const EventSection = lazy(
  () => import("@components/sections/homepage-sections/EventSection"),
);
const JoinUsSection = lazy(
  () => import("@components/sections/homepage-sections/JoinUsSection"),
);
const PartnersSection = lazy(
  () => import("@components/sections/homepage-sections/PartnersSection"),
);

const Home = () => {
  useEffect(() => {
    document.title = "Home | RoboTUM";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />

      {/* Below-the-fold sections are wrapped in a single Suspense for fewer boundaries */}
      <Suspense
        fallback={
          <div className="w-full py-24 text-center text-white/70">Loading…</div>
        }
      >
        <MissionSection />
        <ProjectSection />
        <EventSection />
        <JoinUsSection />
        <PartnersSection />
      </Suspense>

      <FooterSection />
    </>
  );
};

export default Home;
