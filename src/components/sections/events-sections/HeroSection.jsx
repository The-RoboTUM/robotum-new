import * as assets from "@assets";
import Button from "@components/ui/Button";
import ImageFrame from "@components/ui/ImageFrame";

/**
 * Events → Hero Section (Refined)
 * - Consistent with design system
 * - Full screen on all devices
 * - Balanced text and visuals
 * - Improved readability and spacing
 */
const HeroSection = () => {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="w-full min-h-screen font-sans text-white surface-2 edge-fade-bottom surface-wrap surface-pattern overflow-hidden flex items-center"
      aria-labelledby="events-hero-heading"
    >
      <div className="section-container flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20">
        {/* Text Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
          <h1
            id="events-hero-heading"
            className="heading heading-h1 font-bold leading-tight text-balance"
          >
            Where ideas <span className="text-accent">connect</span> and grow
          </h1>

          <p className="text-text2 md:text-text1 text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Join thought‑provoking events that bring together students,
            professionals, and innovators. From inspiring keynotes to
            interactive workshops and networking — each event offers a space for
            exchange, reflection, and growth.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center lg:justify-start">
            <Button
              variant="primary"
              onClick={() => scrollToSection("upcoming-events")}
            >
              View upcoming events
            </Button>
            <Button variant="secondary" as="link" to="/events#past">
              See past highlights
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <ImageFrame
            src={assets.eventsHero}
            alt="Robot and speaker at event"
            aspect="3/2"
            fit="cover"
            variant="soft"
            rounded="2xl"
            className="w-full max-w-lg lg:max-w-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
