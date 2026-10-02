// Above-the-fold imports (keep eager for fast first paint)
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import HeroSection from "@components/sections/homepage-sections/HeroSection";
import SectionLoader from "@components/sections/common-sections/SectionLoader";
import NewsTicker from "@components/sections/common-sections/NewsTicker";
import {
  applications,
  applicationsOpen,
  applicationTickerMessages,
} from "@config/applications";

// Lazily load below-the-fold sections to reduce initial bundle size
import { lazy, Suspense, useEffect } from "react";

const MissionSection = lazy(
  () => import("@components/sections/homepage-sections/MissionSection"),
);
const ProjectSection = lazy(
  () => import("@components/sections/homepage-sections/ProjectSection"),
);
const ViewerSection = lazy(
  () => import("@components/sections/homepage-sections/ViewerSection"),
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
const FundraisingSection = lazy(
  () => import("@components/sections/homepage-sections/FundraisingSection"),
);

const Home = () => {
  useEffect(() => {
    document.title = "Home | roboTUM";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-13 md:pt-15">
        <NewsTicker
          messages={applicationTickerMessages()}
          badge={
            applicationsOpen ? `${applications.semesterShort} intake` : "Latest"
          }
          tone={applicationsOpen ? "highlight" : "default"}
        />
        <HeroSection />

        <Suspense fallback={<SectionLoader />}>
          <MissionSection />
          <ProjectSection />
          <ViewerSection />
          {/* <FundraisingSection /> */}
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
