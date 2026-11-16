import { Download, GitBranch, Mail, MapPin, Phone } from 'lucide-react'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { Certifications, Education, Skills } from '../components/resume/ResumeSections'
import { EmptyState, ExternalLink, SectionHeading } from '../components/common/UI'
import { Link } from 'react-router-dom'
import { ProfileAvatar } from '../components/common/ProfileAvatar'

export function ResumePage() {
  return (
    <div className="container inner-page">
      <div className="page-heading">
        <div>
          <h1>
            이종근의 이력서<span className="accent">.</span>
          </h1>
          <p>배우고, 만들고, 성장해 온 과정을 소개합니다.</p>
        </div>
        {profile.resumePdf && (
          <a className="button secondary" href={profile.resumePdf} download>
            <Download size={17} />
            PDF 다운로드
          </a>
        )}
      </div>
      <div className="resume-layout">
        <aside className="resume-sidebar">
          <ProfileAvatar large />
          <h2>{profile.name || '이름을 입력해 주세요'}</h2>
          <p className="muted">{profile.introduction || '자기소개를 준비 중입니다.'}</p>
          {profile.location && (
            <p className="contact-item">
              <MapPin size={16} />
              {profile.location}
            </p>
          )}
          <nav aria-label="이력서 목차" className="resume-toc">
            {[
              ['about', '자기소개'],
              ['skills', '기술 스택'],
              ['education', '학력 · 자격증'],
              ['project-summary', '프로젝트'],
              ['contact', '연락처'],
            ].map(([id, title], index) => (
              <a href={`#${id}`} key={id}>
                <span>0{index + 1}</span>
                {title}
              </a>
            ))}
          </nav>
        </aside>
        <div className="resume-content">
          <section id="about">
            <SectionHeading title="자기소개" />
            {profile.about.length ? (
              profile.about.map((paragraph) => (
                <p className="about-paragraph" key={paragraph}>
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="placeholder-line">자기소개를 준비 중입니다.</p>
            )}
          </section>
          <section id="skills">
            <Skills />
          </section>
          <section id="education">
            <Education />
            <Certifications />
          </section>
          <section id="project-summary">
            <SectionHeading title="프로젝트 요약" />
            {projects.length ? (
              <ul className="project-summary-list">
                {projects.map((project) => (
                  <li key={project.slug}>
                    {project.demoUrl ? (
                      <a className="text-link" href={project.demoUrl}>
                        {project.name}
                      </a>
                    ) : (
                      <Link className="text-link" to={`/projects/${project.slug}`}>
                        {project.name}
                      </Link>
                    )}
                    <p className="muted">{project.summary}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="프로젝트를 준비 중입니다."
                description="등록된 프로젝트는 이곳에서도 확인할 수 있습니다."
                compact
              />
            )}
          </section>
          <section id="contact">
            <SectionHeading title="연락처" />
            {profile.github || profile.email || profile.phone ? (
              <div className="contact-links">
                {profile.phone && (
                  <a href={`tel:${profile.phone}`}>
                    <Phone size={18} aria-hidden="true" />
                    {profile.phone}
                  </a>
                )}
                {profile.github && (
                  <ExternalLink href={profile.github}>
                    <GitBranch size={18} />
                    GitHub
                  </ExternalLink>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`}>
                    <Mail size={18} />
                    {profile.email}
                  </a>
                )}
              </div>
            ) : (
              <p className="placeholder-line">연락처를 준비 중입니다.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
