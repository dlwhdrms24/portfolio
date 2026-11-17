import { ArrowUpRight, Award, GitBranch, GraduationCap, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { EmptyState, ExternalLink } from '../components/common/UI'
import { Skills } from '../components/resume/ResumeSections'
import { resume } from '../data/resume'
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
        <p className="hero-tagline">ABOUT · RESUME · PROJECTS</p>
        <p className="hero-story">
          저희 삼 형제는 이름이 모두 &lsquo;근&rsquo;으로 끝납니다. 그중 막내인 저는 세 번째 근,
          그래서 3geun입니다.
        </p>
      </section>
      <section className="home-section" aria-label="소개">
        <div className="section-more">
          <Link className="text-link" to="/resume">
            전체 이력서 보기
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="resume-preview">
          <div className="profile-preview">
            <ProfileAvatar />
            <h2>{profile.name || '이름을 입력해 주세요'}</h2>
            <div className="profile-skills">
              <Skills compact />
            </div>
          </div>
          <div className="resume-preview-details">
            <ul className="highlight-list">
              <li className="highlight-card">
                <span className="highlight-icon tone-green">
                  <GraduationCap size={22} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="highlight-label">학력</h3>
                  {resume.education.length ? (
                    resume.education.map((entry) => (
                      <div key={entry.id}>
                        <p className="highlight-title">{entry.institution}</p>
                        <p className="highlight-sub">
                          {[entry.course, entry.period].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="highlight-sub">학력 정보를 준비 중입니다.</p>
                  )}
                </div>
              </li>
              <li className="highlight-card">
                <span className="highlight-icon tone-amber">
                  <Award size={22} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="highlight-label">자격증</h3>
                  {resume.certifications.length ? (
                    resume.certifications.map((entry) => (
                      <div key={entry.id}>
                        <p className="highlight-title">{entry.name}</p>
                        <p className="highlight-sub">
                          {[entry.issuer, entry.date].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="highlight-sub">등록된 자격증이 없습니다.</p>
                  )}
                </div>
              </li>
              {(profile.email || profile.github || profile.phone) && (
                <li className="highlight-card">
                  <span className="highlight-icon tone-brown">
                    <Mail size={22} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="highlight-label">연락처</h3>
                    <div className="highlight-contacts">
                      {profile.email && (
                        <a href={`mailto:${profile.email}`}>
                          <Mail size={15} aria-hidden="true" />
                          {profile.email}
                        </a>
                      )}
                      {profile.github && (
                        <ExternalLink href={profile.github}>
                          <GitBranch size={15} aria-hidden="true" />
                          {profile.github.replace(/^https?:\/\//, '')}
                        </ExternalLink>
                      )}
                      {profile.phone && (
                        <a href={`tel:${profile.phone}`}>
                          <Phone size={15} aria-hidden="true" />
                          {profile.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
      <section className="home-section projects-preview" aria-label="프로젝트">
        <div className="section-more">
          <Link className="text-link" to="/projects">
            전체 프로젝트 보기
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
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
