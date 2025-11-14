import * as assets from "@assets";
import Button from "@components/ui/Button";

/**
 * HeroSection — minimal, creative, and responsive
 * - Layered background: soft radial glows + subtle grid overlay
 * - Motion-safe shimmer: uses opacity pulse only for users who allow motion
 * - Clean center layout that works on both mobile & desktop
 * - Uses global typography tokens: .heading, .heading-display, .text-text1
 */
export default function HeroSection({
  ctaPrimary = "Become a Member",
  ctaPrimaryTo = "/join",
  ctaSecondary = "Become a Partner",
  ctaSecondaryTo = "/partners",
}) {
  return (
    <section
      id="hero"
      role="region"
      aria-labelledby="hero-heading"
      className="relative w-full min-h-screen text-white font-sans surface-1 edge-fade-bottom hero-orbit-bg"
    >
      {/* ===== Background: layered glows + subtle grid ===== */}
      {/* Base dark fill */}
      <div className="absolute inset-0 -z-20 bg-[#000C21]" />

      {/* Soft radial glows (no heavy animation; motion-safe pulse) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[60vh] w-[80vw] -translate-x-1/2 rounded-[999px] blur-3xl opacity-50 md:opacity-60
                   bg-[radial-gradient(60%_60%_at_50%_40%,rgba(0,49,135,0.45),transparent_70%)] motion-safe:animate-pulse"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20vh] right-[-10vw] h-[55vh] w-[55vw] rounded-[999px] blur-2xl opacity-40 md:opacity-50
                   bg-[radial-gradient(55%_55%_at_50%_50%,rgba(124,58,237,0.35),transparent_70%)] motion-safe:animate-pulse"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[10vh] left-[-10vw] h-[40vh] w-[45vw] rounded-[999px] blur-2xl opacity-35
                   bg-[radial-gradient(55%_55%_at_50%_50%,rgba(59,130,246,0.35),transparent_70%)] motion-safe:animate-pulse"
      />

      {/* Subtle grid overlay (SVG pattern) */}
      <svg
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.15] mix-blend-overlay"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="hero-grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M48 0H0V48"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* ===== Content ===== */}
      <div className="section-container relative z-10 flex min-h-screen flex-col items-center justify-center text-center">
        {/* Badge */}
        <div className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          <span className="text-[12px] tracking-[0.12em] uppercase text-white/70">
            Student Robotics at TUM
          </span>
        </div>

        {/* Logo */}
        <img
          src={assets.navLogo}
          alt="RoboTUM logo"
          className="w-36 sm:w-44 md:w-56 h-auto drop-shadow-lg mb-6"
          loading="eager"
          decoding="async"
        />

        {/* Heading with gradient accent on 'Robotics' */}
        <h1
          id="hero-heading"
          className="heading heading-display text-hero md:text-display leading-tight text-balance hero-animate"
        >
          Shaping the Future of <span className="text-gradient">Robotics</span>
        </h1>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 hero-animate">
          <Button variant="primary" as="link" to={ctaPrimaryTo}>
            {ctaPrimary}
          </Button>
          {ctaSecondary && (
            <Button variant="secondary" to={ctaSecondaryTo}>
              {ctaSecondary}
            </Button>
          )}
        </div>

        {/* Tiny helper hint for scroll */}
        <div className="mt-12 flex flex-col items-center text-white/60">
          <div className="h-10 w-px bg-linear-to-b from-transparent via-white/30 to-transparent" />
          <span className="mt-2 text-[12px] tracking-[0.18em] uppercase">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
