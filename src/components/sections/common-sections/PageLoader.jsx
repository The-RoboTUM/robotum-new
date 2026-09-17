import * as assets from "@assets";

export default function PageLoader() {
  return (
    <section
      className="
        section-dark-primary
        hero-orbit-bg
        w-full
        min-h-screen
        flex
        items-center
        justify-center
        px-6
      "
      aria-label="Page loading"
    >
      <div className="text-center space-y-8 animate-fadeIn">
        {/* Logo in a soft glassmorphism card */}
        <div className="inline-flex items-center justify-center rounded-3xl border border-white/15 bg-white/5 px-10 py-6 backdrop-blur-md">
          <img
            src={assets.navLogo}
            alt="roboTUM logo"
            className="h-14 sm:h-16 w-auto"
          />
        </div>

        {/* Loading text + animated dots */}
        <div className="space-y-3">
          <p className="text-sm tracking-[0.35em] uppercase text-white/70">
            Loading
          </p>

          <div className="flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent animate-bounce [animation-delay:-0.25s]" />
            <span className="h-2 w-2 rounded-full bg-accent/80 animate-bounce [animation-delay:-0.1s]" />
            <span className="h-2 w-2 rounded-full bg-accent/60 animate-bounce [animation-delay:0.05s]" />
          </div>

          <p className="text-text2 text-white/60 mt-2">
            Getting things ready for you…
          </p>
        </div>
      </div>
    </section>
  );
}
