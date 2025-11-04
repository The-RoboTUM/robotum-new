import * as assets from '@assets'
import Button from '@components/ui/Button'

const HeroSection = () => {
  return (
    <section className="w-full min-h-[70vh] lg:min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 md:px-16 py-20 md:py-28 text-white font-sans surface-2 edge-fade-bottom surface-wrap surface-pattern overflow-hidden">
      {/* Left side: text content */}
      <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
        <h1 className="text-hero md:text-display font-bold leading-tight [text-wrap:balance]">
          Get inspired, <br /> get involved!
        </h1>
        <p className="text-text2 md:text-text1 text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
          We are an interdisciplinary student club at TUM focused on robotics, innovation, and teamwork.
        </p>
        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
          <Button variant="primary" as="link" to="/apply">
            Apply Now →
          </Button>
          <Button variant="secondary" as="link" to="/about">
            Learn More
          </Button>
        </div>
      </div>

      {/* Right side: image */}
      <div className="w-full lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
        <img
          src={assets.allMembersImg}
          alt="Group of club members"
          className="rounded-2xl object-cover w-full max-w-md md:max-w-lg shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
        />
      </div>
    </section>
  )
}

export default HeroSection

