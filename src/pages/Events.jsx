import { lazy, Suspense } from "react";

// General imports
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import HeroSection from "@components/sections/events-sections/HeroSection";
import PageLoader from "@components/sections/common-sections/PageLoader";
import { usePageTitle } from "@hooks/usePageTitle";

// Lazy load sections for performance
const EventsSection = lazy(
  () => import("@components/sections/events-sections/EventsSection"),
);

const Events = () => {
  usePageTitle("Events | roboTUM");

  return (
    <>
      <Navbar />
      <HeroSection />
      <Suspense fallback={<PageLoader />}>
        <EventsSection />
      </Suspense>
      <FooterSection />
    </>
  );
};

export default Events;
