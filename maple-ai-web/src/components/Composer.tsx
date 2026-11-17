import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { SendHorizontal, Square } from 'lucide-react'
import { suggest, type CommandInfo } from '../lib/input'

interface Props {
  commands: CommandInfo[]
  disabled: boolean
  disabledReason?: string
  busy: boolean
  onSubmit: (text: string) => void
  onStop: () => void
  draft: string
  setDraft: (v: string) => void
}

export function Composer({ commands, disabled, disabledReason, busy, onSubmit, onStop, draft, setDraft }: Props) {
  const [active, setActive] = useState(0)
  const [dismissed, setDismissed] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const listId = useId()

  const options = dismissed ? [] : suggest(draft, commands)
  const atHint = !dismissed && /^@[^\s]*$/.test(draft)
  const open = options.length > 0

  useEffect(() => {
    if (!disabled && !busy) inputRef.current?.focus()
  }, [disabled, busy])

  const complete = (c: CommandInfo) => {
    setDraft(`/${c.name}${c.arg ? ' ' : ''}`)
    setActive(0)
    setDismissed(false)
    inputRef.current?.focus()
  }

  const send = () => {
    if (disabled || busy || !draft.trim()) return
    onSubmit(draft)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return // 한글 조합 중 Enter 는 무시
    if (open) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((a) => (a + 1) % options.length)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((a) => (a - 1 + options.length) % options.length)
        return
      }
      if (e.key === 'Tab' || (e.key === 'Enter' && !e.shiftKey)) {
        const c = options[active]
        // 이미 완성된 인자 없는 명령(/이벤트)은 Enter 로 바로 실행
        if (e.key === 'Enter' && `/${c.name}` === draft.trim() && !c.arg) {
          e.preventDefault()
          send()
          return
        }
        e.preventDefault()
        complete(c)
        return
      }
      if (e.key === 'Escape') {
        setDismissed(true)
        return
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="composer">
      {open && (
        <ul className="suggest" id={listId} role="listbox" aria-label="명령어">
          {options.map((c, i) => (
            <li
              key={c.name}
              role="option"
              aria-selected={i === active}
              className={i === active ? 'active' : undefined}
              onMouseDown={(e) => {
                e.preventDefault()
                complete(c)
              }}
              onMouseEnter={() => setActive(i)}
            >
              <span className="cmd">
                /{c.name}
                {c.arg && <span className="cmd-arg"> {c.arg}</span>}
              </span>
              <span className="cmd-desc">{c.description}</span>
            </li>
          ))}
        </ul>
      )}
      {atHint && (
        <p className="suggest-hint">
          <b>@닉네임</b> 만 보내면 캐릭터 카드, <b>@닉네임 질문</b> 은 그 캐릭터 기준으로 AI 에게 물어봅니다.
        </p>
      )}
      <div className="composer-box">
        <textarea
          ref={inputRef}
          rows={1}
          value={draft}
          maxLength={300}
          placeholder={disabled ? disabledReason : '질문을 입력하거나 / 로 명령어, @ 로 캐릭터를 불러오세요'}
          aria-label="질문 입력"
          aria-autocomplete="list"
          aria-controls={open ? listId : undefined}
          aria-expanded={open}
          disabled={disabled}
          onChange={(e) => {
            setDraft(e.target.value)
            setActive(0)
            setDismissed(false)
          }}
          onKeyDown={onKeyDown}
        />
        {busy ? (
          <button type="button" className="send stop" onClick={onStop} aria-label="답변 중지">
            <Square size={16} aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            className="send"
            onClick={send}
            disabled={disabled || !draft.trim()}
            aria-label="보내기"
          >
            <SendHorizontal size={18} aria-hidden />
          </button>
        )}
      </div>
    </div>
  )
}
