import { describe, expect, it } from 'vitest'
import { classify, suggest, type CommandInfo } from './input'

const commands: CommandInfo[] = [
  { name: '스타포스', aliases: ['sf', '스포'], arg: '단계', description: '', example: '' },
  { name: '스탯', aliases: ['stat'], arg: '닉네임', description: '', example: '' },
  { name: '이벤트', aliases: ['event'], arg: null, description: '', example: '' },
]

describe('classify', () => {
  it('/ 로 시작하면 명령어', () => {
    expect(classify(' /스타포스 22 ')).toEqual({ kind: 'command', text: '/스타포스 22' })
  })

  it('@닉네임 만 있으면 캐릭터 카드 명령', () => {
    expect(classify('@오지환')).toEqual({ kind: 'command', text: '@오지환' })
  })

  it('@닉네임 뒤에 질문이 있으면 캐릭터를 지정한 질문', () => {
    expect(classify('@오지환  무기 몇 성이야?')).toEqual({
      kind: 'ask',
      question: '무기 몇 성이야?',
      character: '오지환',
    })
  })

  it('잘못된 닉네임은 거절', () => {
    expect(classify('@오지환!!').kind).toBe('invalid')
    expect(classify('@').kind).toBe('invalid')
  })

  it('그 외는 일반 질문', () => {
    expect(classify('헬레나 언제 나왔어?')).toEqual({ kind: 'ask', question: '헬레나 언제 나왔어?' })
  })
})

describe('suggest', () => {
  it('이름과 별칭의 접두사로 찾는다', () => {
    expect(suggest('/스', commands).map((c) => c.name)).toEqual(['스타포스', '스탯'])
    expect(suggest('/ev', commands).map((c) => c.name)).toEqual(['이벤트'])
    expect(suggest('/', commands)).toHaveLength(3)
  })

  it('인자를 입력하기 시작하면 닫는다', () => {
    expect(suggest('/스타포스 2', commands)).toEqual([])
    expect(suggest('스', commands)).toEqual([])
  })
})
