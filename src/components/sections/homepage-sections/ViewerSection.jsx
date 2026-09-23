import { useState } from "react";
import SectionLoader from "@components/sections/common-sections/SectionLoader";
import { fetchProjectsWithViewers } from "@data";
import { useAsyncData } from "@hooks/useAsyncData";
import { getProjectViewerConfig } from "@pages/project-viewers/viewerConfig";
import ProjectViewer from "@pages/ProjectViewer";

async function loadHomepageViewers() {
  const projects = await fetchProjectsWithViewers();

  return projects.flatMap((project) => {
    const config = getProjectViewerConfig(project.viewer_id);

    if (!config || config.showOnHomepage === false) {
      return [];
    }

    return [{ project, config }];
  });
}

export default function ViewerSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    data: viewers,
    loading,
    error: errorMsg,
  } = useAsyncData(loadHomepageViewers, [], {
    initialData: [],
    errorMessage: "Failed to load the 3D viewers. Please try again later.",
  });
  const safeActiveIndex = Math.min(
    activeIndex,
    Math.max(viewers.length - 1, 0),
  );
  const activeViewer = viewers[safeActiveIndex];

  return (
    <section
      id="project-viewers"
      className="section-container text-white font-sans section-dark-primary surface-pattern"
      aria-labelledby="project-viewers-heading"
    >
      <div className="mb-10 md:mb-14">
        <p className="mb-2 text-xs uppercase tracking-widest text-white/60">
          Interactive models
        </p>
        <h2
          id="project-viewers-heading"
          className="heading heading-h2 max-w-3xl font-bold leading-tight"
        >
          Meet Our Robots <span className="text-gradient">in 3D</span>
        </h2>
      </div>

      {loading ? (
        <SectionLoader />
      ) : errorMsg ? (
        <p className="text-center text-sm text-red-400">{errorMsg}</p>
      ) : viewers.length === 0 ? (
        <p className="text-center text-sm text-white/70">
          Interactive project models will appear here soon.
        </p>
      ) : (
        <div>
          <div
            id="homepage-project-viewer"
            role="region"
            aria-label={`${activeViewer.config.title || activeViewer.project.name} interactive 3D viewer`}
          >
            <ProjectViewer
              project={activeViewer.project}
              inline
              withTopMargin={false}
              previewSrc={
                activeViewer.config.homepagePreviewSrc ||
                activeViewer.config.previewSrc
              }
            />
          </div>

          {viewers.length > 1 && (
            <div
              className="mt-4 flex flex-wrap items-center justify-center gap-1.5"
              role="group"
              aria-label="Choose an interactive project model"
            >
              {viewers.map(({ project, config }, index) => {
                const isActive = index === safeActiveIndex;

                return (
                  <button
                    key={`${project.id}-${project.viewer_id}`}
                    type="button"
                    aria-pressed={isActive}
                    aria-controls="homepage-project-viewer"
                    onClick={() => setActiveIndex(index)}
                    className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
                      isActive
                        ? "border-white/20 bg-white/10 text-white/80"
                        : "border-transparent text-white/45 hover:border-white/10 hover:bg-white/5 hover:text-white/70"
                    }`}
                  >
                    {config.title || project.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
