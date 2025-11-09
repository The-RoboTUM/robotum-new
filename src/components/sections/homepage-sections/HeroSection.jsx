import * as assets from '@assets'
import Button from '@components/ui/Button'

/**
 * HeroSection — refined with global typography and Figma-like heading tracking
 * - Uses .heading class for Exo bold style with tracking
 * - Consistent surfaces, adaptive height, and spacing
 */
export default function HeroSection({
  title = 'Shaping the Future of Robotics',
  subtitle = 'Connecting academia and industry to push robotics innovation forward.',
  ctaPrimary = 'Become a Member',
  ctaPrimaryTo = '/join',
  ctaSecondary = 'Become a Partner',
  ctaSecondaryTo = '/partners#contact',
}) {
  return (
    <section
      id="hero"
      role="region"
      aria-labelledby="hero-heading"
      className="section-container relative min-h-screen flex flex-col items-center justify-center text-white font-sans surface-1 edge-fade-bottom surface-wrap surface-pattern overflow-hidden"
    >
      {/* Background overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/30" />

      {/* Content container */}
      <div className="relative z-10 max-w-7xl w-full flex flex-col items-center text-center space-y-8">
        {/* Logo */}
        <img
          src={assets.navLogo}
          alt="RoboTUM logo"
          className="w-36 sm:w-44 md:w-56 h-auto drop-shadow-lg mb-6"
          loading="eager"
          decoding="async"
        />

        {/* Heading */}
        <h1
          id="hero-heading"
          className="heading heading-display text-hero md:text-display leading-tight tracking-(--tracking-headings text-balance"
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-text1 text-white/80 leading-relaxed max-w-3xl mx-auto text-balance">
            {subtitle}
          </p>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 pt-4">
          <Button variant="primary" as="link" to={ctaPrimaryTo}>
            {ctaPrimary}
          </Button>
          {ctaSecondary && (
            <Button variant="secondary" as="link" to={ctaSecondaryTo}>
              {ctaSecondary}
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}