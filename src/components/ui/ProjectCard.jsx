import { Link } from "react-router-dom";
import ImageFrame from "@components/ui/ImageFrame";
import Button from "@components/ui/Button";

export default function ProjectCard({ project }) {
  return (
    <article className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300">
      <div className="relative">
        <ImageFrame
          src={project.cover}
          alt={project.title}
          aspect="16/9"
          fit="cover"
          variant="soft"
          rounded="none"
          vignette
          className="w-full"
        />
      </div>

      <div className="p-5">
        <h3 className="text-text1 font-semibold mb-1">{project.title}</h3>
        <p className="text-text2 text-white/70 mb-4">{project.summary}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags?.map((t) => (
            <span
              key={t}
              className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/80 border border-white/10"
            >
              {t}
            </span>
          ))}
        </div>
        <Button
          as={Link}
          to={`/projects/${project.slug}`}
          variant="secondary"
          size="sm"
        >
          View more
        </Button>
      </div>
    </article>
  );
}
