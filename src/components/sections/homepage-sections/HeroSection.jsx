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
      className="relative w-full min-h-screen px-6 py-24 text-white font-sans surface-1 edge-fade-bottom surface-wrap surface-pattern overflow-hidden"
    >
      {/* Dark overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 flex items-center">
        <div className="container mx-auto md:py-32 grid place-items-center text-center">
          {/* Logo */}
          <img
            src={assets.navLogo}
            alt="RoboTUM logo"
            className="w-40 md:w-56 h-auto mb-8 drop-shadow"
            loading="eager"
            decoding="async"
          />

          {/* Heading */}
          <h1
            id="hero-heading"
            className="font-bold leading-tight tracking-tight [text-wrap:balance] text-[clamp(2.5rem,6vw+0.5rem,7.5rem)]"
          >
            {title}
          </h1>

          {/* Subtext (optional): map to text1 scale if you add subtitle later */}
          <p className="mt-4 text-white/80 max-w-3xl text-[clamp(1.125rem,1.2vw+0.5rem,1.75rem)]">Your subtitle here</p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
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