import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const { paths, getMetadata } = await import(
  pathToFileURL(resolve('.local/ssr/entry-static.js')).href
)
const sitemap = await readFile('dist/sitemap.xml', 'utf8')
const escape = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
for (const path of [...paths, '/404']) {
  const file =
    path === '/404' ? 'dist/404.html' : path === '/' ? 'dist/index.html' : `dist${path}/index.html`
  const html = await readFile(file, 'utf8')
  const meta = getMetadata(path)
  assert(html.includes(`<title>${escape(meta.title)}</title>`), `${path}: title`)
  assert(html.includes(`href="${escape(meta.url)}"`), `${path}: canonical`)
  assert(
    new RegExp(
      `<meta\\s+property="og:description"\\s+content="${escape(meta.description).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`,
    ).test(html),
    `${path}: OG description`,
  )
  assert(html.includes('<h1'), `${path}: 사전 렌더링 본문`)
  assert(!html.includes('<!--app-html-->'), `${path}: 렌더링 완료`)
  assert(!html.includes('테스트 전용 프로젝트'), `${path}: 테스트 데이터 배제`)
  if (!meta.notFound) assert(sitemap.includes(`<loc>${escape(meta.url)}</loc>`), `${path}: sitemap`)
  else assert(html.includes('noindex, follow'), `${path}: noindex`)
}
console.log(`정적 페이지 ${paths.length + 1}개: 본문·메타데이터·사이트맵 검증 통과`)
