# 개발자 포트폴리오

`https://jong.3geun.com`에서 제공할 한국어 개인 개발자 포트폴리오입니다. 자기소개와 이력서 요약, 전체 이력서, 프로젝트 목록·상세 페이지를 제공합니다. 실제 개인 콘텐츠는 비어 있으며 임의의 경력·기술·연락처·프로젝트를 넣지 않았습니다. `Backend Developer`는 직무 UI 기본값입니다.

React 19, TypeScript 6, Vite 8, Tailwind CSS 4, React Router 7, Lucide React를 사용합니다. 테스트는 Vitest·React Testing Library, 운영은 Nginx 정적 파일 + Docker Compose입니다. 설치 버전은 `package.json`에 고정하고 `package-lock.json`으로 재현합니다. Node.js 22.12 이상이 필요합니다. Node 요구사항과 Tailwind 설정은 [Vite 공식 문서](https://vite.dev/guide/)와 [Tailwind 공식 문서](https://tailwindcss.com/docs/installation/using-vite)를 확인했습니다.

## 시작

```sh
npm ci
npm run dev
```

개발 서버는 기본 `http://127.0.0.1:5173`입니다. Windows PowerShell에서 실행 정책으로 `npm`이 차단되면 `npm.cmd`를 사용하세요.

```sh
npm run check    # ESLint → 테스트 → 타입 검사 및 프로덕션 빌드
npm run preview  # 빌드된 dist를 로컬에서 확인
```

`npm run typecheck`, `npm run lint`, `npm test`로 개별 검증도 가능합니다. 브라우저 UI 테스트와 운영 Nginx 검증은 자동 단위 테스트에 포함되지 않습니다.

## 구조

```text
src/
  app/             라우트 및 메타데이터
  components/      layout, common, resume, project
  pages/           Home, Resume, Projects, ProjectDetail, NotFound
  data/            profile.ts, skills.ts, resume.ts, projects.ts
  types/           콘텐츠 타입
  hooks/           시스템/수동 테마 처리
  styles/          디자인 토큰, Tailwind, 반응형, 인쇄 스타일
  test/            렌더링·라우팅·콘텐츠·테마 테스트
  entry-static.tsx 빌드 시 HTML 렌더링 진입점
public/            favicon, 테마 초기화, 이미지 및 PDF 위치
scripts/           정적 페이지·메타데이터·사이트맵 생성
Dockerfile         Node 빌드 → 비루트 Nginx 이미지
nginx.conf         캐시, gzip, 보안 헤더, 라우팅
```

## 콘텐츠 수정

JSX 수정 없이 아래 데이터만 편집한 뒤 다시 빌드합니다.

| 내용                             | 파일                   |
| -------------------------------- | ---------------------- |
| 이름·직무·소개·GitHub·이메일·PDF | `src/data/profile.ts`  |
| 카테고리별 기술                  | `src/data/skills.ts`   |
| 경험·학력·자격증                 | `src/data/resume.ts`   |
| 프로젝트 카드·상세·대표 여부     | `src/data/projects.ts` |

전체 필드와 작성법은 [CONTENT_GUIDE.md](CONTENT_GUIDE.md)를 참고하세요. 비어 있는 GitHub·이메일·PDF 링크는 숨깁니다. 존재하지 않는 프로젝트 slug는 404 화면으로 연결됩니다.

## 빌드와 SEO

`npm run build`는 클라이언트 번들 생성 후 같은 React 컴포넌트를 서버에서 일회성 렌더링하여 `/`, `/resume`, `/projects`, 등록된 프로젝트별 HTML, `404.html`, `robots.txt`, `sitemap.xml`을 `dist/`에 생성합니다. 운영 시 Node 프로세스나 API·DB는 필요하지 않습니다. 프로젝트 slug 중복·잘못된 형식은 빌드를 실패시킵니다.

페이지마다 초기 HTML에 제목·설명·canonical·Open Graph와 본문을 포함하므로 자바스크립트를 실행하지 않는 크롤러도 내용을 읽을 수 있습니다. 클라이언트 이동 시 메타데이터도 갱신됩니다. 새 콘텐츠는 재빌드해야 반영됩니다. 실제 검색 노출과 SNS 캐시 갱신은 보장하지 않습니다. 기본 OG 이미지는 SVG이며, 일부 SNS의 호환성을 위해 공개 전 `public/og-image.png`를 추가하고 `index.html`의 `og:image`를 바꾸는 것을 권장합니다.

현재 앱 규모에서 별도 코드 분할보다 작은 단일 번들을 우선했습니다. 페이지가 커지면 측정 후 분할하세요. 폰트·이미지를 외부에서 다운로드하지 않습니다. 이미지에는 명시적인 alt를 사용하고, 자체 호스팅 경로를 권장합니다.

## Docker 실행

Docker가 설치된 환경에서:

```sh
cp .env.example .env
# 18080 포트가 비어 있는지 먼저 확인하고 필요 시 .env 수정
docker compose config
docker compose build portfolio
docker compose up -d --no-deps portfolio
docker compose ps
curl -f http://127.0.0.1:18080/healthz
```

기본 포트는 루프백에만 바인딩됩니다. 호스트의 기존 HTTPS 리버스 프록시가 `127.0.0.1:18080`으로 전달하도록 연결합니다. Docker 프록시 환경에는 외부 포트를 제거하는 `docker-compose.proxy.yml`을 제공합니다. 실제 연결 방식과 인증서 경로는 서버 확인 후 정합니다. 자세한 배포·검증·롤백 절차는 [DEPLOYMENT.md](DEPLOYMENT.md)를 따르세요.

## 운영 및 검증 상태

- 자동 검증: 타입 검사, ESLint, 12개 컴포넌트·라우팅 테스트, 정적 HTML 생성 포함 프로덕션 빌드 통과.
- 생성된 정적 HTML 4개의 본문·페이지 메타데이터·사이트맵을 빌드 과정에서 추가 검증합니다.
- 로컬 브라우저 확인: 320px 홈·이력서·프로젝트 화면의 가로 넘침 없음, 768px 홈, 1280px 홈·이력서, 모바일 메뉴 이동 후 닫힘, 다크 모드 및 새로고침 후 유지, 하위 경로 새로고침, 없는 프로젝트 404 화면을 확인했습니다. 확인 과정의 콘솔 경고·오류는 없었습니다. 등록 프로젝트 상세는 테스트 데이터로 컴포넌트 검증했습니다.
- 번들 최초 측정: JavaScript 약 290 kB / gzip 91 kB, CSS 약 26 kB / gzip 6 kB. 변경 시 빌드 출력으로 다시 확인하세요.
- 현재 Windows 개발 환경에는 Docker가 없습니다. Docker 이미지 빌드·컨테이너·Nginx 런타임 및 재시작은 서버에서 검증해야 합니다.
- 서버 로그인 정보가 없어 기존 포트·프록시·인증서 경로와 실제 도메인 HTTPS는 검증하지 않았습니다. 기존 서버·DNS·인증서 설정은 변경하지 않았습니다.

의존성 업데이트 시 `npm run check`와 브라우저 확인, Docker 검증을 수행하세요. 운영 이미지에는 날짜나 커밋 기반 고유 태그를 사용하고 이전 이미지를 보관하세요. Dockerfile 베이스 이미지 태그는 보안 패치를 받도록 관리하며, 운영 승인 시 이미지 digest로 고정하면 재현성을 높일 수 있습니다. 로그는 컨테이너당 최대 약 30 MB로 제한합니다.
