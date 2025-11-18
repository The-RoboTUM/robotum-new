import ImageFrame from "@components/ui/ImageFrame";
import { partners } from "@data";

const PartnerCategories = () => {
  return (
    <section
      id="partner-categories"
      className="section-container py-20 section-dark-secondary surface-pattern"
    >
      <div className="space-y-24">
        {partners.map((type, idx) => (
          <div key={idx} className="text-center relative animate-fadeIn">
            {/* Decorative divider with gradient */}
            {idx > 0 && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-2/3 h-px 
                  bg-linear-to-r from-transparent via-white/30 to-transparent" />
            )}

            <h2 className="heading heading-h2 text-slate-50 mb-12 font-semibold">
              {type.title}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10 place-items-center">
              {type.partners.map((p, i) => (
                <a
                  key={i}
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={p.name}
                  title={p.name}
                  className="group relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center 
                 rounded-2xl bg-white/5 border border-white/10 backdrop-blur
                 shadow-[0_18px_45px_rgba(15,23,42,0.55)]
                 hover:border-accent/60 hover:bg-white/8
                 transition-all duration-400 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-tr from-accent/0 via-accent/10 to-[#7C3AED]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <ImageFrame
                    src={p.logo}
                    alt={p.name}
                    fit="contain"
                    variant="none"
                    rounded="none"
                    className="shadow-none max-w-[70%] max-h-[70%] transition-transform duration-400 group-hover:scale-110"
                  />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Subtle flowing background accent */}
      <div className="absolute inset-0 -z-10 opacity-[0.08] bg-[radial-gradient(circle_at_50%_20%,#2563EB_0%,transparent_70%)]"></div>
    </section>
  );
};

export default PartnerCategories;
