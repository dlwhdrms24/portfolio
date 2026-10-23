import { afterEach, describe, expect, it } from 'vitest'
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../app/App'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { skills } from '../data/skills'
import { resume } from '../data/resume'
import type { Project } from '../types'

function visit(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}
const project: Project = {
  slug: 'test-only',
  name: '테스트 전용 프로젝트',
  summary: '데이터 렌더링 검증용',
  period: '테스트 기간',
  type: '테스트',
  role: '테스트 역할',
  teamSize: 1,
  purpose: '프로젝트 목적 검증',
  technologies: ['테스트 기술'],
  featured: true,
  features: [
    {
      title: '테스트 기능',
      description: '기능 설명 검증',
      image: { src: '/test.svg', alt: '테스트 화면' },
    },
  ],
  architecture: { description: '구조 검증', dataFlow: ['흐름 검증'] },
  problems: [
    {
      title: '문제 검증',
      problem: '현상 검증',
      cause: '원인 검증',
      solution: '해결 검증',
      result: '결과 검증',
    },
  ],
  retrospective: { learned: ['배운 점 검증'], improvements: ['개선 검증'] },
  links: [{ label: '테스트 문서', type: 'documentation', url: 'https://example.com' }],
}

describe('빈 콘텐츠와 라우팅', () => {
  it('개인정보 없이 홈을 렌더링하고 비어 있는 링크를 숨긴다', () => {
    visit()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('이름을 입력해 주세요')
    expect(screen.getByRole('heading', { name: '프로젝트를 준비 중입니다.' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /GitHub/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /PDF/ })).not.toBeInTheDocument()
  })
  it.each(['/resume', '/projects', '/projects/unknown', '/missing'])(
    '%s에 직접 진입할 수 있다',
    (path) => {
      visit(path)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        path === '/resume'
          ? '경험을 연결하다'
          : path === '/projects'
            ? '코드로 풀어낸 이야기'
            : '페이지를 찾을 수 없습니다.',
      )
      if (path.includes('unknown') || path === '/missing')
        expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
          'content',
          'noindex, follow',
        )
    },
  )
  it('네비게이션으로 이동하고 활성 메뉴와 제목을 갱신한다', async () => {
    visit()
    await userEvent.click(
      within(screen.getByRole('navigation', { name: '주 메뉴' })).getByRole('link', {
        name: 'Resume',
      }),
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('경험을 연결하다')
    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute('aria-current', 'page')
    expect(document.title).toContain('Resume')
    expect(screen.getByRole('main')).toHaveFocus()
  })
  it('모바일 메뉴는 이동과 Escape로 닫힌다', async () => {
    visit()
    await userEvent.click(screen.getByRole('button', { name: '메뉴 열기' }))
    const mobile = screen.getByRole('navigation', { name: '모바일 주 메뉴' })
    await userEvent.click(within(mobile).getByRole('link', { name: 'Projects' }))
    expect(screen.queryByRole('navigation', { name: '모바일 주 메뉴' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '메뉴 열기' }))
    within(screen.getByRole('navigation', { name: '모바일 주 메뉴' }))
      .getByRole('link', { name: 'Home' })
      .focus()
    await userEvent.keyboard('{Escape}')
    expect(screen.getByRole('button', { name: '메뉴 열기' })).toHaveFocus()
  })
})

describe('테마', () => {
  it('수동 선택을 저장하고 페이지 이동 후에도 유지한다', async () => {
    visit()
    await userEvent.click(screen.getByRole('button', { name: '다크 모드로 전환' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('portfolio-theme')).toBe('dark')
    await userEvent.click(screen.getByRole('link', { name: '이력서 보기' }))
    expect(screen.getByRole('button', { name: '라이트 모드로 전환' })).toBeInTheDocument()
  })
  it('저장된 설정이 없으면 시스템 테마를 따르고 변경을 감지한다', () => {
    const original = window.matchMedia
    let changed: (() => void) | undefined
    const media = {
      matches: true,
      addEventListener: (_event: string, listener: () => void) => {
        changed = listener
      },
      removeEventListener: () => {},
    }
    window.matchMedia = (() => media) as unknown as typeof window.matchMedia
    try {
      visit()
      expect(document.documentElement.dataset.theme).toBe('dark')
      act(() => {
        media.matches = false
        changed?.()
      })
      expect(document.documentElement.dataset.theme).toBe('light')
    } finally {
      window.matchMedia = original
    }
  })
})

describe('콘텐츠 데이터 연동', () => {
  afterEach(() => {
    projects.length = 0
    skills.length = 0
    resume.experiences.length = 0
    resume.education.length = 0
    resume.certifications.length = 0
    profile.name = ''
    profile.about = []
    delete profile.github
    delete profile.email
    delete profile.resumePdf
  })
  it('프로젝트 데이터로 카드와 상세 페이지 전체를 생성한다', async () => {
    projects.push(project)
    visit('/projects')
    await userEvent.click(screen.getByRole('link', { name: project.name }))
    for (const text of [
      '프로젝트 목적 검증',
      '테스트 기능',
      '구조 검증',
      '흐름 검증',
      '현상 검증',
      '원인 검증',
      '해결 검증',
      '결과 검증',
      '배운 점 검증',
      '개선 검증',
    ])
      expect(screen.getByText(text)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '테스트 화면' })).toHaveAttribute('alt', '테스트 화면')
    expect(screen.getByRole('link', { name: /테스트 문서/ })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    )
    expect(document.title).toContain(project.name)
  })
  it('대표 프로젝트는 featured를 따르고 실제 등록되지 않은 예시는 노출하지 않는다', () => {
    projects.push({ ...project, featured: false })
    visit()
    expect(screen.queryByRole('link', { name: project.name })).not.toBeInTheDocument()
  })
  it('프로필, 스킬, 이력서, 연락처, PDF를 데이터에서 읽는다', () => {
    Object.assign(profile, {
      name: '테스트 이름',
      about: ['테스트 소개 문단'],
      email: 'test@example.com',
      github: 'https://example.com',
      resumePdf: '/resume.pdf',
    })
    skills.push({ name: '테스트 분류', skills: ['테스트 기술'] })
    resume.experiences.push({
      id: 'test',
      title: '테스트 경험',
      organization: '테스트 기관',
      period: '테스트 기간',
      descriptions: ['테스트 설명'],
    })
    resume.education.push({
      id: 'test',
      institution: '테스트 교육',
      course: '테스트 과정',
      period: '테스트 기간',
    })
    resume.certifications.push({
      id: 'test',
      name: '테스트 자격',
      issuer: '테스트 발급처',
      date: '테스트 날짜',
    })
    visit('/resume')
    for (const text of [
      '테스트 이름',
      '테스트 소개 문단',
      '테스트 분류',
      '테스트 기술',
      '테스트 경험',
      '테스트 교육',
      '테스트 자격',
    ])
      expect(screen.getByText(text)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /PDF 다운로드/ })).toHaveAttribute(
      'href',
      '/resume.pdf',
    )
    expect(screen.getAllByRole('link', { name: /test@example.com|Email/ })[0]).toHaveAttribute(
      'href',
      'mailto:test@example.com',
    )
  })
})
