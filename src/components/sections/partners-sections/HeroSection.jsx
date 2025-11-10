import Button from "@components/ui/Button";

/**
 * Partners page Hero
 * - Uses dark surface for contrast and depth
 * - Balanced layout that scales from mobile → desktop
 * - Reuses global heading tokens and button components
 * - Includes breadcrumb, title, copy, CTAs, and quick category chips
 */
const HeroSection = () => {
  return (
    <section
      id="partners-hero"
      className="section-container surface-1 text-white surface-wrap edge-fade-bottom min-h-screen flex items-center"
      aria-labelledby="partners-hero-heading"
      role="region"
    >
      {/* Optional subtle pattern overlay */}
      <div
        className="surface-pattern opacity-40 absolute inset-0"
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Headline + Subcopy */}
        <header className="max-w-3xl">
          <h1
            id="partners-hero-heading"
            className="heading heading-h1 text-white"
          >
            Partnerships & Collaborations
          </h1>
          <p className="mt-4 md:mt-5 text-text1 text-white/80">
            We work with{" "}
            <span className="font-semibold text-white">lead sponsors</span>,{" "}
            <span className="font-semibold text-white">sponsors</span>,{" "}
            <span className="font-semibold text-white">industry</span>, and{" "}
            <span className="font-semibold text-white">
              academic collaborators
            </span>{" "}
            to accelerate robotics innovation at TUM and in Munich’s ecosystem.
          </p>
        </header>

        {/* CTAs */}
        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            as="link"
            to="/join#partners"
            variant="primary"
            className="w-full sm:w-auto"
          >
            Become a partner
          </Button>
        </div>

        {/* Quick categories / chips */}
        <ul className="mt-8 md:mt-10 flex flex-wrap items-center gap-2.5">
          {[
            "Lead Sponsors",
            "Sponsors",
            "Industry Collaborators",
            "Academic Collaborators",
          ].map((label) => (
            <li key={label}>
              <span
                className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1.5 text-[13px] text-white/90
                           shadow-sm hover:shadow-md hover:bg-white/20 transition-all duration-200"
              >
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HeroSection;
