import Button from "@components/ui/Button";

/**
 * MissionSection — unified with global design system
 * - Applies surface-light for contrast against dark surfaces
 * - Uses heading typography helpers (.heading)
 * - Adds balanced spacing and consistent layout rhythm
 */
export default function MissionSection() {
  return (
    <section
      id="mission"
      className="section-container text-white font-sans surface-2 edge-fade-top edge-fade-bottom surface-wrap surface-pattern"
    >
      <div>
        {/* Heading */}
        <h2 className="heading heading-h1 font-bold leading-tight text-left mb-10 md:mb-14">
          Foundations of RoboTUM
        </h2>

        {/* Content container */}
        <div className="surface-light text-[#0B1B2E] rounded-2xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 shadow-[0_6px_24px_rgba(0,0,0,0.25)]">
          {/* Vision */}
          <div className="flex flex-col gap-4">
            <h3 className="heading heading-h2 text-[1.5rem] md:text-[1.75rem] font-semibold text-primary">
              Vision
            </h3>
            <p className="text-text2 md:text-text1 text-black/80 leading-relaxed">
              To establish{" "}
              <span className="text-accent font-semibold">Munich</span> as a
              global{" "}
              <span className="text-accent font-semibold">robotics hub</span>,
              comparable to{" "}
              <span className="text-accent font-semibold">Boston</span> or{" "}
              <span className="text-accent font-semibold">Switzerland</span>.
            </p>
          </div>

          {/* Mission */}
          <div className="flex flex-col gap-4">
            <h3 className="heading heading-h2 text-[1.5rem] md:text-[1.75rem] font-semibold text-primary">
              Mission
            </h3>
            <p className="text-text2 md:text-text1 text-black/80 leading-relaxed">
              To bridge the gap between{" "}
              <span className="text-accent font-semibold">
                robotic industry
              </span>{" "}
              and <span className="text-accent font-semibold">academia</span>,
              driving{" "}
              <span className="text-accent font-semibold">innovation</span> and{" "}
              <span className="text-accent font-semibold">
                entrepreneurship
              </span>
              .
            </p>
            <div className="mt-6">
              <Button variant="primary" as="link" to="/about">
                About Us →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
