import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { projects } from '../data/projects'
import { profile } from '../data/profile'
import { ExternalLink, SectionHeading, Tags } from '../components/common/UI'
import { ScreenshotCarousel } from '../components/project/ScreenshotCarousel'
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
  const siteUrl = project.demoUrl ?? project.liveUrl
  return (
    <div className="container inner-page detail-page">
      <Link className="text-link back-link" to="/projects">
        <ArrowLeft size={16} aria-hidden="true" />
        프로젝트 목록
      </Link>
      <div className="page-heading">
        <div>
          <h1>
            {project.name}
            <span className="accent">.</span>
          </h1>
          <p>{project.summary}</p>
        </div>
        {siteUrl && (
          <a href={siteUrl} className="button primary">
            사이트 바로가기 <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        )}
      </div>
      {project.accessNote && (
        <section className="project-personal-demo" aria-labelledby="project-access-title">
          <div>
            <h2 id="project-access-title">데모 이용 안내</h2>
            <p>{project.accessNote}</p>
          </div>
          {profile.email && (
            <a
              href={`mailto:${profile.email}?subject=${encodeURIComponent(`${project.name} 이용 문의`)}`}
              className="button primary"
            >
              이메일로 문의하기
            </a>
          )}
        </section>
      )}
      {project.personalDemo && (
        <section className="project-personal-demo" aria-labelledby="project-personal-demo-title">
          <div>
            <p className="eyebrow">개인 재구현</p>
            <h2 id="project-personal-demo-title">로그인 없이 체험하기</h2>
            <p>{project.personalDemo.description}</p>
          </div>
          <a href={project.personalDemo.url} className="button primary">
            사이트 바로가기 <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </section>
      )}
      {project.demoAccess && (
        <section className="project-demo-access" aria-labelledby="project-demo-access-title">
          <div>
            <h2 id="project-demo-access-title">팀 프로젝트 사이트</h2>
            <ExternalLink href={project.demoAccess.url} className="button primary">
              사이트 바로가기
            </ExternalLink>
          </div>
          <dl aria-label="테스트 계정">
            <div>
              <dt>테스트 ID</dt>
              <dd>
                <code>{project.demoAccess.username}</code>
              </dd>
            </div>
            <div>
              <dt>비밀번호</dt>
              <dd>
                <code>{project.demoAccess.password}</code>
              </dd>
            </div>
          </dl>
        </section>
      )}
      <div className="project-facts">
        <div>
          <span>프로젝트 유형</span>
          <strong>{project.type}</strong>
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
      {project.spotlight && (
        <section className="project-spotlight">
          <SectionHeading title="서버·DB 개발" />
          <p className="prose">{project.spotlight.description}</p>
          <div className="spotlight-topics">
            {project.spotlight.topics.map((topic) => (
              <article key={topic.title}>
                <h3>{topic.title}</h3>
                <p className="prose">{topic.description}</p>
              </article>
            ))}
          </div>
          <h3>핵심 데이터 관계</h3>
          <ul className="project-relations">
            {project.spotlight.relations.map(({ from, to, reason }) => (
              <li key={`${from}-${to}`}>
                <strong>
                  {from} → {to}
                </strong>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {project.cover &&
        !project.spotlight &&
        project.cover.src !== project.architecture?.image?.src && <Figure image={project.cover} />}
      <section>
        <SectionHeading title="프로젝트 소개" />
        <p className="prose">{project.purpose}</p>
      </section>
      {project.demoVideo && (
        <section aria-labelledby="project-demo-title">
          <SectionHeading id="project-demo-title" title="실행 영상">
            {project.demoVideo.description}
          </SectionHeading>
          <video
            className="project-demo-video"
            controls
            playsInline
            preload="none"
            poster={project.demoVideo.poster}
            aria-labelledby="project-demo-title"
          >
            <source src={project.demoVideo.src} type="video/mp4" />
            <a href={project.demoVideo.src}>실행 영상 열기</a>
          </video>
        </section>
      )}
      {project.screenshots && project.screenshots.length > 0 && (
        <section>
          <SectionHeading title={project.screenshotsTitle ?? '실제 서비스 화면'}>
            {project.screenshotsNote}
          </SectionHeading>
          <ScreenshotCarousel
            images={project.screenshots}
            label={`${project.name} ${project.screenshotsTitle ?? '실제 서비스 화면'}`}
          />
        </section>
      )}
      {project.integrations && project.integrations.length > 0 && (
        <section>
          <SectionHeading title="API 연동" />
          <div className="feature-list">
            {project.integrations.map(({ title, description }) => (
              <article key={title}>
                <h3>{title}</h3>
                <p className="prose">{description}</p>
              </article>
            ))}
          </div>
        </section>
      )}
      {project.features.length > 0 && (
        <section>
          <SectionHeading title={project.spotlight ? '팀 프로젝트 주요 기능' : '주요 기능'} />
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
          <SectionHeading title="시스템 아키텍처" />
          <p className="prose">{project.architecture.description}</p>
          {project.architecture.image ? (
            <Figure image={project.architecture.image} />
          ) : (
            project.spotlight && project.cover && <Figure image={project.cover} />
          )}
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
          <SectionHeading title="문제 해결 과정" />
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
          <SectionHeading title="배운 점과 다음 과제" />
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
          <SectionHeading title="프로젝트 링크" />
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
