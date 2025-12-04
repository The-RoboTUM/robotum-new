function getPartnerTier(category) {
  if (category === "Lead Sponsor") return "lead";
  if (category === "Sponsor") return "sponsor";
  return "collaborator";
}

const LOGO_SIZE_MAP = {
  lead: {
    home: "h-10 sm:h-12 md:h-14",
    partners: "h-16 sm:h-20",
  },
  sponsor: {
    home: "h-8 sm:h-10 md:h-11",
    partners: "h-12 sm:h-16",
  },
  collaborator: {
    home: "h-7 sm:h-9 md:h-10",
    partners: "h-10 sm:h-12",
  },
};

// NOTE: flex-none so items don't get squished into vertical lines in marquee
const LOGO_TILE_BASE =
  "group/logo relative flex flex-none items-center justify-center rounded-2xl px-4 py-3 " +
  "transition-transform duration-300 overflow-hidden cursor-pointer " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60";

// Stronger outline so white logos are visible on light tiles too
const LOGO_IMG_BASE =
  "w-auto object-contain transition-transform duration-300 " +
  "filter drop-shadow-[0_0_2px_rgba(15,23,42,0.8)] " +
  "group-hover/logo:scale-[1.05]";

export default function PartnerLogo({
  partner,
  context = "home", // "home" | "partners"
  theme = "light", // "light" | "dark"
  showCategoryChip = false,
  className = "",
}) {
  const tier = getPartnerTier(partner.category);
  const imgHeightClass = LOGO_SIZE_MAP[tier]?.[context] ?? "h-10";

  // 🔹 On dark pages we use a LIGHT tile so black logos are clearly visible.
  // On light pages we use a soft grey tile.
  const surfaceClass =
    theme === "dark"
      ? "bg-slate-100 border border-slate-300 shadow-[0_18px_45px_rgba(15,23,42,0.65)]"
      : "bg-[#F3F4F6] border border-slate-200 shadow-sm";

  const Wrapper = partner.website_url ? "a" : "div";

  return (
    <Wrapper
      href={partner.website_url || undefined}
      target={partner.website_url ? "_blank" : undefined}
      rel={partner.website_url ? "noopener noreferrer" : undefined}
      aria-label={partner.name}
      title={partner.name}
      className={`${LOGO_TILE_BASE} ${surfaceClass} ${className}`}
    >
      {/* Optional chip above logo (for partners page grid, desktop) */}
      {showCategoryChip && (
        <span
          className="absolute top-2 left-2 px-2 py-0.5 text-[10px] rounded-full 
                     bg-black/40 text-white/80 backdrop-blur-sm border border-white/20"
        >
          {partner.category}
        </span>
      )}

      <img
        src={partner.logo_url}
        alt={partner.name}
        loading="lazy"
        draggable="false"
        className={`${LOGO_IMG_BASE} ${imgHeightClass}`}
      />
    </Wrapper>
  );
}
