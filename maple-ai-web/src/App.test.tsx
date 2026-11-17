import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

const COMMANDS = {
  commands: [
    { name: '스타포스', aliases: ['sf'], arg: '단계', description: '강화 확률', example: '/스타포스 22' },
    { name: '스탯', aliases: [], arg: '닉네임', description: '최종 스탯', example: '/스탯 오지환' },
  ],
}

function mockApi(online = true) {
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    if (url.endsWith('/health'))
      return online ? json({ status: 'ok', busy: 0 }) : json({ status: 'offline', message: 'PC 꺼짐' }, 503)
    if (url.endsWith('/commands')) return json(COMMANDS)
    if (url.endsWith('/command')) {
      const { text } = JSON.parse(String(init?.body))
      return json({
        ok: true,
        card: { title: `${text} 결과`, fields: [{ label: '파괴 확률(일반)', value: '16.85%' }] },
      })
    }
    throw new Error(`unexpected ${url}`)
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('App', () => {
  it('/ 를 입력하면 명령어 목록이 뜨고, 고른 명령을 실행해 카드를 보여준다', async () => {
    mockApi()
    const user = userEvent.setup()
    render(<App />)
    expect(await screen.findByText('PC 온라인')).toBeInTheDocument()

    const input = screen.getByRole('textbox', { name: '질문 입력' })
    await user.type(input, '/스')
    expect(screen.getByRole('listbox', { name: '명령어' })).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(2)

    await user.keyboard('{Enter}') // 첫 후보 완성 → "/스타포스 "
    expect(input).toHaveValue('/스타포스 ')
    await user.type(input, '22{Enter}')

    expect(await screen.findByText('/스타포스 22 결과')).toBeInTheDocument()
    expect(screen.getByText('16.85%')).toBeInTheDocument()
  })

  it('PC 가 꺼져 있으면 안내를 띄우고 입력을 막는다', async () => {
    mockApi(false)
    render(<App />)
    expect(await screen.findByRole('alert')).toHaveTextContent('PC 꺼짐')
    expect(screen.getByRole('textbox', { name: '질문 입력' })).toBeDisabled()
  })
})
