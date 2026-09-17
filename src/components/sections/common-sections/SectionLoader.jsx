import * as assets from "@assets";

export default function SectionLoader() {
  return (
    <div
      className="
        w-full
        py-10
        flex
        flex-col
        items-center
        justify-center
        gap-4
      "
      aria-label="Section loading"
    >
      <div className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-md">
        <img
          src={assets.navLogo}
          alt="roboTUM logo"
          className="h-8 w-auto opacity-90"
        />
      </div>

      <div className="space-y-2 text-center">
        <p className="text-xs tracking-[0.25em] uppercase text-white/60">
          Loading section
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce [animation-delay:-0.25s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-accent/80 animate-bounce [animation-delay:-0.1s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-accent/60 animate-bounce [animation-delay:0.05s]" />
        </div>
      </div>
    </div>
  );
}
