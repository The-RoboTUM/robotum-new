// Above-the-fold imports
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import HeroSection from "@/components/sections/partners-sections/HeroSection";
import PageLoader from "@components/sections/common-sections/PageLoader";

// Lazy-load below-the-fold content for performance
import { lazy, Suspense, useEffect } from "react";
const PartnerCategories = lazy(
  () => import("@components/sections/partners-sections/PartnerCategories"),
);
const WhatWeOffer = lazy(
  () => import("@components/sections/partners-sections/WhatWeOffer"),
);
const ContactUsSection = lazy(
  () => import("@components/sections/partners-sections/ContactUsSection"),
);

export default function Partners() {
  useEffect(() => {
    document.title = "Partners | RoboTUM";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />

      <Suspense fallback={<PageLoader />}>
        <PartnerCategories />
        <WhatWeOffer />
        <ContactUsSection />
      </Suspense>

      <FooterSection />
    </>
  );
}
