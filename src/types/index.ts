export interface Profile {
  name: string
  role: string
  introduction: string
  about: string[]
  photo?: string
  github?: string
  email?: string
  phone?: string
  location?: string
  resumePdf?: string
}
export interface SkillCategory {
  name: string
  skills: string[]
}
export interface Experience {
  id: string
  title: string
  organization: string
  period: string
  descriptions: string[]
}
export interface Education {
  id: string
  institution: string
  course?: string
  period: string
  description?: string
}
export interface Certification {
  id: string
  name: string
  issuer?: string
  date: string
}
export interface Resume {
  experiences: Experience[]
  education: Education[]
  certifications: Certification[]
}
export interface ProjectImage {
  src: string
  alt: string
  caption?: string
  /** 카드 표지에서 잘릴 때 남길 위치 (CSS object-position). 기본값은 위쪽 가운데. */
  focus?: string
}
export interface ProjectFeature {
  title: string
  description: string
  image?: ProjectImage
}
export interface ProjectProblem {
  title: string
  problem: string
  cause: string
  solution: string
  result: string
}
export interface ProjectLink {
  label: string
  url: string
  type: 'github' | 'demo' | 'documentation'
}
export interface Project {
  slug: string
  name: string
  summary: string
  period: string
  type: string
  role: string
  teamSize?: number
  purpose: string
  technologies: string[]
  featured: boolean
  spotlight?: {
    description: string
    topics: ProjectFeature[]
    relations: { from: string; to: string; reason: string }[]
  }
  cover?: ProjectImage
  demoUrl?: string
  /** 운영 중인 서비스 주소. demoUrl 과 달리 카드는 소개 페이지로 가고, 카드와 소개 페이지에 사이트 바로가기를 둔다. */
  liveUrl?: string
  demoAccess?: { url: string; username: string; password: string }
  /** 팀 서비스와 분리해 배포한 개인 재구현 데모. 배포 검증 후 추가한다. */
  personalDemo?: { url: string; description: string }
  demoVideo?: { src: string; poster: string; description: string }
  screenshots?: ProjectImage[]
  screenshotsTitle?: string
  screenshotsNote?: string
  integrations?: ProjectFeature[]
  features: ProjectFeature[]
  architecture?: { description: string; image?: ProjectImage; dataFlow?: string[] }
  problems: ProjectProblem[]
  retrospective?: { learned: string[]; improvements: string[] }
  links: ProjectLink[]
}
