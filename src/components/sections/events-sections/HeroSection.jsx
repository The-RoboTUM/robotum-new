import * as assets from "@assets";
import Button from "@components/ui/Button";
import ImageFrame from "@components/ui/ImageFrame";

const HeroSection = () => {
  return (
    <section
      className="w-full min-h-screen font-sans text-white overflow-hidden flex items-center section-dark-primary surface-pattern"
      aria-labelledby="events-hero-heading"
    >
      <div className="section-container flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-20">
        {/* Text Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
          <h1
            id="events-hero-heading"
            className="heading heading-h1 font-bold leading-tight text-balance hero-animate"
          >
            Where ideas <span className="text-gradient">connect</span> &amp;{" "}
            <span className="text-gradient">grow</span>
          </h1>

          <p className="text-text2 md:text-text1 text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0 hero-animate">
            Join thought‑provoking events that bring together students,
            professionals, and innovators
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center lg:justify-start hero-animate">
            <Button variant="primary" scrollTarget="all-events">
              Explore Events ↓
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end hero-animate">
          <ImageFrame
            src={assets.eventHeroImg}
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
