import type { ReactNode } from 'react'
import { ArrowUpRight, FolderOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SectionHeading({
  title,
  children,
  link,
  id,
}: {
  title: string
  id?: string
  children?: ReactNode
  link?: { to: string; label: string }
}) {
  return (
    <div className="section-heading">
      <div>
        <h2 id={id}>{title}</h2>
        {children && <p className="section-description">{children}</p>}
      </div>
      {link && (
        <Link className="text-link" to={link.to}>
          {link.label}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
export function EmptyState({
  title,
  description,
  compact = false,
}: {
  title: string
  description: string
  compact?: boolean
}) {
  return (
    <div className={`empty-state ${compact ? 'compact' : ''}`}>
      <span className="empty-icon">
        <FolderOpen size={25} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
export function Tags({ items }: { items: string[] }) {
  return items.length ? (
    <ul className="tags" aria-label="기술 스택">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  ) : null
}
export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  if (!/^https?:\/\//i.test(href)) return null
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <ArrowUpRight size={15} aria-hidden="true" />
      <span className="sr-only"> (새 탭)</span>
    </a>
  )
}
