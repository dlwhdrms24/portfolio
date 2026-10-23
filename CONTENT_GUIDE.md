# 콘텐츠 입력 가이드

실제 공개해도 되는 정보만 `src/data/`에 입력합니다. 아래 코드는 필드 설명을 위한 작성 틀이며 공개 사이트에는 포함되지 않습니다. 빈 문자열은 확인된 내용으로 교체하고, 불필요한 항목은 빈 배열로 유지하세요. 타입 정의는 `src/types/index.ts`에서 확인할 수 있습니다.

## 프로필

`src/data/profile.ts`:

```ts
export const profile: Profile = {
  name: '', // 실제 이름
  role: 'Backend Developer', // 직무 표시, 경력 주장이 아닌 UI 기본값
  introduction: '', // 홈 및 이력서의 짧은 소개
  about: [], // 전체 이력서의 문단: ['첫 문단', '다음 문단']
  // github: 'https://github.com/공개계정',
  // email: '공개할 이메일 주소',
  // location: '공개할 지역',
  // resumePdf: '/files/resume.pdf',
}
```

연락처와 PDF는 입력 전까지 숨깁니다. GitHub와 프로젝트 외부 링크는 `https://` 또는 `http://` URL을 사용하세요. 외부 링크는 새 탭 표시와 `noopener noreferrer`를 적용합니다. PDF는 `public/files/resume.pdf`로 저장한 뒤 `resumePdf: '/files/resume.pdf'`를 설정합니다. 경로는 대소문자를 구분합니다.

## 기술 스택

`src/data/skills.ts`의 `skills` 배열에 실제 사용한 기술을 분류해서 추가합니다.

```ts
export const skills: SkillCategory[] = [{ name: '카테고리 이름', skills: ['실제로 사용한 기술명'] }]
```

홈에는 등록 순으로 최대 6개, 이력서에는 전체 카테고리가 표시됩니다. 빈 카테고리는 숨깁니다.

## 경험, 학력, 자격증

`src/data/resume.ts`에서 각 배열을 편집합니다. 경력뿐 아니라 사실에 근거한 개발 학습 경험도 등록할 수 있습니다. `id`는 배열 안에서 중복되지 않도록 지정하세요. 최신 항목부터 직접 정렬합니다.

```ts
export const resume: Resume = {
  experiences: [
    {
      id: 'unique-experience',
      title: '', // 직무 또는 학습 경험 제목
      organization: '', // 조직 또는 교육 과정
      period: '', // 실제 기간
      descriptions: [], // 실제 수행 업무·학습 내용
    },
  ],
  education: [{ id: 'unique-education', institution: '', course: '', period: '', description: '' }],
  certifications: [{ id: 'unique-certification', name: '', issuer: '', date: '' }],
}
```

위의 빈 항목은 작성 틀입니다. 실제 내용이 없는 항목은 객체를 넣지 말고 `[]`로 유지하세요. 홈에는 경험을 최대 2개 보여 줍니다.

## 프로젝트

`src/data/projects.ts`에 `Project` 객체를 추가하면 목록, 이력서 요약, 상세 HTML과 사이트맵에 반영됩니다. `featured: true`인 프로젝트는 홈에도 표시됩니다. 표시 순서는 데이터 배열 순서입니다.

```ts
export const projects: Project[] = [
  {
    slug: 'unique-project-slug', // 소문자 영문·숫자와 단일 하이픈, 중복 금지
    name: '',
    summary: '', // 카드와 메타 설명에 사용할 짧은 소개
    period: '',
    type: '', // 개인 / 팀 등 실제 프로젝트 유형
    role: '',
    teamSize: 1, // 실제 인원, 모르면 필드를 생략
    purpose: '', // Overview 본문
    technologies: [],
    featured: false,
    // cover: { src: '/images/프로젝트/cover.webp', alt: '화면에 대한 설명' },
    features: [],
    problems: [],
    links: [],
  },
]
```

선택적인 상세 필드를 같은 객체에 추가할 수 있습니다.

```ts
features: [
  { title: '구현한 기능명', description: '기능에 대한 실제 설명',
    image: { src: '/images/project/feature.webp', alt: '기능 화면 설명', caption: '이미지 설명' } },
],
architecture: {
  description: '공개 가능한 시스템 구성과 설계 이유',
  image: { src: '/images/project/architecture.webp', alt: '비식별화된 시스템 구성도' },
  dataFlow: ['첫 단계', '다음 단계'],
},
problems: [
  { title: '문제 제목', problem: '증상', cause: '원인', solution: '해결 과정', result: '검증한 결과' },
],
retrospective: {
  learned: ['실제로 배운 점'],
  improvements: ['향후 개선할 점'],
},
links: [
  { label: 'GitHub', type: 'github', url: 'https://공개-저장소-주소' },
  { label: 'Live Demo', type: 'demo', url: 'https://공개-데모-주소' },
  { label: 'Documentation', type: 'documentation', url: 'https://공개-문서-주소' },
],
```

자료가 없는 선택 섹션은 필드를 생략하거나 빈 배열로 유지하면 숨겨집니다. `architecture.image`는 생략해도 설명과 데이터 흐름이 표시됩니다. Markdown·HTML 문자열을 해석하지 않으며 본문은 일반 텍스트입니다. 여러 줄이 필요하면 문자열 안의 `\n`을 사용하세요.

## 이미지와 파일

`public/images/` 아래에 이미지 파일을 저장하고 데이터에는 `/images/...` 경로를 사용합니다. SVG 아키텍처 그림도 지원합니다. 스크린샷은 적절히 축소하고 WebP·AVIF를 우선 고려하세요. 카드 이미지의 권장 비율은 16:9입니다. 이미지에는 내용이 전달되는 alt를 입력합니다. 외부 이미지 호스트는 현재 CSP에서 허용하지 않으므로 자체 호스팅을 사용하세요.

내부 IP, 네트워크 세부 정보, API 키, 계정 정보, 비공개 고객 데이터, 승인받지 않은 스크린샷을 올리지 마세요. 업로드 전 화면과 이미지 메타데이터를 점검하고 필요한 경우 비식별화된 구성도를 직접 제작하세요. `public/`의 모든 파일은 공개됩니다.

## 적용

```sh
npm run check
npm run preview
```

홈·이력서·목록·새 프로젝트 상세를 확인하고, 320px 모바일과 다크 모드에서도 읽기 편한지 확인합니다. 프로젝트 slug를 바꾸면 URL도 변경되므로 공개 후에는 유지하거나 리버스 프록시에 리다이렉트를 추가하세요. 정적 사이트이므로 콘텐츠를 수정하면 Docker 이미지를 다시 빌드해 배포해야 합니다. 배포와 롤백은 `DEPLOYMENT.md`를 참고하세요.
