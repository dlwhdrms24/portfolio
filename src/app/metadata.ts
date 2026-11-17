import { projects } from '../data/projects'

export const siteUrl = 'https://3geun.com'
export const siteName = '3geun'
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
        : '안녕하세요 이종근입니다')
  return {
    title: path === '/' ? siteName : `${siteName} | ${page}`,
    description,
    url: `${siteUrl}${path}`,
    notFound: !['/', '/resume', '/projects'].includes(path) && !project,
  }
}
