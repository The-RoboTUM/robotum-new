import { partners as partnerGroups } from "@data";
import Button from "@components/ui/Button";

/**
 * PartnersSection
 * - Desktop: two animated marquee lanes in opposite directions.
 * - Mobile: static responsive logo grid (no animation issues).
 * - Accessible, responsive, and uses globals.css tokens.
 */
export default function PartnersSection() {
  // Flatten all categories into a single list while retaining the group title
  const allPartners = partnerGroups.flatMap((group) =>
    group.partners.map((p) => ({ ...p, groupTitle: group.title })),
  );

  // Duplicate arrays to create seamless marquee loops (for desktop/tablet)
  const laneA = [...allPartners, ...allPartners];
  const laneB = [
    ...allPartners.slice().reverse(),
    ...allPartners.slice().reverse(),
  ];

  return (
    <section
      className="section-container font-sans surface-light"
      role="region"
      aria-labelledby="partners-heading"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div className="text-left">
          <p className="text-xs tracking-widest text-[#0A1A2F]/60 uppercase mb-2">
            Thank you to our community of supporters
          </p>
          <h2
            id="partners-heading"
            className="heading heading-h1 font-bold leading-tight text-[#0A1A2F]"
          >
            Our <span className="text-gradient">Sponsors &amp; Partners</span>
          </h2>
        </div>
        <div>
          <Button to="/partners" variant="primary-light">
            Meet Our Partners →
          </Button>
        </div>
      </div>

      {/* DESKTOP / TABLET: marquee lanes */}
      <div className="hidden sm:block">
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
      </div>

      {/* MOBILE: uniform logo tiles (no animation) */}
      <div className="sm:hidden">
        <div
          className="w-full rounded-2xl bg-white ring-1 ring-accent/15 px-4 py-5"
          aria-label="Partners logos"
        >
          <div className="grid grid-cols-2 gap-3">
            {allPartners.map((partner) => (
              <LogoItem key={partner.name} partner={partner} variant="tile" />
            ))}
          </div>
        </div>

        <p className="mt-4 text-xs text-[#0A1A2F]/60 text-center">
          Tap a logo to visit the partner&apos;s website.
        </p>
      </div>
    </section>
  );
}

/**
 * Single logo item
 * Keeps things visually consistent without heavy frames/shadows.
 * Uses grayscale + dimming by default on light surface; full color on hover/focus.
 */
function LogoItem({ partner, variant = "default" }) {
  const isTile = variant === "tile";

  return (
    <a
      href={partner.link}
      target="_blank"
      rel="noopener noreferrer"
      role="listitem"
      className={
        isTile
          ? "group/logo block rounded-xl bg-[#F3F4F6] px-3 py-3 border border-accent/10 items-center justify-center cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          : "inline-flex flex-col items-center justify-center cursor-pointer select-none group/logo focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded-md"
      }
      aria-label={partner.name}
      title={partner.name}
    >
      {/* chip with group title (hidden in compact tile variant) */}
      {!isTile && (
        <span className="hidden md:inline-block mb-2 px-3 py-0.5 border border-accent/15 text-[11px] rounded-full text-accent/80 bg-[#0A1A2F]/5">
          {partner.groupTitle}
        </span>
      )}

      {/* Logo */}
      <img
        src={partner.logo}
        alt={partner.name}
        className={
          isTile
            ? "max-h-8 w-auto object-contain transition-transform duration-300 filter grayscale opacity-80 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 group-hover/logo:scale-[1.03]"
            : "h-7 sm:h-9 md:h-11 lg:h-12 object-contain transition-transform duration-300 filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 group-hover/logo:scale-[1.04] will-change-transform"
        }
        loading="lazy"
        draggable="false"
      />
    </a>
  );
}
