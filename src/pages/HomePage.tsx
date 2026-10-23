import { ArrowRight, ArrowUpRight, FileText, CodeXml, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { profile } from '../data/profile'
import { skills } from '../data/skills'
import { projects } from '../data/projects'
import { EmptyState, SectionHeading, Tags } from '../components/common/UI'
import { Education, Experiences, Skills } from '../components/resume/ResumeSections'
import { ProjectCard } from '../components/project/ProjectCard'

export function HomePage() {
  const featured = projects.filter((project) => project.featured)
  return (
    <div className="container home-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-content">
          <p className="eyebrow">
            <span className="tiny-square" />
            DEVELOPER PORTFOLIO
          </p>
          <p className="hero-role">{profile.role}</p>
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
          <Tags items={skills.flatMap((category) => category.skills).slice(0, 6)} />
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
        <div className="hero-art" aria-hidden="true">
          <div className="art-grid" />
          <div className="code-window">
            <div className="window-bar">
              <div>
                <i />
                <i />
                <i />
              </div>
              <span>portfolio.ts</span>
              <CodeXml size={14} />
            </div>
            <div className="code-lines">
              <p>
                <span className="line-number">01</span>
                <span className="code-purple">const</span> developer = {'{'}
              </p>
              <p>
                <span className="line-number">02</span> role:{' '}
                <span className="code-blue">'Backend Developer'</span>,
              </p>
              <p>
                <span className="line-number">03</span> about:{' '}
                <span className="code-comment">// coming soon</span>
              </p>
              <p>
                <span className="line-number">04</span> projects: [
                <span className="code-comment"> /* next chapter */ </span>],
              </p>
              <p>
                <span className="line-number">05</span>
                {'};'}
              </p>
              <p className="code-spacer">
                <span className="line-number">06</span>
              </p>
              <p>
                <span className="line-number">07</span>
                <span className="code-purple">export default</span> developer;
              </p>
            </div>
            <div className="window-footer">
              <span className="code-file-dot" />
              TypeScript<span>UTF-8</span>
            </div>
          </div>
          <div className="art-caption">
            <span className="caption-line" />A space for work, learning & growth.
          </div>
        </div>
      </section>
      <section className="home-section" aria-labelledby="resume-preview-title">
        <SectionHeading
          eyebrow="01 / RESUME"
          id="resume-preview-title"
          title="저를 소개합니다"
          link={{ to: '/resume', label: '전체 이력서 보기' }}
        >
          프로필부터 기술과 경험까지, 한눈에 살펴보세요.
        </SectionHeading>
        <div className="resume-preview">
          <div className="profile-preview">
            <span className="profile-avatar">
              <UserRound size={27} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <p className="eyebrow">PROFILE</p>
            <h3>{profile.name || '이름을 입력해 주세요'}</h3>
            <p className="profile-role">{profile.role}</p>
            <p className="muted">{profile.introduction || '자기소개를 준비 중입니다.'}</p>
            <Link className="text-link" to="/resume">
              자세히 알아보기
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="resume-preview-details">
            <Skills compact />
            <Experiences compact />
            <Education compact />
          </div>
        </div>
      </section>
      <section className="home-section projects-preview">
        <SectionHeading
          eyebrow="02 / PROJECTS"
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
      <div className="home-bottom">
        <span className="tiny-square" />
        <p>
          소개와 경험, 그리고 다음 프로젝트까지.
          <br className="mobile-break" /> 이곳에 차근차근 기록합니다.
        </p>
        <CodeXml size={21} aria-hidden="true" />
      </div>
    </div>
  )
}
