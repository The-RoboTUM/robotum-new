import { partners as partnerGroups } from "@data";

export default function PartnersSection() {
  // Flatten all categories into a single list while retaining the group title
  const allPartners = partnerGroups.flatMap((group) =>
    group.partners.map((p) => ({ ...p, groupTitle: group.title }))
  );

  return (
    <section
      className="w-full py-12 md:py-16 font-sans surface-light edge-fade-top edge-fade-bottom flex flex-col gap-8 justify-center"
      role="region"
      aria-labelledby="partners-heading"
    >
      <h2 id="partners-heading" className="sr-only">
        Our Sponsors & Partners
      </h2>

      <div className="relative w-full max-w-7xl overflow-hidden">
        {/* Optional visible heading for the combined lane */}
        <h3 className="text-white text-lg font-semibold mb-4">Our Sponsors & Partners</h3>

        {/* Left/Right gradient fades to soften edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-24 bg-linear-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-24 bg-linear-to-l from-white to-transparent" />

        {/* Single marquee lane with all logos combined */}
        <div className="flex gap-10 py-4 px-4 whitespace-nowrap overflow-hidden">
          <div
            className="flex gap-12 items-center animate-marquee"
            role="list"
            aria-label="All partners logos"
          >
            {[...allPartners, ...allPartners].map((partner, idx) => (
              <a
                key={`${partner.name}-${idx}`}
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                role="listitem"
                className="flex flex-col items-center justify-center min-w-[140px] sm:min-w-40"
              >
                <span className="mb-1 px-3 py-0.5 border border-accent text-xs rounded-full text-accent bg-accent/5">
                  {partner.groupTitle}
                </span>
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-8 sm:h-10 md:h-12 object-contain opacity-90 hover:opacity-100 transition-opacity"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
