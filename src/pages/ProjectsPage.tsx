import { projects } from '../data/projects'
import { EmptyState } from '../components/common/UI'
import { ProjectCard } from '../components/project/ProjectCard'

export function ProjectsPage() {
  return (
    <div className="container inner-page">
      <h1 className="sr-only">프로젝트</h1>
      <div className="list-toolbar">
        <h2>
          전체 프로젝트 <span>{String(projects.length).padStart(2, '0')}</span>
        </h2>
      </div>
      {projects.length ? (
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="프로젝트를 준비 중입니다."
          description="프로젝트의 구현 기능과 기술적 고민을 곧 이곳에서 소개합니다."
        />
      )}
    </div>
  )
}
