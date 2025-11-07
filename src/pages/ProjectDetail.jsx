// src/pages/ProjectDetail.jsx
import { useParams, Link } from 'react-router-dom'
import { projects } from '@data/projects'
import ImageFrame from '@components/ui/ImageFrame'
import Button from '@components/ui/Button'
import { useEffect } from 'react'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find(p => p.slug === slug)

  useEffect(() => {
    document.title = project ? `${project.title} | RoboTUM` : 'Project | RoboTUM'
  }, [project])

  if (!project) {
    return (
      <section className="surface-1 min-h-screen px-6 md:px-12 py-20 text-white">
        <div className="max-w-5xl mx-auto">
          <h1 className="heading heading-h2">Project not found</h1>
          <Button as={Link} to="/projects" variant="secondary" className="mt-6">Back to Projects</Button>
        </div>
      </section>
    )
  }

  return (
    <section className="surface-1 min-h-screen px-6 md:px-12 py-20 md:py-28 text-white font-sans surface-wrap surface-pattern">
      <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-2">
        <div>
          <ImageFrame src={project.cover} alt={project.title} aspect="16/9" fit="cover" variant="border" vignette className="w-full" />
        </div>
        <div>
          <h1 className="heading heading-h1 mb-3">{project.title}</h1>
          <span className="inline-block px-3 py-1 rounded-full text-xs bg-white/10 border border-white/10 mb-4 capitalize">
            {project.category}
          </span>
          <p className="text-text1 text-white/80 mb-6">{project.description || project.summary}</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags?.map(t => <span key={t} className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/10">{t}</span>)}
          </div>
          <div className="flex gap-3">
            <Button as={Link} to="/projects" variant="secondary">All projects</Button>
            {project.links?.map(l => (
              <Button key={l.href} as="a" href={l.href} target="_blank" rel="noreferrer" variant="primary">
                {l.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}