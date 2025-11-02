import { Link } from 'react-router-dom'
import * as assets from '@assets'
import Button from '@components/ui/Button'

/**
 * HeroSection
 * - Uses design tokens (CSS vars) and Tailwind utilities
 * - Responsive typography mapped to your system: display / h1 / text1
 * - Reusable via simple props for title and CTAs
 */
export default function HeroSection({
  title = 'Shaping the Future of Robotics',
  subtitle = '',
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
      className="relative w-full min-h-screen px-6 py-20 md:py-28 lg:py-32 text-white font-sans surface-1 edge-fade-bottom surface-wrap surface-pattern overflow-hidden"
    >
      {/* Dark overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 flex items-center">
        <div className="mx-auto max-w-7xl w-full grid place-items-center text-center">
          {/* Logo */}
          <img
            src={assets.navLogo}
            alt="RoboTUM logo"
            className="w-36 sm:w-44 md:w-56 h-auto mb-8 drop-shadow"
            loading="eager"
            decoding="async"
          />

          {/* Heading */}
          <h1
            id="hero-heading"
            className="font-bold leading-tight tracking-tight text-balance text-hero md:text-display"
          >
            {title}
          </h1>

          {/* Subtext (optional): map to text1 scale if you add subtitle later */}
          {subtitle && (
            <p className="mt-4 text-white/80 max-w-3xl text-text1 text-balance mx-auto">
              {subtitle}
            </p>
          )}

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Button variant="primary" as="link" to={ctaPrimaryTo}>
              {ctaPrimary}
            </Button>
            {ctaSecondary ? (
              <Button variant="secondary" as="link" to={ctaSecondaryTo}>
                {ctaSecondary}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
    
  )
}