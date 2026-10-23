import { ArrowUpRight, FolderCode } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project } from '../../types'
import { Tags } from '../common/UI'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      {project.cover ? (
        <img
          className="project-cover"
          src={project.cover.src}
          alt={project.cover.alt}
          loading="lazy"
          width="640"
          height="360"
        />
      ) : (
        <div className="project-cover project-cover-placeholder">
          <FolderCode size={40} strokeWidth={1} aria-hidden="true" />
          <span>{project.type}</span>
        </div>
      )}
      <div className="project-card-body">
        <p className="entry-period">
          {project.period} · {project.type}
        </p>
        <h3>
          <Link to={`/projects/${project.slug}`}>
            {project.name}
            <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </h3>
        <p className="muted">{project.summary}</p>
        <p className="project-role">
          담당 역할 <span>{project.role}</span>
        </p>
        <Tags items={project.technologies} />
      </div>
    </article>
  )
}
