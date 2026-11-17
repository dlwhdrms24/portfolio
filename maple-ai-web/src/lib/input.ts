// 입력창 텍스트를 어떤 요청으로 보낼지 분류한다.
//   /명령 인자        → 명령어 (AI 답변 없이 카드)
//   @닉네임           → 캐릭터 카드 명령
//   @닉네임 질문      → 그 캐릭터를 지정한 AI 질문
//   그 외             → AI 질문

export type Intent =
  | { kind: 'command'; text: string }
  | { kind: 'ask'; question: string; character?: string }
  | { kind: 'invalid'; message: string }

const NICKNAME = /^[0-9A-Za-z가-힣]{1,12}$/

export function classify(raw: string): Intent {
  const text = raw.trim()
  if (!text) return { kind: 'invalid', message: '질문이나 명령어를 입력해 주세요.' }
  if (text.startsWith('/')) return { kind: 'command', text }
  if (text.startsWith('@')) {
    const [head, ...rest] = text.slice(1).split(/\s+/)
    if (!NICKNAME.test(head)) {
      return { kind: 'invalid', message: '@ 뒤에는 캐릭터 닉네임(한글·영문·숫자 12자 이내)을 붙여 주세요.' }
    }
    const question = rest.join(' ').trim()
    return question ? { kind: 'ask', question, character: head } : { kind: 'command', text: `@${head}` }
  }
  return { kind: 'ask', question: text }
}

export interface CommandInfo {
  name: string
  aliases: string[]
  arg: string | null
  description: string
  example: string
}

/** '/' 로 시작하고 아직 공백이 없으면(명령 이름 입력 중) 자동완성 후보를 돌려준다. */
export function suggest(text: string, commands: CommandInfo[]): CommandInfo[] {
  if (!text.startsWith('/') || /\s/.test(text)) return []
  const q = text.slice(1).toLowerCase()
  return commands.filter((c) => [c.name, ...c.aliases].some((n) => n.toLowerCase().startsWith(q)))
}
