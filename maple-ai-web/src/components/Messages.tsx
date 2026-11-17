import { AlertTriangle, ExternalLink, ShieldCheck, ShieldAlert } from 'lucide-react'
import type { Card, Source } from '../lib/api'
import { Markdown } from '../lib/markdown'
import { CardView } from './CardView'

export interface Msg {
  id: number
  role: 'user' | 'assistant'
  text: string
  card?: Card
  error?: string
  sources?: Source[]
  stage?: string
  route?: string
  streaming?: boolean
  grounded?: boolean
  replaced?: boolean
  seconds?: number
}

const STAGE: Record<string, string> = {
  queued: '대기 중… (다른 질문을 처리하고 있어요)',
  routing: '질문 분석 중…',
  answering: '답변 작성 중…',
  command: '불러오는 중…',
}

const ROUTE: Record<string, string> = {
  knowledge: '게임 지식 검색',
  character: '캐릭터 조회',
  both: '캐릭터 조회 + 게임 지식',
  smalltalk: '대화',
}

function Sources({ sources }: { sources: Source[] }) {
  return (
    <details className="sources">
      <summary>출처 {sources.length}개</summary>
      <ol>
        {sources.map((s) => (
          <li key={s.n}>
            <span className="src-n">{s.n}</span>
            {s.url ? (
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.heading} <ExternalLink size={12} aria-hidden />
              </a>
            ) : (
              s.heading
            )}
            <span className="src-meta">
              {s.source}
              {s.date ? ` · ${s.date}` : ''}
            </span>
          </li>
        ))}
      </ol>
    </details>
  )
}

export function Message({ m }: { m: Msg }) {
  if (m.role === 'user') {
    return (
      <div className="msg user">
        <p>{m.text}</p>
      </div>
    )
  }
  const waiting = m.streaming && !m.text && !m.card && !m.error
  return (
    <div className="msg assistant" aria-live={m.streaming ? 'polite' : undefined} aria-busy={m.streaming}>
      {m.route && <span className="route-chip">{ROUTE[m.route] ?? m.route}</span>}
      {waiting && (
        <p className="stage">
          <span className="dot" aria-hidden />
          {STAGE[m.stage ?? 'routing'] ?? '처리 중…'}
        </p>
      )}
      {m.error && (
        <p className="error">
          <AlertTriangle size={16} aria-hidden /> {m.error}
        </p>
      )}
      {m.card && <CardView card={m.card} />}
      {m.text && <Markdown text={m.text} />}
      {m.replaced && (
        <p className="badge warn">
          <ShieldAlert size={14} aria-hidden /> 생성된 답변에 자료에 없는 수치가 있어 안내로 바꿨습니다.
        </p>
      )}
      {!m.streaming && m.grounded && m.sources && m.sources.length > 0 && (
        <p className="badge ok">
          <ShieldCheck size={14} aria-hidden /> 답변의 수치를 자료와 대조했습니다
          {m.seconds !== undefined && <span className="secs"> · {m.seconds.toFixed(1)}초</span>}
        </p>
      )}
      {m.sources && m.sources.length > 0 && <Sources sources={m.sources} />}
    </div>
  )
}
