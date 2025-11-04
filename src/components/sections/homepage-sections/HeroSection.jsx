import * as assets from '@assets'
import Button from '@components/ui/Button'

/**
 * HeroSection — fully aligned with global design system
 * - Uses surface-1 background, edge fades, and pattern overlay
 * - Responsive typography mapped to tokens (display / hero / text1)
 * - Improved spacing, adaptive height, and visual hierarchy
 */
export default function HeroSection({
  title = 'Shaping the Future of Robotics',
  subtitle = 'Connecting academia and industry to push robotics innovation forward.',
  ctaPrimary = 'Become a Member',
  ctaPrimaryTo = '/join',
  ctaSecondary = 'Become a Partner',
  ctaSecondaryTo = '/#partners',
}) {
  return (
    <section
      id="hero"
      role="region"
      aria-labelledby="hero-heading"
      className="relative w-full min-h-[70vh] lg:min-h-screen flex flex-col items-center justify-center px-6 md:px-12 py-20 md:py-28 lg:py-32 text-white font-sans surface-1 edge-fade-bottom surface-wrap surface-pattern overflow-hidden"
    >
      {/* Background overlay for readability */}
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
          className="text-display md:text-hero font-bold leading-tight tracking-tight [text-wrap:balance]"
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-text1 text-white/80 leading-relaxed max-w-3xl mx-auto [text-wrap:balance]">
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