import { ArrowRight, ArrowUpRight, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { EmptyState, SectionHeading } from '../components/common/UI'
import { Education, Skills } from '../components/resume/ResumeSections'
import { ProjectCard } from '../components/project/ProjectCard'
import { ProfileAvatar } from '../components/common/ProfileAvatar'

export function HomePage() {
  const featured = projects.filter((project) => project.featured)
  return (
    <div className="container home-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-content">
          <h1 id="hero-title">
            {profile.name ? (
              <>
                안녕하세요,
                <br />
                <span>{profile.name}</span>입니다.
              </>
            ) : (
              <>
                반갑습니다.
                <br />
                <span>이름을 입력해 주세요</span>
                <span className="hero-period">.</span>
              </>
            )}
          </h1>
          <p className="hero-description">{profile.introduction || '자기소개를 준비 중입니다.'}</p>
          <div className="hero-buttons">
            <Link className="button primary" to="/resume">
              <FileText size={17} aria-hidden="true" />
              이력서 보기
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <Link className="button secondary" to="/projects">
              프로젝트 보기
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="home-section" aria-labelledby="resume-preview-title">
        <SectionHeading
          id="resume-preview-title"
          title="저를 소개합니다"
          link={{ to: '/resume', label: '전체 이력서 보기' }}
        >
          프로필과 기술 스택, 학력과 자격증을 한눈에 살펴보세요.
        </SectionHeading>
        <div className="resume-preview">
          <div className="profile-preview">
            <ProfileAvatar />
            <h3>{profile.name || '이름을 입력해 주세요'}</h3>
            <p className="muted">{profile.introduction || '자기소개를 준비 중입니다.'}</p>
            <Link className="text-link" to="/resume">
              자세히 알아보기
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="resume-preview-details">
            <Skills compact />
            <Education compact />
          </div>
        </div>
      </section>
      <section className="home-section projects-preview">
        <SectionHeading
          title="만들어 온 것들"
          link={{ to: '/projects', label: '전체 프로젝트 보기' }}
        >
          프로젝트에 담긴 고민과 해결 과정을 소개합니다.
        </SectionHeading>
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
