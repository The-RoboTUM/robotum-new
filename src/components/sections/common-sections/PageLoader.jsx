import * as assets from "@assets";

export default function PageLoader() {
  return (
    <section
      className="
        section-dark-primary
        w-full
        flex
        items-center
        justify-center
        py-16
        min-h-[60vh]
      "
      aria-label="Page loading"
    >
      <div className="text-center space-y-6">
        {/* Logo in a soft glassmorphism card */}
        <div className="inline-flex items-center justify-center rounded-3xl border border-white/15 bg-white/5 px-8 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.65)] backdrop-blur">
          <img
            src={assets.navLogo}
            alt="RoboTUM logo"
            className="h-10 sm:h-12 w-auto"
          />
        </div>

        {/* Loading text + animated dots */}
        <div className="space-y-2">
          <p className="text-xs tracking-[0.35em] uppercase text-white/60">
            Loading
          </p>

          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.25s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent/80 animate-bounce [animation-delay:-0.1s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent/60 animate-bounce [animation-delay:0.05s]" />
          </div>

          <p className="text-sm text-white/60 mt-2">
            Getting things ready for you…
          </p>
        </div>
      </div>
    </section>
  );
}