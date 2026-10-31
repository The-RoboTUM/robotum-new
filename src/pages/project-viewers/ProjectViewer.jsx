import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import Button from "@components/ui/Button";

const VIEWER_PARAM = "3dmodelviewer";

const iconButtonClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/55 text-white/60 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40";

/** Shared 24px stroke icon shell; children are the <path>s. */
function StrokeIcon({ className = "h-4 w-4", strokeWidth = 1.8, children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const ExpandIcon = (props) => (
  <StrokeIcon {...props}>
    <path d="M8 3H3v5" />
    <path d="M16 3h5v5" />
    <path d="M8 21H3v-5" />
    <path d="M16 21h5v-5" />
  </StrokeIcon>
);

const CollapseIcon = (props) => (
  <StrokeIcon {...props}>
    <path d="M8 8H3V3" />
    <path d="M16 8h5V3" />
    <path d="M8 16H3v5" />
    <path d="M16 16h5v5" />
  </StrokeIcon>
);

const PowerIcon = (props) => (
  <StrokeIcon {...props}>
    <path d="M12 2v10" />
    <path d="M18.4 6.6a9 9 0 1 1-12.8 0" />
  </StrokeIcon>
);

const InteractionIcon = (props) => (
  <StrokeIcon strokeWidth={1.7} {...props}>
    <path d="M8 11V7a2 2 0 0 1 4 0v4" />
    <path d="M12 11V5a2 2 0 0 1 4 0v6" />
    <path d="M16 11V8a2 2 0 0 1 4 0v6c0 5-3 8-8 8h-1c-3 0-5-1-7-4l-2-3a2 2 0 0 1 3-2l3 2V9a2 2 0 0 1 4 0" />
  </StrokeIcon>
);

function InteractionHint() {
  return (
    <div className="pointer-events-none flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-black/55 px-3 text-[9px] uppercase tracking-[0.14em] text-white/50 backdrop-blur-sm sm:text-[10px]">
      <InteractionIcon className="h-4 w-4 shrink-0 text-white/60" />
      <span className="whitespace-nowrap">
        Drag to rotate
        <span className="mx-2 text-white/20">·</span>
        Scroll to zoom
      </span>
    </div>
  );
}

/** Power off · interaction hint · expand/collapse - shown once the viewer is on. */
function ViewerToolbar({ expanded, showHint, onTurnOff, onToggleExpanded }) {
  return (
    <div
      className={clsx(
        "absolute grid grid-cols-[1fr_auto_1fr] items-center",
        expanded
          ? "inset-x-5 top-24 z-10000 h-11 sm:inset-x-8"
          : "inset-x-4 top-4 z-50 h-10",
      )}
    >
      <div className="justify-self-start">
        <button
          type="button"
          onClick={onTurnOff}
          className={iconButtonClass}
          aria-label="Turn 3D viewer off"
          title="Turn viewer off"
        >
          <PowerIcon />
        </button>
      </div>

      <div className="justify-self-center">
        {showHint && <InteractionHint />}
      </div>

      <div className="justify-self-end">
        <button
          type="button"
          onClick={onToggleExpanded}
          className={iconButtonClass}
          aria-label={expanded ? "Exit fullscreen viewer" : "Expand 3D viewer"}
          title={expanded ? "Exit fullscreen" : "Expand viewer"}
        >
          {expanded ? <CollapseIcon className="h-5 w-5" /> : <ExpandIcon />}
        </button>
      </div>
    </div>
  );
}

/**
 * Inline 3D viewer on a project page. Shows a preview image until the user
 * starts it (`?3dmodelviewer=on`), then mounts the project's viewer component
 * with power-off / fullscreen controls.
 */
export default function ProjectViewer({ project, config }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef(null);

  const ViewerComponent = config?.component;
  const viewerEnabled =
    searchParams.get(VIEWER_PARAM) === "on" && Boolean(ViewerComponent);

  // Fullscreen: lock page scroll + close on Escape.
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsExpanded(false);
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  // Hide the "drag to rotate" hint after the first interaction.
  // `isExpanded` is a dep because the container element changes.
  useEffect(() => {
    if (!viewerEnabled || hasInteracted) return;

    const container = containerRef.current;
    if (!container) return;

    const markAsInteracted = () => setHasInteracted(true);
    const events = [
      ["pointerdown", { once: true }],
      ["wheel", { once: true, passive: true }],
      ["touchstart", { once: true, passive: true }],
    ];

    events.forEach(([type, options]) =>
      container.addEventListener(type, markAsInteracted, options),
    );
    return () =>
      events.forEach(([type]) =>
        container.removeEventListener(type, markAsInteracted),
      );
  }, [viewerEnabled, hasInteracted, isExpanded]);

  if (!project || !config) return null;

  const turnViewerOff = () => {
    setIsExpanded(false);
    setHasInteracted(false);

    const next = new URLSearchParams(searchParams);
    next.delete(VIEWER_PARAM);
    setSearchParams(next, { replace: true });
  };

  const content = viewerEnabled ? (
    <ViewerComponent config={config} project={project} />
  ) : (
    <div className="relative h-full w-full section-dark-primary surface-pattern">
      <img
        src={config.previewSrc}
        alt={config.alt}
        className="h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.62)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-linear-to-t from-black/95 via-black/50 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end p-6 sm:p-10">
        <div className="flex w-full flex-col gap-5 min-[450px]:flex-row min-[450px]:items-end min-[450px]:justify-between">
          <div>
            <p className="text-xl font-bold">{config.title}</p>
            <p className="mt-1 text-xs text-white/45">{config.subtitle}</p>
          </div>

          <Button
            as={Link}
            to={`?${VIEWER_PARAM}=on`}
            variant="primary"
            className="pointer-events-auto px-5 py-3 text-xs uppercase tracking-[0.16em] shadow-[0_0_28px_rgba(37,99,235,0.45)]"
          >
            Start 3D viewer
          </Button>
        </div>
      </div>
    </div>
  );

  const toolbar = viewerEnabled && (
    <ViewerToolbar
      expanded={isExpanded}
      showHint={!hasInteracted}
      onTurnOff={turnViewerOff}
      onToggleExpanded={() => setIsExpanded((v) => !v)}
    />
  );

  if (isExpanded) {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 z-9999 h-dvh w-screen overflow-hidden bg-black text-white"
        role="dialog"
        aria-modal="true"
        aria-label={`${config.title} fullscreen viewer`}
      >
        {content}
        {toolbar}
        <div className="pointer-events-none absolute bottom-5 right-6 z-20 hidden text-[10px] uppercase tracking-[0.14em] text-white/30 md:block">
          Esc to exit
        </div>
      </div>
    );
  }

  return (
    <section
      ref={containerRef}
      className="group relative mt-6 h-[min(78vh,760px)] min-h-[460px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black transition-colors hover:border-white/20"
    >
      {content}
      {toolbar}
    </section>
  );
}
