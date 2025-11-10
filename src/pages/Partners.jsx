// Above-the-fold imports
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";

// Lazy-load below-the-fold content for performance
import { lazy, Suspense, useEffect } from "react";
const HeroSection = lazy(
  () => import("@components/sections/partners-sections/HeroSection"),
);
const PartnerCategories = lazy(
  () => import("@components/sections/partners-sections/PartnerCategories"),
);
const NextPrototypes = lazy(
  () => import("@components/sections/partners-sections/NextPrototypes"),
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

      <Suspense
        fallback={
          <div className="w-full min-h-[40vh] flex items-center justify-center text-white/70">
            Loading…
          </div>
        }
      >
        <HeroSection />
        <PartnerCategories />
        <NextPrototypes />
        <WhatWeOffer />
        <ContactUsSection />
      </Suspense>

      <FooterSection />
    </>
  );
}
