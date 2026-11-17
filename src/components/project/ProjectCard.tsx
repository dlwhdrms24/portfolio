import { ArrowUpRight, FolderCode } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Project } from '../../types'
import { Tags } from '../common/UI'

export function ProjectCard({ project }: { project: Project }) {
  const diagramCover = project.cover && project.cover.src === project.architecture?.image?.src
  return (
    <article className={project.demoUrl ? 'project-card project-card-demo' : 'project-card'}>
      <div className="project-cover-frame">
        {project.cover ? (
          <img
            className={diagramCover ? 'project-cover project-cover-diagram' : 'project-cover'}
            src={project.cover.src}
            alt={project.cover.alt}
            loading="lazy"
            width={640}
            height={400}
            style={project.cover.focus ? { objectPosition: project.cover.focus } : undefined}
          />
        ) : (
          <div className="project-cover-placeholder">
            <FolderCode size={40} strokeWidth={1} aria-hidden="true" />
            <span>{project.type}</span>
          </div>
        )}
      </div>
      <div className="project-card-body">
        <p className="project-meta">
          {project.spotlight && <span className="project-spotlight-badge">대표 프로젝트</span>}
          {project.period} · {project.type}
        </p>
        <h3>
          {project.demoUrl ? (
            <a className="project-card-demo-link" href={project.demoUrl}>
              {project.name}
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
          ) : (
            <Link to={`/projects/${project.slug}`}>
              {project.name}
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          )}
        </h3>
        {project.demoUrl && <p className="entry-period">서비스 바로가기</p>}
        {project.liveUrl && (
          <a className="project-live-link" href={project.liveUrl}>
            사이트 바로가기 <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        )}
        <p className="muted">{project.summary}</p>
        <p className="project-role">
          담당 역할 <span>{project.role}</span>
        </p>
        <Tags items={project.technologies} />
      </div>
    </article>
  )
}
