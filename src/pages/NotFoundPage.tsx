import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="container not-found">
      <p className="error-number" aria-hidden="true">
        404<span>_</span>
      </p>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p className="muted">주소가 변경되었거나 아직 준비되지 않은 페이지입니다.</p>
      <div className="hero-buttons">
        <Link className="button primary" to="/">
          <ArrowLeft size={17} />
          홈으로 돌아가기
        </Link>
        <Link className="button secondary" to="/projects">
          프로젝트 보기
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </div>
  )
}
