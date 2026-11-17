import { Fragment, type ReactNode } from 'react'

// 답변에 나오는 정도의 Markdown 만 안전하게 그린다 (HTML 은 절대 해석하지 않음).
// 지원: 문단, - 목록, 1. 목록, | 표 |, **굵게**, `코드`, [1]/[C] 인용 번호.

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\*\*(.+?)\*\*|`([^`]+)`|\[(\d+|C)\]/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1] !== undefined) out.push(<strong key={`${key}-${i++}`}>{m[1]}</strong>)
    else if (m[2] !== undefined) out.push(<code key={`${key}-${i++}`}>{m[2]}</code>)
    else
      out.push(
        <sup key={`${key}-${i++}`} className="cite" title={m[3] === 'C' ? '캐릭터 정보' : `출처 ${m[3]}`}>
          {m[3]}
        </sup>,
      )
    last = re.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

const cells = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim())

export function Markdown({ text }: { text: string }) {
  const blocks: ReactNode[] = []
  const lines = text.replace(/\r/g, '').split('\n')
  let i = 0
  let k = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) {
      i++
      continue
    }
    if (line.trim().startsWith('|')) {
      const rows: string[][] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        if (!/^\s*\|(\s*:?-{3,}:?\s*\|)+\s*$/.test(lines[i])) rows.push(cells(lines[i]))
        i++
      }
      const [head, ...body] = rows
      blocks.push(
        <div className="table-wrap" key={k++}>
          <table>
            <thead>
              <tr>{head?.map((c, j) => <th key={j}>{inline(c, `h${j}`)}</th>)}</tr>
            </thead>
            <tbody>
              {body.map((r, ri) => (
                <tr key={ri}>{r.map((c, j) => <td key={j}>{inline(c, `c${ri}-${j}`)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      continue
    }
    const ordered = /^\s*\d+\.\s+/.test(line)
    if (ordered || /^\s*[-*·]\s+/.test(line)) {
      const items: string[] = []
      const re = ordered ? /^\s*\d+\.\s+/ : /^\s*[-*·]\s+/
      while (i < lines.length && re.test(lines[i])) items.push(lines[i++].replace(re, ''))
      const List = ordered ? 'ol' : 'ul'
      blocks.push(
        <List key={k++}>
          {items.map((t, j) => (
            <li key={j}>{inline(t, `l${k}-${j}`)}</li>
          ))}
        </List>,
      )
      continue
    }
    const para: string[] = []
    while (i < lines.length && lines[i].trim() && !/^\s*([-*·]|\d+\.|\|)/.test(lines[i])) para.push(lines[i++])
    blocks.push(
      <p key={k++}>
        {para.map((t, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {inline(t.replace(/^#+\s*/, ''), `p${k}-${j}`)}
          </Fragment>
        ))}
      </p>,
    )
  }
  return <div className="md">{blocks}</div>
}
