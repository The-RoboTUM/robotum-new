import { useParams, Link } from "react-router-dom";
import { projects } from "@data/projects";
import ImageFrame from "@components/ui/ImageFrame";
import Button from "@components/ui/Button";
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import { useEffect } from "react";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    document.title = project
      ? `${project.title} | RoboTUM`
      : "Project | RoboTUM";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [project]);

  useEffect(() => {
    // Ensure the page starts at the top when navigating to a project detail
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug]);

  if (!project) {
    return (
      <>
        <Navbar />
        <section className="surface-1 min-h-screen px-6 md:px-12 py-20 text-white flex flex-col justify-center">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading heading-h2 mb-6">Project not found</h1>
            <Button
              as={Link}
              to="/projects"
              variant="secondary"
              className="mt-4"
            >
              Back to Projects
            </Button>
          </div>
        </section>
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="section-container surface-1 min-h-screen text-white font-sans surface-wrap surface-pattern py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-12 md:grid-cols-2 items-start">
            <div>
              <ImageFrame
                src={project.cover}
                alt={project.title}
                aspect="16/9"
                fit="cover"
                variant="border"
                vignette
                className="w-full rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="heading heading-h1 mb-4">{project.title}</h1>
              <span className="inline-block px-4 py-1 rounded-full text-xs md:text-sm bg-white/10 border border-white/10 mb-6 capitalize">
                {project.category}
              </span>
              <p className="text-text1 text-white/80 mb-8 leading-relaxed text-base md:text-lg">
                {project.description || project.summary}
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {project.tags?.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-xs md:text-sm bg-white/10 border border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 mt-auto">
                <Button
                  as={Link}
                  to="/projects"
                  variant="secondary"
                  className="whitespace-nowrap"
                >
                  All projects
                </Button>
                {project.links?.map((l) => (
                  <Button
                    key={l.href}
                    as="a"
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    variant="primary"
                    className="whitespace-nowrap"
                  >
                    {l.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterSection />
    </>
  );
}
