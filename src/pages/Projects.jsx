import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ENUM_TYPES, fetchProjects } from "@data"; // Supabase
import { useAsyncData } from "@hooks/useAsyncData";
import { useEnumOptions } from "@hooks/useEnumOptions";
import ProjectCard from "@components/ui/ProjectCard";
import Button from "@components/ui/Button";
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import PageLoader from "@components/sections/common-sections/PageLoader";
import { usePageTitle } from "@hooks/usePageTitle";
import {
  filterProjects,
  resolveActiveTab,
  splitByStatus,
} from "@utils/projectFilters";

// Top tabs come from the Supabase `project_category` enum - see
// src/data/enumsApi.js. The `?type=` query param stays the category value.

// Fixed curated tag list (10 tags only)
const CURATED_TAGS = [
  "robotics",
  "ai",
  "autonomy",
  "ros2",
  "hardware",
  "software",
  "humanoid robots",
  "drones",
  "web development",
  "community",
];

export default function Projects() {
  const [params, setParams] = useSearchParams();

  const {
    data: projects,
    loading,
    error: errorMsg,
  } = useAsyncData(fetchProjects, [], {
    initialData: [],
    errorMessage: "Failed to load projects. Please try again later.",
  });

  // top tabs, driven by the project_category enum
  const { options: tabs, loading: tabsLoading } = useEnumOptions(
    ENUM_TYPES.PROJECT_CATEGORY,
  );

  // The URL is the single source of truth for tab/search/tag, so the Navbar
  // projects dropdown (which navigates to `?type=`) and back/forward always
  // update the page. A `?type=` the live enum doesn't have falls back to the
  // first tab; while the enum is still loading we trust the URL.
  const active = resolveActiveTab(
    params.get("type") || "",
    tabs,
    tabsLoading,
  );
  const query = params.get("q") || "";
  const tag = params.get("tag") || "";

  const updateParams = (patch) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setParams(next, { replace: true });
  };
  const setActive = (value) => updateParams({ type: value });
  const setQuery = (value) => updateParams({ q: value });
  const setTag = (value) => updateParams({ tag: value });

  usePageTitle("Projects | roboTUM");

  const { current: currentProjects, past: pastProjects } = useMemo(
    () =>
      splitByStatus(filterProjects(projects, { category: active, query, tag })),
    [active, query, tag, projects],
  );

  // curated tags show always
  const availableTags = CURATED_TAGS;

  // loader
  if (loading) {
    return (
      <>
        <Navbar />
        <PageLoader />
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="section-container hero-offset min-h-screen text-white font-sans section-dark-primary surface-pattern">
        <div>
          <header className="mb-8">
            <h1 className="heading heading-h1">Projects</h1>
            <p className="text-text1 text-white/80 mt-3">
              Explore our initiatives across engineering, operations, and
              entrepreneurship.
            </p>
            {errorMsg && (
              <p className="text-sm text-red-400 mt-3">{errorMsg}</p>
            )}
          </header>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((t) => {
              const activeTab = t.value === active;
              return (
                <button
                  key={t.value}
                  onClick={() => setActive(t.value)}
                  className={`cursor-pointer px-4 py-2 rounded-full text-sm transition-colors duration-300 
                  ${
                    activeTab
                      ? "bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,.35)]"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {/* Search */}
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects"
              className="w-full sm:w-72 px-3 py-2 rounded-md bg-white/10 border border-white/10 text-white placeholder-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
              aria-label="Search projects"
            />

            {/* Tag chips */}
            <div className="flex gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setTag("")}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors 
                ${
                  !tag
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                All
              </button>

              {availableTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`cursor-pointer px-3 py-1.5 rounded-full text-xs transition-colors 
                  ${
                    tag === t
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {currentProjects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}

            {currentProjects.length === 0 && (
              <p className="text-center text-sm text-white/60 col-span-full">
                No matching projects yet.
              </p>
            )}
          </div>

          {/* History: paused / completed projects */}
          {pastProjects.length > 0 && (
            <section className="mt-16" aria-labelledby="project-history">
              <h2 id="project-history" className="heading heading-h2">
                Project history
              </h2>
              <p className="text-text2 text-white/70 mt-2 mb-6">
                Paused and completed projects from this area.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {pastProjects.map((p) => (
                  <ProjectCard key={p.slug} project={p} showStatus />
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="mt-10 text-center">
            <Button as={Link} to="/join" variant="primary">
              Join a project
            </Button>
          </div>
        </div>
      </section>
      <FooterSection />
    </>
  );
}
