import { lazy, Suspense, useEffect } from "react";

// General imports
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import HeroSection from "@/components/sections/events-sections/HeroSection";
import PageLoader from "@components/sections/common-sections/PageLoader";

// Lazy load sections for performance
const EventsSection = lazy(
  () => import("@components/sections/events-sections/EventsSection"),
);

// FOR TESTING PURPOSES ONLY
// const EventsSection = lazy(
//   () => new Promise(resolve =>
//     setTimeout(() => resolve(import("@components/sections/events-sections/EventsSection")), 5500)
//   )
// );

const Events = () => {
  useEffect(() => {
    document.title = "Events | RoboTUM";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

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