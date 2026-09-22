import { useEffect, useRef, useState } from "react";
import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Button from "@components/ui/Button";
import { fetchProjectBySlug } from "@data";
import { useAsyncData } from "@hooks/useAsyncData";
import { getProjectViewerConfig } from "@pages/project-viewers/viewerConfig";

function isViewerEnabled(searchParams) {
  return searchParams.get("3dmodelviewer") === "on";
}

function ExpandIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 3H3v5" />
      <path d="M16 3h5v5" />
      <path d="M8 21H3v-5" />
      <path d="M16 21h5v-5" />
    </svg>
  );
}

function CollapseIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 8H3V3" />
      <path d="M16 8h5V3" />
      <path d="M8 16H3v5" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

function PowerIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2v10" />
      <path d="M18.4 6.6a9 9 0 1 1-12.8 0" />
    </svg>
  );
}

function InteractionIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 11V7a2 2 0 0 1 4 0v4" />
      <path d="M12 11V5a2 2 0 0 1 4 0v6" />
      <path d="M16 11V8a2 2 0 0 1 4 0v6c0 5-3 8-8 8h-1c-3 0-5-1-7-4l-2-3a2 2 0 0 1 3-2l3 2V9a2 2 0 0 1 4 0" />
    </svg>
  );
}

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

const iconButtonClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/55 text-white/60 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40";

