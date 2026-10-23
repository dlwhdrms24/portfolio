import { projects } from '../data/projects'
import { profile } from '../data/profile'

export const siteUrl = 'https://jong.3geun.com'
export const siteName = profile.name ? `${profile.name} | 개발자 포트폴리오` : '개발자 포트폴리오'
export function getMetadata(rawPath: string) {
  const path = rawPath.replace(/\/+$/, '') || '/'
  const project = projects.find((item) => path === `/projects/${item.slug}`)
  const page =
    path === '/'
      ? 'Home'
      : path === '/resume'
        ? 'Resume'
        : path === '/projects'
          ? 'Projects'
          : (project?.name ?? '페이지를 찾을 수 없습니다')
  const description =
    project?.summary ??
    (path === '/resume'
      ? '프로필, 기술 스택, 경험과 학력을 정리한 개발자 이력서입니다.'
      : path === '/projects'
        ? '개발 프로젝트와 구현 과정, 문제 해결 경험을 소개합니다.'
        : '개발자의 소개, 이력서와 프로젝트를 한곳에서 확인하세요.')
  return {
    title: `${siteName} | ${page}`,
    description,
    url: `${siteUrl}${path}`,
    notFound: !['/', '/resume', '/projects'].includes(path) && !project,
  }
}
