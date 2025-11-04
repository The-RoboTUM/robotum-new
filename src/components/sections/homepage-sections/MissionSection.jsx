import * as assets from '@assets'
import Button from '@components/ui/Button'

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
      className="w-full text-white font-sans surface-2 edge-fade-top edge-fade-bottom px-6 md:px-16 py-20 md:py-28 surface-wrap surface-pattern"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="heading heading-h2 font-bold leading-tight mb-10 md:mb-14 text-center md:text-left">
          We are a student initiative <br className="hidden md:block" />
          formed of robotic <br className="hidden md:block" />
          enthusiasts
        </h2>

        {/* Content container */}
        <div className="surface-light text-[#0B1B2E] rounded-2xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 shadow-[0_6px_24px_rgba(0,0,0,0.25)]">
          {/* Vision */}
          <div className="flex flex-col gap-4">
            <h3 className="heading heading-h2 text-[1.5rem] md:text-[1.75rem] font-semibold text-primary">
              Vision
            </h3>
            <p className="text-text2 md:text-text1 text-black/80 leading-relaxed">
              To establish Munich as a global robotics hub, comparable to Boston or Switzerland.
            </p>
          </div>

          {/* Mission */}
          <div className="flex flex-col gap-4">
            <h3 className="heading heading-h2 text-[1.5rem] md:text-[1.75rem] font-semibold text-primary">
              Mission
            </h3>
            <p className="text-text2 md:text-text1 text-black/80 leading-relaxed">
              To bridge the gap between robotic industry and academia, driving innovation and entrepreneurship.
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
  )
}