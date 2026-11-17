import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { EmptyState } from '../components/common/UI'
import { Education, Skills } from '../components/resume/ResumeSections'
import { ProjectCard } from '../components/project/ProjectCard'
import { ProfileAvatar } from '../components/common/ProfileAvatar'

export function HomePage() {
  const featured = projects.filter((project) => project.featured)
  return (
    <div className="container home-page">
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title" className="hero-wordmark" aria-label="J.3geun">
          <span className="wm-j">J</span>
          <span className="wm-period">.</span>
          <span className="wm-3">3</span>
          <span className="wm-geun">geun</span>
        </h1>
      </section>
      <section className="home-section" aria-label="소개">
        <div className="resume-preview">
          <div className="profile-preview">
            <ProfileAvatar />
            <h2>{profile.name || '이름을 입력해 주세요'}</h2>
          </div>
          <div className="resume-preview-details">
            <Skills compact />
            <Education compact />
          </div>
        </div>
      </section>
      <section className="home-section projects-preview" aria-label="프로젝트">
        {featured.length ? (
          <div className="project-grid">
            {featured.map((project) => (
              <ProjectCard project={project} key={project.slug} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="프로젝트를 준비 중입니다."
            description="아이디어가 코드로, 코드가 서비스가 되는 과정을 기록합니다."
            compact
          />
        )}
      </section>
    </div>
  )
}
