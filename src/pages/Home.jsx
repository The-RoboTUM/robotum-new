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
import { lazy, Suspense } from "react";
import { usePageTitle } from "@hooks/usePageTitle";

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
// Fundraising section is temporarily hidden. To re-enable, restore:
//   const FundraisingSection = lazy(
//     () => import("@components/sections/homepage-sections/FundraisingSection"),
//   );
// and render <FundraisingSection /> between <ProjectSection /> and <EventSection />.

const Home = () => {
  usePageTitle("Home | roboTUM");

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
