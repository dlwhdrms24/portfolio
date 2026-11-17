import { describe, expect, it, vi } from 'vitest'
import { ask, parseEvent } from './api'

function sseResponse(chunks: string[]): Response {
  const enc = new TextEncoder()
  const stream = new ReadableStream({
    start(c) {
      chunks.forEach((s) => c.enqueue(enc.encode(s)))
      c.close()
    },
  })
  return new Response(stream, { status: 200, headers: { 'Content-Type': 'text/event-stream' } })
}

describe('parseEvent', () => {
  it('이벤트 이름과 JSON 데이터를 읽는다', () => {
    expect(parseEvent('event: token\ndata: {"text":"안녕"}')).toEqual({ event: 'token', data: { text: '안녕' } })
    expect(parseEvent('event: ping')).toBeNull()
  })
})

describe('ask', () => {
  it('청크가 이벤트 중간에서 끊겨도 순서대로 처리한다', async () => {
    const body = [
      'event: status\ndata: {"stage":"routing"}\n\nevent: route\ndata: {"intent":"knowledge","character_name":null,"search_query":"q"}\n\n',
      'event: token\ndata: {"text":"22성 "}\n\nevent: tok',
      'en\ndata: {"text":"16.85%"}\n\nevent: done\ndata: {"grounded":true,"timings":{"total":2}}\n\n',
    ]
    vi.stubGlobal('fetch', vi.fn(async () => sseResponse(body)))
    const tokens: string[] = []
    const onDone = vi.fn()
    await ask('질문', undefined, { onToken: (t) => tokens.push(t), onDone })
    expect(tokens.join('')).toBe('22성 16.85%')
    expect(onDone).toHaveBeenCalledWith({ grounded: true, timings: { total: 2 } })
  })

  it('오프라인(503) 이면 서버 안내 문구로 실패한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ status: 'offline', message: 'PC 꺼짐' }), { status: 503 })),
    )
    await expect(ask('질문', undefined, {})).rejects.toThrow('PC 꺼짐')
  })

  it('@닉네임 질문이면 character 를 함께 보낸다', async () => {
    const fetchMock = vi.fn(async () => sseResponse(['event: done\ndata: {"grounded":true,"timings":{}}\n\n']))
    vi.stubGlobal('fetch', fetchMock)
    await ask('무기 몇 성?', '오지환', {})
    const init = (fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1]
    expect(JSON.parse(String(init.body))).toEqual({ question: '무기 몇 성?', character: '오지환' })
  })
})
