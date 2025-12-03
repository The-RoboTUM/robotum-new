import { useEffect, useState } from "react";
import Button from "@components/ui/Button";
import SectionLoader from "@components/sections/common-sections/SectionLoader";
import { fetchActivePartners } from "@data"; // centralized data logic

/**
 * PartnersSection
 * - All viewports: one endless animated marquee lane.
 * - Logos are raw <img> with no backgrounds, tiles, or borders.
 */
export default function PartnersSection() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadPartners = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const data = await fetchActivePartners();
        setPartners(data);
      } catch (error) {
        console.error(error);
        setErrorMsg("Failed to load partners. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadPartners();
  }, []);

  const allPartners = partners.map((p) => ({
    ...p,
    groupTitle: formatCategory(p.category),
  }));

  // Duplicate for seamless loop
  const marqueeItems = [...allPartners, ...allPartners];

  return (
    <section
      className="section-container font-sans section-light surface-pattern"
      role="region"
      aria-labelledby="partners-heading"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div className="text-left">
          <p className="text-xs tracking-widest text-white/60 uppercase mb-2">
            Thank you to our community of supporters
          </p>
          <h2
            id="partners-heading"
            className="heading heading-h2 font-bold leading-tight"
          >
            Our <span className="text-gradient">Sponsors &amp; Partners</span>
          </h2>
        </div>
        <Button to="/partners" variant="secondary">
          Meet Our Partners →
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <SectionLoader />
      ) : errorMsg ? (
        <p className="text-center text-sm text-red-400">{errorMsg}</p>
      ) : allPartners.length === 0 ? (
        <p className="text-center text-sm text-white/60">
          Partners will appear here soon.
        </p>
      ) : (
        <div
          className="relative w-full overflow-hidden rounded-2xl bg-white ring-1 ring-accent/15"
          aria-live="polite"
        >
          {/* Left/Right decorative fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-white to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-white to-transparent z-20" />

          {/* Marquee */}
          <div className="whitespace-nowrap" role="list">
            <div className="flex min-w-full items-center gap-10 sm:gap-12 py-5 px-6 animate-marquee motion-reduce:animate-none">
              {marqueeItems.map((partner, idx) => {
                const Wrapper = partner.website_url ? "a" : "div";
                return (
                  <Wrapper
                    key={`partner-${partner.id}-${idx}`}
                    href={partner.website_url || undefined}
                    target={partner.website_url ? "_blank" : undefined}
                    rel={partner.website_url ? "noopener noreferrer" : undefined}
                    aria-label={partner.name}
                    className="flex-none"
                  >
                    <img
                      src={partner.logo_url}
                      alt={partner.name}
                      draggable="false"
                      loading="lazy"
                      className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                    />
                  </Wrapper>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/** Format enum category */
function formatCategory(category) {
  if (!category) return "Partner";
  return category
    .toString()
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}