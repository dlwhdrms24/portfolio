import { projects } from '../data/projects'
import { EmptyState } from '../components/common/UI'
import { ProjectCard } from '../components/project/ProjectCard'

export function ProjectsPage() {
  return (
    <div className="container inner-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PROJECTS / 프로젝트</p>
          <h1>
            코드로 풀어낸 이야기<span className="accent">.</span>
          </h1>
          <p>무엇을 만들었는지, 어떻게 문제를 해결했는지 기록합니다.</p>
        </div>
      </div>
      <div className="list-toolbar">
        <h2>
          전체 프로젝트 <span>{String(projects.length).padStart(2, '0')}</span>
        </h2>
        <span>아이디어부터 구현까지</span>
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
      <div className="projects-footnote">
        <span className="tiny-square" />각 프로젝트의 상세 페이지에서 구현 과정과 배운 점을 확인할
        수 있습니다.
      </div>
    </div>
  )
}
