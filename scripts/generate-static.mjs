import { build } from 'vite'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

await build({ build: { ssr: 'src/entry-static.tsx', outDir: '.local/ssr', emptyOutDir: true } })
const { render, paths, getMetadata, siteUrl } = await import(
  pathToFileURL(resolve('.local/ssr/entry-static.js')).href
)
if (new Set(paths).size !== paths.length) throw new Error('프로젝트 slug가 중복됩니다.')
for (const path of paths.filter((path) => path.startsWith('/projects/'))) {
  if (!/^\/projects\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path)) throw new Error(`잘못된 slug: ${path}`)
}
const template = await readFile('dist/index.html', 'utf8')
const escape = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
for (const path of [...paths, '/404']) {
  const meta = getMetadata(path)
  const html = template
    .replace(/<title>.*?<\/title>/, () => `<title>${escape(meta.title)}</title>`)
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*/,
      (_match, prefix) => prefix + escape(meta.description),
    )
    .replace(
      /(<meta\s+property="og:title"\s+content=")[^"]*/,
      (_match, prefix) => prefix + escape(meta.title),
    )
    .replace(
      /(<meta\s+property="og:description"\s+content=")[^"]*/,
      (_match, prefix) => prefix + escape(meta.description),
    )
    .replace(
      /(<meta\s+property="og:url"\s+content=")[^"]*/,
      (_match, prefix) => prefix + escape(meta.url),
    )
    .replace(
      /(<link\s+rel="canonical"\s+href=")[^"]*/,
      (_match, prefix) => prefix + escape(meta.url),
    )
    .replace(
      '</head>',
      `<meta name="robots" content="${meta.notFound ? 'noindex, follow' : 'index, follow'}" /></head>`,
    )
    .replace('<!--app-html-->', () => render(path))
  const destination =
    path === '/404' ? 'dist/404.html' : path === '/' ? 'dist/index.html' : `dist${path}/index.html`
  await mkdir(resolve(destination, '..'), { recursive: true })
  await writeFile(destination, html)
}
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${escape(siteUrl + path)}</loc></url>`).join('')}</urlset>\n`,
)
// robots.txt는 public/robots.txt를 그대로 사용한다 (모든 봇 차단).
console.log(`정적 HTML ${paths.length}개 및 404, sitemap.xml 생성 완료`)
