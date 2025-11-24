import { lazy, Suspense, useEffect } from "react";

// General imports
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import PageLoader from "@components/sections/common-sections/PageLoader";

// Lazy load sections for performance
const FaqSection = lazy(
  () => import("@/components/sections/faqs-sections/FaqSection"),
);

const Faqs = () => {
  useEffect(() => {
    document.title = "Q&A | RoboTUM";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <FaqSection />
      </Suspense>
      <FooterSection />
    </>
  );
};

export default Faqs;
