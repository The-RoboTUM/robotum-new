import React from 'react'
import * as assets from '@assets'
import Button from '@components/ui/Button'
import ImageFrame from '@components/ui/ImageFrame'

/**
 * Events → Hero Section
 * - Uses global heading helpers and design tokens
 * - Matches the typography tracking from Figma (via .heading)
 * - Consistent surfaces, spacing, and accessibility
 */
const HeroSection = () => {
  return (
    <section
      className="section-container min-h-[70vh] lg:min-h-screen font-sans text-white surface-2 edge-fade-bottom surface-wrap surface-pattern overflow-hidden"
      aria-labelledby="events-hero-heading"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-14">
        {/* Visual */}
        <div className="w-full lg:w-1/2">
          <ImageFrame
            src={assets.eventsHero}
            alt="Robot and speaker at event"
            aspect="3/2"
            fit="cover"
            variant="soft"
            rounded="2xl"
            className="w-full"
          />
        </div>

        {/* Copy + CTAs */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1
            id="events-hero-heading"
            className="heading heading-h1 font-bold leading-tight text-balance mb-6 md:mb-8"
          >
            Where ideas <br /> connect and grow!
          </h1>

          <p className="text-text2 md:text-text1 text-white/80 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-6 md:mb-8">
            Join thought‑provoking events that bring together students, professionals, and innovators. From inspiring keynotes to interactive workshops and networking — each event offers space for exchange, reflection, and growth.
          </p>

          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center lg:justify-start">
            <Button variant="primary" as="link" to="/events#upcoming">
              View upcoming events
            </Button>
            <Button variant="secondary" as="link" to="/events#past" className="sm:ml-2">
              See past highlights
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