export default function ProjectViewer({
  project: initialProject = null,
  inline = false,
}) {
  const { slug } = useParams();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] =
    useState(false);

  const interactionContainerRef = useRef(null);

  const {
    data: loadedProject,
    loading,
    error,
  } = useAsyncData(
    () =>
      initialProject
        ? initialProject
        : fetchProjectBySlug(slug),
    [slug, initialProject?.id],
    {
      errorMessage: "Failed to load project viewer.",
      initialData: initialProject,
    },
  );

  const project = loadedProject || initialProject;

  const config = getProjectViewerConfig(
    project?.viewer_id,
  );

  const ViewerComponent = config?.component;

  const viewerEnabled =
    isViewerEnabled(searchParams) &&
    Boolean(ViewerComponent);

  useEffect(() => {
    if (inline) return;

    document.title = config
      ? `${config.title} | roboTUM`
      : "Project Viewer | roboTUM";

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [config, inline]);

  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isExpanded]);

  useEffect(() => {
    if (!viewerEnabled || hasInteracted) return;

    const container =
      interactionContainerRef.current;

    if (!container) return;

    const markAsInteracted = () => {
      setHasInteracted(true);
    };

    container.addEventListener(
      "pointerdown",
      markAsInteracted,
      {
        once: true,
      },
    );

    container.addEventListener(
      "wheel",
      markAsInteracted,
      {
        once: true,
        passive: true,
      },
    );

    container.addEventListener(
      "touchstart",
      markAsInteracted,
      {
        once: true,
        passive: true,
      },
    );

    return () => {
      container.removeEventListener(
        "pointerdown",
        markAsInteracted,
      );

      container.removeEventListener(
        "wheel",
        markAsInteracted,
      );

      container.removeEventListener(
        "touchstart",
        markAsInteracted,
      );
    };
  }, [
    viewerEnabled,
    hasInteracted,
    isExpanded,
  ]);

  const turnViewerOff = () => {
    setIsExpanded(false);
    setHasInteracted(false);

    const nextSearchParams =
      new URLSearchParams(searchParams);

    nextSearchParams.delete("3dmodelviewer");

    setSearchParams(nextSearchParams, {
      replace: true,
    });
  };

  if (loading && !project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-xs uppercase tracking-[0.2em] text-white/50">
        Loading viewer
      </main>
    );
  }

  if (
    error ||
    !project ||
    !config ||
    !config.showOnProjectPage
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <div className="max-w-xl text-center">
          <h1 className="heading heading-h2 mb-6">
            Project viewer unavailable
          </h1>
        </div>
      </main>
    );
  }

  const renderViewerContent = () => {
    if (viewerEnabled) {
      return (
        <ViewerComponent
          config={config}
          project={project}
        />
      );
    }

    return (
      <div className="relative h-full w-full section-dark-primary surface-pattern">
        <img
          src={config.previewSrc}
          alt={config.alt}
          className="h-full w-full object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.62)_100%)]" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end p-6 sm:p-10">
          <div className="flex w-full flex-col gap-5 min-[450px]:flex-row min-[450px]:items-end min-[450px]:justify-between">
            <div>
              <p className="text-xl font-bold">
                {config.title}
              </p>

              <p className="mt-1 text-xs text-white/45">
                {config.subtitle}
              </p>
            </div>

            <Button
              as={Link}
              to={
                inline
                  ? "?3dmodelviewer=on"
                  : `/3d-viewer/${project.slug}?3dmodelviewer=on`
              }
              variant="primary"
              className="pointer-events-auto px-5 py-3 text-xs uppercase tracking-[0.16em] shadow-[0_0_28px_rgba(37,99,235,0.45)]"
            >
              Start 3D viewer
            </Button>
          </div>
        </div>
      </div>
    );
  };

  /*
   * INLINE
   */
  if (inline) {
    /*
     * EXPANDED
     */
    if (isExpanded) {
      return (
        <div
          ref={interactionContainerRef}
          className="fixed inset-0 z-[9999] h-dvh w-screen overflow-hidden bg-black text-white"
          role="dialog"
          aria-modal="true"
          aria-label={`${config.title} fullscreen viewer`}
        >
          {renderViewerContent()}

          {viewerEnabled && (
            <div className="absolute inset-x-5 top-24 z-[10000] grid h-11 grid-cols-[1fr_auto_1fr] items-center sm:inset-x-8">
              {/* Turn viewer off */}
              <div className="justify-self-start">
                <button
                  type="button"
                  onClick={turnViewerOff}
                  className={iconButtonClass}
                  aria-label="Turn 3D viewer off"
                  title="Turn viewer off"
                >
                  <PowerIcon />
                </button>
              </div>

              {/* Initial interaction hint */}
              <div className="justify-self-center">
                {!hasInteracted && (
                  <InteractionHint />
                )}
              </div>

              {/* Collapse */}
              <div className="justify-self-end">
                <button
                  type="button"
                  onClick={() =>
                    setIsExpanded(false)
                  }
                  className={iconButtonClass}
                  aria-label="Exit fullscreen viewer"
                  title="Exit fullscreen"
                >
                  <CollapseIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute bottom-5 right-6 z-20 hidden text-[10px] uppercase tracking-[0.14em] text-white/30 md:block">
            Esc to exit
          </div>
        </div>
      );
    }

    /*
     * NORMAL INLINE
     */
    return (
      <section
        ref={interactionContainerRef}
        className="group relative mt-6 h-[min(78vh,760px)] min-h-[460px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black transition-colors hover:border-white/20"
      >
        {renderViewerContent()}

        {/*
         * Controls are only shown when the actual
         * interactive viewer has been activated.
         */}
        {viewerEnabled && (
          <div className="absolute inset-x-4 top-4 z-50 grid h-10 grid-cols-[1fr_auto_1fr] items-center">
            {/* Turn viewer off */}
            <div className="justify-self-start">
              <button
                type="button"
                onClick={turnViewerOff}
                className={iconButtonClass}
                aria-label="Turn 3D viewer off"
                title="Turn viewer off"
              >
                <PowerIcon />
              </button>
            </div>

            {/* Initial interaction hint */}
            <div className="justify-self-center">
              {!hasInteracted && (
                <InteractionHint />
              )}
            </div>

            {/* Expand */}
            <div className="justify-self-end">
              <button
                type="button"
                onClick={() =>
                  setIsExpanded(true)
                }
                className={iconButtonClass}
                aria-label="Expand 3D viewer"
                title="Expand viewer"
              >
                <ExpandIcon />
              </button>
            </div>
          </div>
        )}
      </section>
    );
  }

  /*
   * STANDALONE
   */
  return (
    <main
      ref={interactionContainerRef}
      className="fixed inset-0 h-dvh w-screen overflow-hidden bg-black text-white"
    >
      {renderViewerContent()}

      {viewerEnabled && (
        <div className="absolute inset-x-6 top-24 z-30 grid h-10 grid-cols-[1fr_auto_1fr] items-center sm:inset-x-10">
          <div className="justify-self-start">
            <button
              type="button"
              onClick={turnViewerOff}
              className={iconButtonClass}
              aria-label="Turn 3D viewer off"
              title="Turn viewer off"
            >
              <PowerIcon />
            </button>
          </div>

          <div className="justify-self-center">
            {!hasInteracted && (
              <InteractionHint />
            )}
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-6 sm:p-10">
        <Link
          to={`/projects/${project.slug}`}
          className="pointer-events-auto text-xs uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white"
        >
          Back to project
        </Link>

        <Link
          to="/"
          className="pointer-events-auto text-xs uppercase tracking-[0.18em] text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white"
        >
          roboTUM
        </Link>
      </div>
    </main>
  );
}