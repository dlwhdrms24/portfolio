import type { CommandInfo } from './input'

const BASE = `${import.meta.env.BASE_URL}api`

export interface Source {
  n: number
  heading: string
  source: string
  url?: string
  date?: string
}

export interface Card {
  title: string
  subtitle?: string
  image?: string
  fields?: { label: string; value: string }[]
  table?: { columns: string[]; rows: string[][] }
  items?: { title: string; url?: string; meta?: string; text?: string }[]
  note?: string
  source?: { label: string; url?: string; date?: string }
}

export type Health =
  | { state: 'online'; busy: number }
  | { state: 'offline'; message: string }
  | { state: 'degraded'; message: string }

const OFFLINE_DEFAULT = 'AI 서버(개인 PC)가 지금 꺼져 있습니다. 잠시 후 다시 시도해 주세요.'

async function errorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json()
    if (body?.status === 'offline') return body.message ?? OFFLINE_DEFAULT
    if (typeof body?.detail === 'string') return body.detail
  } catch {
    /* 본문이 JSON 이 아니면 상태 코드로 안내 */
  }
  if (res.status === 429) return '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.'
  if (res.status === 503) return OFFLINE_DEFAULT
  return `요청을 처리하지 못했습니다 (HTTP ${res.status}).`
}

export async function fetchHealth(): Promise<Health> {
  try {
    const res = await fetch(`${BASE}/health`, { cache: 'no-store' })
    const body = await res.json()
    if (res.ok && body.status === 'ok') return { state: 'online', busy: body.busy ?? 0 }
    if (body.status === 'offline') return { state: 'offline', message: body.message ?? OFFLINE_DEFAULT }
    return { state: 'degraded', message: 'AI 서버 일부 구성요소가 응답하지 않습니다.' }
  } catch {
    return { state: 'offline', message: OFFLINE_DEFAULT }
  }
}

export async function fetchCommands(): Promise<CommandInfo[]> {
  const res = await fetch(`${BASE}/commands`)
  if (!res.ok) throw new Error(await errorMessage(res))
  return (await res.json()).commands
}

export async function runCommand(text: string): Promise<Card> {
  const res = await fetch(`${BASE}/command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error(await errorMessage(res))
  const body = await res.json()
  if (!body.ok) throw new Error(body.message)
  return body.card
}

export interface AskHandlers {
  onStage?: (stage: string) => void
  onRoute?: (route: { intent: string; character_name: string | null; search_query: string }) => void
  onSources?: (sources: Source[]) => void
  onToken?: (text: string) => void
  onReplace?: (text: string) => void
  onDone?: (done: { grounded: boolean; timings: Record<string, number> }) => void
}

/** SSE 한 덩어리("event: x\ndata: {...}")를 해석한다. 테스트용으로 따로 내보낸다. */
export function parseEvent(block: string): { event: string; data: unknown } | null {
  let event = 'message'
  const data: string[] = []
  for (const line of block.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim()
    else if (line.startsWith('data:')) data.push(line.slice(5).trimStart())
  }
  if (!data.length) return null
  return { event, data: JSON.parse(data.join('\n')) }
}

/** POST 로 질문하고 SSE 응답을 읽는다 (EventSource 는 POST 를 못 써서 fetch 스트림을 직접 해석). */
export async function ask(
  question: string,
  character: string | undefined,
  h: AskHandlers,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${BASE}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(character ? { question, character } : { question }),
    signal,
  })
  if (!res.ok || !res.body) throw new Error(await errorMessage(res))

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader()
  let buf = ''
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buf += value
    let cut: number
    while ((cut = buf.indexOf('\n\n')) >= 0) {
      const ev = parseEvent(buf.slice(0, cut))
      buf = buf.slice(cut + 2)
      if (!ev) continue
      const d = ev.data as Record<string, unknown>
      switch (ev.event) {
        case 'status':
          h.onStage?.(String(d.stage))
          break
        case 'route':
          h.onRoute?.(d as never)
          break
        case 'sources':
          h.onSources?.(ev.data as Source[])
          break
        case 'token':
          h.onToken?.(String(d.text))
          break
        case 'replace':
          h.onReplace?.(String(d.text))
          break
        case 'done':
          h.onDone?.(d as never)
          break
        case 'error':
          throw new Error(String(d.message))
      }
    }
  }
}
