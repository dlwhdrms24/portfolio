import {
  ArrowRight,
  ArrowUpRight,
  Award,
  FolderOpen,
  GitBranch,
  GraduationCap,
  Mail,
  Phone,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { ExternalLink } from '../components/common/UI'
import { Skills } from '../components/resume/ResumeSections'
import { resume } from '../data/resume'
import { ProfileAvatar } from '../components/common/ProfileAvatar'

export function HomePage() {
  return (
    <div className="container home-page">
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title" className="hero-wordmark" aria-label="3geun">
          <span className="wm-amber">3</span>
          <span className="wm-green">g</span>
          <span className="wm-leaf">e</span>
          <span className="wm-brown">u</span>
          <span className="wm-green">n</span>
        </h1>
        <p className="hero-tagline">ABOUT · RESUME · PROJECTS</p>
        <p className="hero-story">
          <span>저희 삼 형제는 이름이 모두 &lsquo;근&rsquo;으로 끝납니다.</span>{' '}
          <span>그중 막내인 저는 세 번째 근,</span> <span>그래서 3geun입니다.</span>
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
      <section className="home-section" aria-label="프로젝트">
        <Link className="projects-link" to="/projects">
          <span className="projects-link-icon">
            <FolderOpen size={22} aria-hidden="true" />
          </span>
          <span className="projects-link-text">
            <strong>프로젝트</strong>
            <span>
              {projects.length
                ? `${projects.length}개의 프로젝트 보러 가기`
                : '프로젝트를 준비 중입니다.'}
            </span>
          </span>
          <ArrowRight className="projects-link-arrow" size={20} aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}
