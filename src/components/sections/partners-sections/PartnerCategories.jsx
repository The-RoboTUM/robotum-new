import ImageFrame from "@components/ui/ImageFrame";
import { partners } from "@data";

const PartnerCategories = () => {
  return (
    <section className="section-container surface-light surface-wrap edge-fade-y py-20">
      <div className="space-y-24">
        {partners.map((type, idx) => (
          <div key={idx} className="text-center relative animate-fadeIn">
            {/* Decorative divider with gradient */}
            {idx > 0 && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/5 h-px bg-linear-to-r from-transparent via-accent/40 to-transparent"></div>
            )}

            <h2 className="heading heading-h2 text-[#0B1B2E] mb-12 font-semibold">
              {type.title}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10 place-items-center">
              {type.partners.map((p, i) => (
                <a
                  key={i}
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={p.name}
                  title={p.name}
                  className="group relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center bg-white/50 border border-[#E0E7FF] rounded-xl shadow-sm hover:shadow-[0_0_15px_rgba(37,99,235,0.2)] transition-shadow duration-500 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-tr from-accent/0 via-accent/5 to-[#7C3AED]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <ImageFrame
                    src={p.logo}
                    alt={p.name}
                    fit="contain"
                    variant="none"
                    rounded="none"
                    className="shadow-none max-w-[72%] max-h-[72%] transition-transform duration-500 group-hover:scale-110"
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
