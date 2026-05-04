// Above-the-fold imports (keep eager for fast first paint)
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import HeroSection from "@components/sections/homepage-sections/HeroSection";
import SectionLoader from "@/components/sections/common-sections/SectionLoader";
import NewsTicker from "@components/sections/common-sections/NewsTicker";
import RoboticsWeekSection from "@components/sections/homepage-sections/RoboticsWeekSection";

// Lazily load below-the-fold sections to reduce initial bundle size
import { lazy, Suspense, useEffect } from "react";

// FOR TESTING PURPOSES ONLY
// const MissionSection = lazy(
//   () => new Promise(resolve =>
//     setTimeout(() => resolve(import("@components/sections/homepage-sections/MissionSection")), 5500)
//   )
// );

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
      <main className="pt-13 md:pt-15">
        <NewsTicker
          // messages={[
          //   "Applications for Summer Semester 2026 are now open.",
          //   "Please submit your application by the end of this month.",
          // ]}
          messages={[
            "SS 2026 applications are closed",
            "Next application phase opens in September 2026",
          ]}
        />
        <HeroSection />
        <RoboticsWeekSection />

        <Suspense fallback={<SectionLoader />}>
          <MissionSection />
          <ProjectSection />
          <EventSection />
          <JoinUsSection />
          <PartnersSection />
        </Suspense>
      </main>
      <FooterSection />
    </>
  );
};

export default Home;
