import * as assets from "@assets";
import Button from "@components/ui/Button";
import ImageFrame from "@components/ui/ImageFrame";

const HeroSection = () => {
  return (
    <section className="section-container min-h-[70vh] lg:min-h-screen flex flex-col lg:flex-row items-center justify-between text-white font-sans overflow-hidden section-dark-primary surface-pattern">
      {/* Left side: text content */}
      <div className="w-full lg:w-1/2 order-2 lg:order-1 space-y-6 text-center lg:text-left">
        <h1 className="heading heading-display md:text-display leading-tight text-balance hero-animate">
          Get <span className="text-gradient">inspired</span> <br /> Get{" "}
          <span className="text-gradient">involved</span>
        </h1>
        <p className="text-text2 md:text-text1 text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0 hero-animate">
          Hands-on. Future-focused. Together.
        </p>
        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4 hero-animate">
          <Button variant="primary" scrollTarget="application" target="_blank">
            Apply Now
          </Button>
          <Button variant="secondary" scrollTarget="why-we-section">
            Learn More ↓
          </Button>
        </div>
      </div>

      {/* Right side: image */}
      <div className="w-full lg:w-1/2 order-1 lg:order-2 mt-10 lg:mt-0 flex justify-center hero-animate">
        <ImageFrame
          src={assets.allMembersImg}
          alt="Group of club members"
          aspect="3/2"
          fit="cover"
          variant="soft"
          rounded="2xl"
          className="w-full max-w-md md:max-w-lg"
        />
      </div>
    </section>
  );
};

export default HeroSection;
