// Above-the-fold imports
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import HeroSection from "@/components/sections/partners-sections/HeroSection";

// Lazy-load below-the-fold content for performance
import { lazy, Suspense, useEffect } from "react";
import SectionLoader from "@/components/sections/common-sections/SectionLoader";
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
      <main className="pt-13 md:pt-15">
        <HeroSection />

        <Suspense fallback={<SectionLoader />}>
          <PartnerCategories />
          <WhatWeOffer />
          <ContactUsSection />
        </Suspense>
      </main>

      <FooterSection />
    </>
  );
}
