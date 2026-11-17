import { useCallback, useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Composer } from './components/Composer'
import { Message, type Msg } from './components/Messages'
import { ask, fetchCommands, fetchHealth, runCommand, type Health } from './lib/api'
import { classify, type CommandInfo } from './lib/input'

// API 가 꺼져 있어도 입력창 안내가 비지 않도록 기본 목록을 둔다 (온라인이면 서버 목록으로 교체).
const FALLBACK_COMMANDS: CommandInfo[] = [
  { name: '캐릭터', aliases: [], arg: '닉네임', description: '레벨·직업·전투력 요약', example: '/캐릭터 닉네임' },
  { name: '스타포스', aliases: [], arg: '단계', description: '현재 단계에서 강화할 때 확률', example: '/스타포스 22' },
  { name: '이벤트', aliases: [], arg: null, description: '진행 중인 이벤트', example: '/이벤트' },
  { name: '도움말', aliases: [], arg: null, description: '명령어 목록', example: '/도움말' },
]

// fill: 보내지 않고 입력창에만 채움 (닉네임을 직접 입력해야 하는 예시)
const EXAMPLES = [
  { label: '스포 22성 터질 확률?', text: '스포 22성에서 터질 확률이 얼마야?' },
  { label: '/스타포스 22', text: '/스타포스 22' },
  { label: '/이벤트', text: '/이벤트' },
  { label: '헬레나 언제 나왔어?', text: '헬레나 보스 언제 나왔어?' },
  { label: '@닉네임 → 캐릭터 카드', text: '@', fill: true },
  { label: '@닉네임 무기 더 눌러도 돼?', text: '@', fill: true },
]

let nextId = 1

export default function App() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [health, setHealth] = useState<Health | null>(null)
  const [commands, setCommands] = useState<CommandInfo[]>(FALLBACK_COMMANDS)
  const [busy, setBusy] = useState(false)
  const [draft, setDraft] = useState('')
  const abortRef = useRef<AbortController | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  const refreshHealth = useCallback(async () => {
    const h = await fetchHealth()
    setHealth(h)
    if (h.state === 'online') fetchCommands().then(setCommands, () => undefined)
  }, [])

  useEffect(() => {
    refreshHealth()
    const t = setInterval(refreshHealth, 60_000)
    return () => clearInterval(t)
  }, [refreshHealth])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  const patch = (id: number, p: Partial<Msg> | ((m: Msg) => Partial<Msg>)) =>
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, ...(typeof p === 'function' ? p(m) : p) } : m)))

  const submit = async (raw: string) => {
    const intent = classify(raw)
    if (intent.kind === 'invalid') {
      setMessages((ms) => [...ms, { id: nextId++, role: 'assistant', text: '', error: intent.message }])
      return
    }
    const userMsg: Msg = { id: nextId++, role: 'user', text: raw.trim() }
    const reply: Msg = { id: nextId++, role: 'assistant', text: '', streaming: true, stage: 'routing' }
    setMessages((ms) => [...ms, userMsg, reply])
    setDraft('')
    setBusy(true)
    const started = performance.now()

    try {
      if (intent.kind === 'command') {
        patch(reply.id, { stage: 'command' })
        const card = await runCommand(intent.text)
        patch(reply.id, { card, streaming: false })
      } else {
        const ctrl = new AbortController()
        abortRef.current = ctrl
        await ask(
          intent.question,
          intent.character,
          {
            onStage: (stage) => patch(reply.id, { stage }),
            onRoute: (r) => patch(reply.id, { route: r.intent }),
            onSources: (sources) => patch(reply.id, { sources }),
            onToken: (t) => patch(reply.id, (m) => ({ text: m.text + t })),
            onReplace: (text) => patch(reply.id, { text, replaced: true }),
            onDone: (d) =>
              patch(reply.id, { grounded: d.grounded, seconds: (performance.now() - started) / 1000 }),
          },
          ctrl.signal,
        )
        patch(reply.id, { streaming: false })
      }
    } catch (e) {
      const aborted = e instanceof DOMException && e.name === 'AbortError'
      patch(reply.id, (m) => ({
        streaming: false,
        error: aborted ? (m.text ? undefined : '답변을 멈췄습니다.') : (e as Error).message,
      }))
      if (!aborted) refreshHealth()
    } finally {
      abortRef.current = null
      setBusy(false)
    }
  }

  const offline = health !== null && health.state !== 'online'

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width={32} height={32} />
          <h1>메이플 AI 도우미</h1>
        </div>
        <span className={`status ${health?.state ?? 'checking'}`} role="status">
          {health === null ? '연결 확인 중' : health.state === 'online' ? 'PC 온라인' : 'PC 오프라인'}
        </span>
      </header>

      {offline && (
        <div className="banner" role="alert">
          <p>{health.message}</p>
          <button type="button" className="btn-ghost" onClick={refreshHealth}>
            <RotateCcw size={14} aria-hidden /> 다시 확인
          </button>
        </div>
      )}

      <main className="chat" aria-label="대화">
        {messages.length === 0 ? (
          <section className="intro">
            <img
              className="intro-logo"
              src={`${import.meta.env.BASE_URL}favicon.svg`}
              alt="주황 버섯 모자를 쓴 3geun 새싹 로고"
              width={72}
              height={72}
            />
            <h2>메이플스토리, 무엇이든 물어보세요</h2>
            <p>
              나무위키와 넥슨 공지를 근거로 답하고, 캐릭터 정보는 Nexon Open API 에서 바로 가져옵니다.
              <br />
              <kbd>/</kbd> 를 누르면 명령어, <kbd>@닉네임</kbd> 으로 캐릭터를 불러올 수 있어요.
            </p>
            <div className="examples">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  className="chip"
                  disabled={offline || busy}
                  onClick={() => (ex.fill ? setDraft(ex.text) : submit(ex.text))}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </section>
        ) : (
          <div className="messages">
            {messages.map((m) => (
              <Message key={m.id} m={m} />
            ))}
            <div ref={endRef} />
          </div>
        )}
      </main>

      <footer className="bottom">
        <Composer
          commands={commands}
          disabled={offline}
          disabledReason="AI 서버(개인 PC)가 꺼져 있어 지금은 질문할 수 없습니다"
          busy={busy}
          onSubmit={submit}
          onStop={() => abortRef.current?.abort()}
          draft={draft}
          setDraft={setDraft}
        />
        <p className="fineprint">
          개인 PC 의 로컬 LLM(Qwen3 8B)이 답합니다. 틀릴 수 있으니 중요한 정보는 게임 내에서 확인하세요. 자료:
          나무위키(CC BY-NC-SA 2.0 KR), Nexon Open API.
        </p>
      </footer>
    </div>
  )
}
