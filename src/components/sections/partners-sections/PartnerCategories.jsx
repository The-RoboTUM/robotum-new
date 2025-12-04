import PartnerLogo from "@components/ui/PartnerLogo";
import { useEffect, useState } from "react";
import { fetchActivePartners } from "@data";

const PartnerCategories = () => {
  const [partners, setPartners] = useState([]);
  const [, setLoading] = useState(true);
  const [, setErrorMsg] = useState("");

  useEffect(() => {
    const loadPartners = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const data = await fetchActivePartners(); // ✅ reuse
        setPartners(data);
      } catch (error) {
        console.error(error);
        setErrorMsg("Failed to load partners.");
      } finally {
        setLoading(false);
      }
    };

    loadPartners();
  }, []);

  // Identify NEXT Prototypes from Supabase
  const isNextPrototypes = (p) =>
    p.slug === "next-prototypes" ||
    p.name?.toLowerCase().includes("next prototypes");

  const nextPrototypesPartner = partners.find(isNextPrototypes);

  // Optionally exclude NEXT Prototypes from the grouped grid to avoid duplication
  const groupedPartners = partners.filter((p) => !isNextPrototypes(p));

  const grouped = groupedPartners.reduce((acc, item) => {
    const cat = formatCategory(item.category);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  function formatCategory(category) {
    if (!category) return "Partner";
    return category
      .toString()
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return (
    <section
      id="partner-categories"
      className="relative section-container py-20 section-dark-secondary surface-pattern"
    >
      <div className="space-y-24">
        {/* NEXT Prototypes intro block (from Supabase) */}
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300/80">
            Network &amp; Community
          </p>

          <h2 className="heading heading-h2 text-slate-50">Proud member of</h2>

          {nextPrototypesPartner && (
            <div className="flex items-center justify-center mt-6">
              <a
                href={nextPrototypesPartner.website_url || undefined}
                target={
                  nextPrototypesPartner.website_url ? "_blank" : undefined
                }
                rel="noopener noreferrer"
                aria-label={nextPrototypesPartner.name}
                className="flex-none"
              >
                <img
                  src={nextPrototypesPartner.logo_url}
                  alt={nextPrototypesPartner.name}
                  draggable="false"
                  loading="lazy"
                  className="h-14 sm:h-16 md:h-20 w-auto object-contain"
                />
              </a>
            </div>
          )}
        </div>

        {Object.entries(grouped).map(([category, items], idx) => (
          <div key={category} className="text-center relative animate-fadeIn">
            {idx > 0 && (
              <div
                className="absolute -top-10 left-1/2 -translate-x-1/2 w-2/3 h-px 
                bg-linear-to-r from-transparent via-white/30 to-transparent"
              />
            )}

            <h3 className="heading heading-h2 text-slate-50 mb-12 font-semibold">
              {category}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10 place-items-center">
              {items.map((p) => (
                <PartnerLogo
                  key={p.id}
                  partner={p}
                  context="partners"
                  theme="dark"
                  className="w-28 sm:w-32"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Subtle flowing background accent */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] bg-[radial-gradient(circle_at_50%_20%,#2563EB_0%,transparent_70%)]" />
    </section>
  );
};

export default PartnerCategories;
