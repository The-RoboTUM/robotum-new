import { partners as partnerGroups } from "@data";
import Button from "@components/ui/Button";

/**
 * PartnersSection
 * - Single compact white card with two marquee lanes moving in opposite directions.
 * - Accessible (aria labels), responsive, and motion-reduced friendly.
 * - Harmonizes with globals.css tokens (surface-light, section-container, edge-fade-*).
 */
export default function PartnersSection() {
  // Flatten all categories into a single list while retaining the group title
  const allPartners = partnerGroups.flatMap((group) =>
    group.partners.map((p) => ({ ...p, groupTitle: group.title })),
  );

  // Duplicate arrays to create seamless marquee loops
  const laneA = [...allPartners, ...allPartners];
  const laneB = [
    ...allPartners.slice().reverse(),
    ...allPartners.slice().reverse(),
  ];

  return (
    <section
      className="section-container font-sans surface-light edge-fade-top edge-fade-bottom"
      role="region"
      aria-labelledby="partners-heading"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div className="text-left">
          <p className="text-[#0A1A2F]/60 text-sm md:text-base">
            Thank you to our community of supporters
          </p>
          <h2
            id="partners-heading"
            className="heading heading-h1 font-bold leading-tight text-[#0A1A2F]"
          >
            Our Sponsors &amp; Partners
          </h2>
        </div>
        <div>
          <Button to="/partners" variant="primary-light">
            View all partners →
          </Button>
        </div>
      </div>

      {/* Track wrapper */}
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-white ring-1 ring-accent/15"
        aria-live="polite"
      >
        {/* Left/Right decorative fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-white to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-white to-transparent z-20" />

        {/* Lane A (left to right) */}
        <div
          className="group whitespace-nowrap"
          aria-label="Partners marquee lane A"
          role="list"
        >
          <div className="flex min-w-full items-center gap-10 sm:gap-12 py-5 sm:py-6 px-6 animate-marquee motion-reduce:animate-none">
            {laneA.map((partner, idx) => (
              <LogoItem key={`A-${partner.name}-${idx}`} partner={partner} />
            ))}
          </div>
        </div>

        {/* Divider between lanes */}
        <div className="h-px bg-accent/10" />

        {/* Lane B (right to left) */}
        <div
          className="group whitespace-nowrap"
          aria-label="Partners marquee lane B"
          role="list"
        >
          <div className="flex min-w-full items-center gap-10 sm:gap-12 py-5 sm:py-6 px-6 animate-marquee-reverse motion-reduce:animate-none">
            {laneB.map((partner, idx) => (
              <LogoItem key={`B-${partner.name}-${idx}`} partner={partner} />
            ))}
          </div>
        </div>
      </div>

      {/* Small caption on mobile */}
      <p className="mt-4 md:hidden text-xs text-[#0A1A2F]/60 text-center">
        Logos scroll automatically. Tap a logo to visit the partner&apos;s
        website.
      </p>
    </section>
  );
}

/**
 * Single logo item
 * Keeps things visually consistent without heavy frames/shadows.
 * Uses grayscale + dimming by default on light surface; full color on hover/focus.
 */
function LogoItem({ partner }) {
  return (
    <a
      href={partner.link}
      target="_blank"
      rel="noopener noreferrer"
      role="listitem"
      className="inline-flex flex-col items-center justify-center cursor-pointer select-none group/logo focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded-md"
      aria-label={partner.name}
      title={partner.name}
    >
      {/* chip with group title (hide on small for compactness) */}
      <span className="hidden md:inline-block mb-2 px-3 py-0.5 border border-accent/15 text-[11px] rounded-full text-accent/80 bg-[#0A1A2F]/5">
        {partner.groupTitle}
      </span>

      {/* Logo */}
      <img
        src={partner.logo}
        alt={partner.name}
        className="h-7 sm:h-9 md:h-11 lg:h-12 object-contain transition-transform duration-300 filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 group-hover/logo:scale-[1.04] will-change-transform"
        loading="lazy"
        draggable="false"
      />
    </a>
  );
}
