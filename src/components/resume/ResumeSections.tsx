import { BriefcaseBusiness, GraduationCap, Layers3, Award } from 'lucide-react'
import { skills } from '../../data/skills'
import { resume } from '../../data/resume'
import { Tags } from '../common/UI'

export function Skills({ compact = false }: { compact?: boolean }) {
  const Heading = compact ? 'h3' : 'h2'
  const ItemHeading = compact ? 'h4' : 'h3'
  return (
    <div className="resume-block">
      <div className="block-heading">
        <Layers3 size={19} aria-hidden="true" />
        <Heading>기술 스택</Heading>
        <span>Technical skills</span>
      </div>
      {skills.some((category) => category.skills.length) ? (
        <div className="skill-categories">
          {skills
            .filter((category) => category.skills.length)
            .map((category) => (
              <div key={category.name}>
                <ItemHeading>{category.name}</ItemHeading>
                <Tags items={category.skills} />
              </div>
            ))}
        </div>
      ) : (
        <p className="placeholder-line">주요 기술 스택을 정리하고 있습니다.</p>
      )}
      {!compact && !skills.length && (
        <p className="muted small">사용한 기술과 경험을 카테고리별로 소개할 예정입니다.</p>
      )}
    </div>
  )
}
export function Experiences({ compact = false }: { compact?: boolean }) {
  const Heading = compact ? 'h3' : 'h2'
  const ItemHeading = compact ? 'h4' : 'h3'
  const entries = compact ? resume.experiences.slice(0, 2) : resume.experiences
  return (
    <div className="resume-block">
      <div className="block-heading">
        <BriefcaseBusiness size={19} aria-hidden="true" />
        <Heading>경험</Heading>
        <span>Experience</span>
      </div>
      {entries.length ? (
        <ol className="timeline">
          {entries.map((entry) => (
            <li key={entry.id}>
              <p className="entry-period">{entry.period}</p>
              <ItemHeading>{entry.title}</ItemHeading>
              <p className="muted">{entry.organization}</p>
              <ul className="body-list">
                {entry.descriptions.map((description) => (
                  <li key={description}>{description}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      ) : (
        <p className="placeholder-line">개발 경험과 학습 과정을 준비 중입니다.</p>
      )}
    </div>
  )
}
export function Education({ compact = false }: { compact?: boolean }) {
  const Heading = compact ? 'h3' : 'h2'
  const ItemHeading = compact ? 'h4' : 'h3'
  return (
    <div className="resume-block">
      <div className="block-heading">
        <GraduationCap size={20} aria-hidden="true" />
        <Heading>{compact ? '학력 · 자격증' : '학력'}</Heading>
        <span>Education</span>
      </div>
      {resume.education.length ? (
        resume.education.map((entry) => (
          <div className="resume-entry" key={entry.id}>
            <p className="entry-period">{entry.period}</p>
            <ItemHeading>{entry.institution}</ItemHeading>
            <p>{entry.course}</p>
            {entry.description && <p className="muted">{entry.description}</p>}
          </div>
        ))
      ) : (
        <p className="placeholder-line">학력{compact ? ' 및 자격증' : ''} 정보를 준비 중입니다.</p>
      )}
      {compact &&
        resume.certifications.map((entry) => (
          <div className="resume-entry" key={entry.id}>
            <h4>{entry.name}</h4>
            <p className="muted">
              {entry.issuer} · {entry.date}
            </p>
          </div>
        ))}
    </div>
  )
}
export function Certifications() {
  return (
    <div className="resume-block">
      <div className="block-heading">
        <Award size={19} aria-hidden="true" />
        <h2>자격증</h2>
        <span>Certifications</span>
      </div>
      {resume.certifications.length ? (
        resume.certifications.map((entry) => (
          <div className="resume-entry" key={entry.id}>
            <h3>{entry.name}</h3>
            <p className="muted">
              {entry.issuer} · {entry.date}
            </p>
          </div>
        ))
      ) : (
        <p className="placeholder-line">등록된 자격증이 없습니다.</p>
      )}
    </div>
  )
}
