import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowUp, ArrowUpRight, GitBranch, Menu, Moon, Sun, X } from 'lucide-react'
import { profile } from '../../data/profile'
import { useTheme } from '../../hooks/useTheme'
import { getMetadata } from '../../app/metadata'
import { ExternalLink } from '../common/UI'

const navigation = [
  { to: '/', label: 'Home' },
  { to: '/resume', label: 'Resume' },
  { to: '/projects', label: 'Projects' },
]

function Header() {
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const menuButton = useRef<HTMLButtonElement>(null)
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)} aria-label="포트폴리오 홈">
          <img className="brand-icon" src="/favicon.svg" alt="" width={30} height={30} />
        </Link>
        <nav aria-label="주 메뉴" className="desktop-nav">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          {profile.github && (
            <ExternalLink className="github-link" href={profile.github}>
              <GitBranch size={17} aria-hidden="true" />
              GitHub
            </ExternalLink>
          )}
          <button
            className="icon-button theme-button"
            onClick={toggle}
            aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
          >
            {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
          </button>
          <button
            ref={menuButton}
            className="icon-button mobile-toggle"
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
        {open && (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="모바일 주 메뉴"
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setOpen(false)
                menuButton.current?.focus()
              }
            }}
          >
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
              >
                {item.label}
                <ArrowUpRight size={16} aria-hidden="true" />
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

export function Layout() {
  const { pathname } = useLocation()
  const main = useRef<HTMLElement>(null)
  const previousPath = useRef(pathname)
  useEffect(() => {
    const meta = getMetadata(pathname)
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', meta.url)
    for (const [property, content] of [
      ['og:title', meta.title],
      ['og:description', meta.description],
      ['og:url', meta.url],
    ])
      document.querySelector(`meta[property="${property}"]`)?.setAttribute('content', content)
    let robots = document.querySelector('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.setAttribute('name', 'robots')
      document.head.append(robots)
    }
    robots.setAttribute('content', meta.notFound ? 'noindex, follow' : 'index, follow')
    if (previousPath.current !== pathname) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      main.current?.focus()
      previousPath.current = pathname
    }
  }, [pathname])
  return (
    <>
      <a className="skip-link" href="#main-content">
        본문으로 바로가기
      </a>
      <Header key={pathname} />
      <main ref={main} id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <Link to="/" className="footer-brand" aria-label="포트폴리오 홈">
              <img src="/favicon.svg" alt="" width={20} height={20} />
            </Link>
            <p>
              © {new Date().getFullYear()} {profile.name || 'Developer Portfolio'}. All rights
              reserved.
            </p>
          </div>
          <div className="footer-links">
            {profile.phone && <a href={`tel:${profile.phone}`}>{profile.phone}</a>}
            {profile.github && <ExternalLink href={profile.github}>GitHub</ExternalLink>}
            {profile.email && (
              <a href={`mailto:${profile.email}`}>
                Email
                <ArrowUpRight size={14} />
              </a>
            )}
            <a
              href="#main-content"
              onClick={(event) => {
                event.preventDefault()
                window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? 'instant'
                    : 'smooth',
                })
                main.current?.focus({ preventScroll: true })
              }}
            >
              맨 위로
              <ArrowUp size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
