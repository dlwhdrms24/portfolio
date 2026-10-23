export interface Profile {
  name: string
  role: string
  introduction: string
  about: string[]
  github?: string
  email?: string
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
  course: string
  period: string
  description?: string
}
export interface Certification {
  id: string
  name: string
  issuer: string
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
  cover?: ProjectImage
  features: ProjectFeature[]
  architecture?: { description: string; image?: ProjectImage; dataFlow?: string[] }
  problems: ProjectProblem[]
  retrospective?: { learned: string[]; improvements: string[] }
  links: ProjectLink[]
}
