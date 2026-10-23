import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { projects } from '../data/projects'
import { ExternalLink, SectionHeading, Tags } from '../components/common/UI'
import { NotFoundPage } from './NotFoundPage'
import type { ProjectImage } from '../types'

function Figure({ image }: { image: ProjectImage }) {
  return (
    <figure className="project-figure">
      <img src={image.src} alt={image.alt} loading="lazy" />
      {image.caption && <figcaption>{image.caption}</figcaption>}
    </figure>
  )
}
export function ProjectDetailPage() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)
  if (!project) return <NotFoundPage />
  return (
    <div className="container inner-page detail-page">
      <Link className="text-link back-link" to="/projects">
        <ArrowLeft size={16} aria-hidden="true" />
        프로젝트 목록
      </Link>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PROJECT / {project.type}</p>
          <h1>
            {project.name}
            <span className="accent">.</span>
          </h1>
          <p>{project.summary}</p>
        </div>
      </div>
      <div className="project-facts">
        <div>
          <span>개발 기간</span>
          <strong>{project.period}</strong>
        </div>
        <div>
          <span>담당 역할</span>
          <strong>{project.role}</strong>
        </div>
        {project.teamSize !== undefined && (
          <div>
            <span>참여 인원</span>
            <strong>{project.teamSize}명</strong>
          </div>
        )}
        <div>
          <span>기술 스택</span>
          <Tags items={project.technologies} />
        </div>
      </div>
      {project.cover && <Figure image={project.cover} />}
      <section>
        <SectionHeading eyebrow="01 / OVERVIEW" title="프로젝트 소개" />
        <p className="prose">{project.purpose}</p>
      </section>
      {project.features.length > 0 && (
        <section>
          <SectionHeading eyebrow="02 / FEATURES" title="주요 기능" />
          <div className="feature-list">
            {project.features.map((feature) => (
              <article key={feature.title}>
                <h3>{feature.title}</h3>
                <p className="prose">{feature.description}</p>
                {feature.image && <Figure image={feature.image} />}
              </article>
            ))}
          </div>
        </section>
      )}
      {project.architecture && (
        <section>
          <SectionHeading eyebrow="03 / ARCHITECTURE" title="시스템 아키텍처" />
          <p className="prose">{project.architecture.description}</p>
          {project.architecture.image && <Figure image={project.architecture.image} />}
          {project.architecture.dataFlow && (
            <ol className="body-list">
              {project.architecture.dataFlow.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          )}
        </section>
      )}
      {project.problems.length > 0 && (
        <section>
          <SectionHeading eyebrow="04 / PROBLEM SOLVING" title="문제 해결 과정" />
          {project.problems.map((problem) => (
            <article className="problem-card" key={problem.title}>
              <h3>{problem.title}</h3>
              <dl>
                {[
                  ['문제', problem.problem],
                  ['원인', problem.cause],
                  ['해결 과정', problem.solution],
                  ['개선 결과', problem.result],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </section>
      )}
      {project.retrospective && (
        <section>
          <SectionHeading eyebrow="05 / RETROSPECTIVE" title="배운 점과 다음 과제" />
          {project.retrospective.learned.length > 0 && (
            <>
              <h3>배운 점</h3>
              <ul className="body-list">
                {project.retrospective.learned.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
          {project.retrospective.improvements.length > 0 && (
            <>
              <h3>개선할 점</h3>
              <ul className="body-list">
                {project.retrospective.improvements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
      {project.links.length > 0 && (
        <section>
          <SectionHeading eyebrow="06 / LINKS" title="프로젝트 링크" />
          <div className="contact-links">
            {project.links.map((link) => (
              <ExternalLink key={link.url} href={link.url}>
                {link.label}
              </ExternalLink>
            ))}
          </div>
        </section>
      )}
      <Link className="button secondary" to="/projects">
        다른 프로젝트 보기
        <ArrowUpRight size={17} aria-hidden="true" />
      </Link>
    </div>
  )
}
