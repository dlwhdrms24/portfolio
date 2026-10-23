import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { App } from './app/App'
import { getMetadata, siteUrl } from './app/metadata'
import { projects } from './data/projects'

export const paths = [
  '/',
  '/resume',
  '/projects',
  ...projects.map((project) => `/projects/${project.slug}`),
]
export { getMetadata, siteUrl }
export function render(path: string) {
  return renderToString(
    <StaticRouter location={path}>
      <App />
    </StaticRouter>,
  )
}
