import type { Project } from '../types'

export const projects: Project[] = [
  {
    slug: 'medilens',
    name: 'MediLens',
    summary: '처방전 이미지에서 복약 정보를 추출하고 일정·기록·가족 공유를 관리하는 서비스',
    period: '약 6개월',
    type: '팀 프로젝트',
    role: '서버·DB 중심 개발 참여',
    purpose:
      '처방전·약봉투 이미지에서 복약 정보를 추출하고, 복약 일정과 실제 복용 기록을 관리하며 가족과 공유하는 서비스입니다.',
    technologies: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'React', 'Docker', 'Nginx'],
    featured: true,
    demoAccess: { url: 'https://mymedilens.com/', username: 'testUser', password: 'password' },
    personalDemo: {
      url: 'https://3geun.com/medilens-demo/',
      description:
        '팀 서비스·DB와 분리해 약봉투 인식과 복약 일정 흐름을 개인적으로 다시 구현한 데모입니다.',
    },
    cover: {
      src: '/images/projects/medilens/screens/scan-analysis-redacted.png',
      alt: '약봉투 사진에서 복약 정보를 추출하는 MediLens 분석 진행 화면',
      caption: '약봉투 분석',
      focus: 'center 85%',
    },
    spotlight: {
      description:
        '약 6개월간 팀으로 개발하며 서버와 DB 영역을 중심으로 참여했습니다. 아래는 팀 결과물에서 확인할 수 있는 서버·DB 설계입니다.',
      topics: [
        {
          title: '처방전 분석 작업과 상태 조회',
          description:
            '이미지 분석이 끝날 때까지 업로드 요청을 붙잡아 두면 프록시에서 타임아웃이 날 수 있습니다. 서버는 작업 ID를 먼저 반환하고, 분석 결과와 상태를 DB에 저장합니다. 화면은 상태 조회 API로 완료·실패를 확인합니다.',
        },
        {
          title: '복약 일정·기록·알림 데이터 관리',
          description:
            '복약 설정과 날짜·시간별 수행 기록을 나눠, 일정과 실제 복용 여부를 구분합니다. 복약 기록에는 사용자·복약 항목·날짜·시간을 묶은 유니크 제약을 선언해 같은 일정의 중복 기록을 제한합니다.',
        },
        {
          title: '가족 공유 요청과 권한 확인',
          description:
            '공유 요청과 수신자의 동의·승인 상태를 관리합니다. 가족의 복약 정보를 조회할 때 승인 관계를 확인하도록 구현되어 있습니다.',
        },
      ],
      relations: [
        { from: '회원', to: '복약 설정', reason: '회원별 복약 기간과 반복 시간 관리' },
        { from: '복약 설정', to: '복용 기록', reason: '날짜·시간별 실제 수행 상태 기록' },
        { from: '복약 설정', to: '알림 설정', reason: '복약 일정과 알림 시간 연결' },
        { from: '알림 설정', to: '발송 이력', reason: '알림별·날짜별 발송 기록 관리' },
        { from: '회원', to: '공유 관계', reason: '요청자·수신자와 승인 상태 관리' },
      ],
    },
    screenshots: [
      {
        src: '/images/projects/medilens/screens/home.png',
        alt: '의약품 검색, 내 의약품 목록, 복용 통계를 보여주는 MediLens 홈',
        caption: '홈 · 의약품 검색과 복용 통계',
      },
      {
        src: '/images/projects/medilens/screens/scan.png',
        alt: '사진 촬영, 갤러리 선택, 직접 입력 옵션을 보여주는 약봉투 스캔 화면',
        caption: '약봉투 스캔 · 이미지 업로드와 직접 입력',
      },
      {
        src: '/images/projects/medilens/screens/schedule.png',
        alt: '월간 달력과 선택한 날짜의 복용 일정을 보여주는 화면',
        caption: '복용 스케줄 · 날짜별 일정 확인',
      },
      {
        src: '/images/projects/medilens/screens/login-compact.png',
        alt: '아이디 로그인과 Google, 카카오, 네이버 간편 로그인 화면',
        caption: '로그인 · 일반 로그인과 소셜 로그인',
      },
      {
        src: '/images/projects/medilens/screens/login-desktop.png',
        alt: '서비스 소개와 로그인 양식을 나란히 배치한 데스크톱 화면',
        caption: '데스크톱 로그인 · 서비스 소개와 로그인 양식',
      },
      {
        src: '/images/projects/medilens/screens/family-sharing-redacted.png',
        alt: '계정 QR이 가려진 가족 계정 관리 화면. 복용 공유 요청과 초대 링크 기능을 보여줍니다.',
        caption: '가족 계정 관리 · 복용 정보 공유 (QR 비공개)',
      },
      {
        src: '/images/projects/medilens/screens/admin-dashboard-redacted.png',
        alt: '회원 수, 접속 추이, 복용 통계와 이메일을 가린 활동 로그를 보여주는 관리자 대시보드',
        caption: '관리자 대시보드 · 접속 통계와 활동 로그 (이메일 비공개)',
      },
    ],
    integrations: [
      {
        title: 'OpenAI API · GPT-4o Vision',
        description:
          '약봉투·처방전 이미지에서 복약 정보를 추출합니다. FastAPI는 분석을 작업 ID로 접수하고 화면에 진행 상태를 제공합니다.',
      },
      {
        title: '식약처 공공데이터 API',
        description:
          '상비약 검색과 의약품 정보 조회에 사용합니다. 이미지 분석에서 추출한 이름은 의약품 데이터와 대조합니다.',
      },
      {
        title: 'Google·카카오·네이버 OAuth',
        description:
          '로그인 화면의 세 가지 간편 로그인과 연결됩니다. FastAPI에서 인증 코드를 토큰으로 교환하고 사용자 프로필을 조회합니다.',
      },
      {
        title: 'Web Push',
        description:
          '브라우저에 복약 알림을 전달합니다. 가족 알림은 승인된 공유 관계와 수신 설정을 확인한 뒤 전송합니다.',
      },
    ],
    features: [
      {
        title: '복약 관리',
        description:
          '이미지 분석 결과를 확인해 복약 일정으로 등록하고, 날짜와 시간별로 복용 여부를 기록합니다.',
      },
      {
        title: '복약·가족 알림',
        description:
          '복약 시간에 웹 푸시를 보내고, 미복용 알림은 승인된 가족 관계와 수신 설정을 확인해 전달합니다.',
      },
      {
        title: '회원 인증과 관리자 기능',
        description:
          'JWT 기반 인증과 소셜 로그인 연동을 제공하며, 관리자 기능은 역할 단계에 따라 접근을 검사합니다.',
      },
    ],
    architecture: {
      description:
        'MediLens는 Cloudflare DNS로 서비스 도메인을 Oracle Cloud 서버에 연결합니다. 서버 안에서는 React 프런트엔드, FastAPI, PostgreSQL을 Docker 컨테이너로 실행합니다. FastAPI는 처방전 이미지 분석에 GPT-4o Vision을, 의약품 정보 조회에 식품의약품안전처 공공데이터 API를 사용합니다.',
      image: {
        src: '/images/projects/medilens-architecture.svg',
        alt: '브라우저에서 Cloudflare DNS를 조회한 뒤 Oracle Cloud 서버에 접속합니다. Docker의 React 프런트엔드가 화면을 제공하고 FastAPI는 PostgreSQL, GPT-4o Vision, 식약처 공공데이터 API와 통신합니다.',
        caption: 'MediLens 배포 구조와 외부 API 연결',
      },
      dataFlow: [
        '사용자가 브라우저에 서비스 주소를 입력하면 Cloudflare DNS의 도메인 설정을 통해 접속할 서버 주소를 찾습니다.',
        'Oracle Cloud 서버의 프런트엔드 컨테이너가 Vite로 빌드한 React 화면을 브라우저에 제공합니다.',
        '화면에서 처방전 이미지를 올리면 FastAPI가 작업 ID를 반환하고, GPT-4o Vision으로 이미지를 분석합니다.',
        'FastAPI는 식약처 공공데이터 API에서 의약품 정보를 조회하고, 작업 상태와 복약 데이터는 PostgreSQL에서 관리합니다.',
        '브라우저는 작업 ID로 분석 결과를 확인합니다. 사용자가 확인한 복약 정보는 일정·알림과 연결됩니다.',
      ],
    },
    // 실제 담당과 경험을 확인한 뒤 개인의 문제 해결 사례·회고를 추가합니다.
    problems: [],
    links: [],
  },
  {
    slug: 'create-problem-ai',
    name: 'Create Problem AI',
    summary: 'AI 문제 생성부터 웹 코드 실행과 테스트 결과 확인까지 연결한 React 프로토타입',
    period: '2~3일',
    type: '개인 프로젝트',
    role: '화면 구현 및 외부 API 연동',
    purpose:
      '원하는 주제의 알고리즘 문제를 생성하고 웹에서 코드를 작성·실행한 뒤 테스트 케이스별 결과를 확인하는 흐름을 2~3일 동안 구현한 개인 프로젝트입니다.',
    technologies: ['React', 'JavaScript', 'Vite', 'React Router', 'Gemini API', 'JDoodle API'],
    featured: true,
    cover: {
      src: '/images/projects/create-problem-ai/home-cover.png',
      alt: '문제 풀기와 AI 문제 만들기 버튼이 있는 Create Problem AI 홈 화면 설계 시안',
    },
    screenshotsTitle: '화면 설계 시안',
    demoVideo: {
      src: '/videos/create-problem-ai-demo.mp4',
      poster: '/images/projects/create-problem-ai/demo-poster.jpg',
      description:
        '문제 목록, 코드 작성·실행, AI 문제 생성 화면을 보여주는 약 55초 분량의 실행 영상입니다.',
    },
    screenshotsNote:
      '초기 화면설계 자료입니다. 시안의 Judge0·서버 DB 등록과 달리 실제 구현은 JDoodle과 React의 메모리 상태를 사용합니다.',
    screenshots: [
      {
        src: '/images/projects/create-problem-ai/screens/problem-list.png',
        alt: '난이도와 유형 필터, 검색, 문제 목록을 배치한 설계 화면',
        caption: '문제 목록 · 검색과 필터',
      },
      {
        src: '/images/projects/create-problem-ai/screens/ai-create.png',
        alt: '문제 생성 요청을 입력하고 생성된 JSON과 참고 코드를 확인하는 설계 화면',
        caption: 'AI 문제 생성 · 프롬프트와 응답 미리보기',
      },
      {
        src: '/images/projects/create-problem-ai/screens/code-editor.png',
        alt: '문제 설명 옆에 언어 선택, 코드 편집기, 실행 결과를 배치한 설계 화면',
        caption: '코드 작성 · 문제 설명과 실행 콘솔',
      },
      {
        src: '/images/projects/create-problem-ai/screens/results.png',
        alt: '테스트 케이스마다 통과 상태, 실행 시간과 메모리를 보여주는 설계 화면',
        caption: '채점 결과 · 테스트 케이스별 결과',
      },
    ],
    features: [
      {
        title: 'AI 알고리즘 문제 생성',
        description:
          '사용자 입력을 Gemini API에 전달하고, 생성된 문제 설명·입출력 예시·참고 코드를 JSON으로 파싱해 화면에 표시합니다.',
      },
      {
        title: '생성 문제 목록과 코드 작성',
        description:
          '생성한 문제를 React Context의 메모리 상태에 추가하고 문제별 코드 작성 화면으로 이동합니다. 서버 DB에 영구 저장하는 기능은 포함되어 있지 않습니다.',
      },
      {
        title: '외부 코드 실행과 테스트 결과 표시',
        description:
          'JDoodle로 코드를 실행하고 테스트 입력별 출력을 기대 출력과 비교합니다. 결과·실행 시간·메모리 정보를 화면에 표시합니다. 자체 코드 실행 엔진을 구현한 프로젝트는 아닙니다.',
      },
      {
        title: '인증·마이페이지 화면 프로토타입',
        description:
          '로그인·회원가입 화면과 입력 검사, 예시 사용자 통계 화면을 구성했습니다. 실제 회원 인증과 사용자 통계 수집은 구현 범위에 포함되지 않습니다.',
      },
    ],
    architecture: {
      description:
        'React Router로 문제 생성·목록·편집기·결과 화면을 연결합니다. Gemini API는 브라우저에서 직접 호출하고, JDoodle 실행 요청은 Vite 개발 서버의 프록시가 전달합니다. 생성 문제는 React Context에서 관리하며, 별도 백엔드나 영구 저장 DB는 없습니다.',
      image: {
        src: '/images/projects/create-problem-ai-architecture.svg',
        alt: 'React가 Gemini에서 문제 JSON을 받아 Context에 등록합니다. 코드 실행 요청은 Vite 개발 프록시를 거쳐 JDoodle로 전달되며, React 결과 화면에서 테스트별 출력을 비교합니다.',
        caption: 'Create Problem AI 프로토타입의 화면 상태와 외부 API 호출 구조',
      },
      dataFlow: [
        '브라우저에서 문제 주제를 Gemini API에 보내고, 응답에서 문제 설명·테스트 케이스·참고 코드를 JSON으로 파싱합니다.',
        '사용자가 등록한 문제는 React Context의 메모리 상태에 추가됩니다. 페이지를 새로고침하면 생성 문제는 유지되지 않습니다.',
        '편집기에서 코드를 작성합니다. 실행 시 선택한 언어와 첫 번째 테스트 입력을 Vite 개발 프록시를 거쳐 JDoodle에 전달하고 콘솔에 결과를 표시합니다.',
        '제출 시 작성한 코드와 선택 언어, 문제 정보를 React Router의 이동 상태로 결과 화면에 전달합니다.',
        '결과 화면은 테스트 케이스마다 JDoodle 실행을 병렬 요청합니다. 실행 출력과 기대 출력의 앞뒤 공백을 제거해 비교하고, 통과 여부·실행 시간·메모리를 표시합니다.',
      ],
    },
    problems: [],
    links: [],
  },
  {
    slug: 'maple-ai',
    name: '메이플 AI 도우미',
    summary:
      '집 PC의 로컬 LLM과 RAG로 메이플스토리 질문에 답하고, Nexon Open API로 캐릭터를 조회하는 AI 서비스',
    period: '1일',
    type: '개인 프로젝트',
    role: '데이터 수집·검색·LLM 파이프라인·서빙·웹 화면 전체 구현',
    purpose:
      '메이플스토리 정보는 나무위키, 넥슨 공지, 캐릭터 조회 사이트에 흩어져 있습니다. 질문 하나로 게임 지식과 내 캐릭터 정보를 함께 답하는 도우미를 만들었습니다. 유료 API 대신 집 PC의 GPU(RTX 3070 Ti 8GB)에서 Qwen3 8B를 돌리고, VPS는 Tailscale로 요청만 전달합니다.',
    technologies: [
      'Python',
      'LangGraph',
      'Ollama',
      'Qwen3 8B',
      'Qdrant',
      'FastAPI',
      'React',
      'Tailscale',
      'Nginx',
      'Docker',
    ],
    featured: true,
    liveUrl: 'https://3geun.com/maple-ai/',
    cover: {
      src: '/images/projects/maple-ai/home.png',
      alt: '메이플 AI 도우미 첫 화면: 버섯 갓을 쓴 로고, 예시 질문 버튼, 질문 입력창',
      caption: '메이플 AI 도우미 첫 화면',
    },
    features: [
      {
        title: '근거가 있는 답변',
        description:
          '나무위키 25개 문서와 넥슨 공지 70건을 Markdown으로 수집해 3,344개 조각으로 인덱싱합니다. 답변에는 출처 번호와 링크가 붙고, 답변의 숫자가 자료에 그대로 있는지 코드로 확인합니다.',
      },
      {
        title: '캐릭터 + 지식 복합 질문',
        description:
          '"무기 한 번 더 누르면 터질 확률은?"처럼 캐릭터 정보와 게임 지식이 함께 필요한 질문에, 장비를 조회해 현재 22성임을 확인하고 확률표의 22성 행으로 답합니다.',
      },
      {
        title: '/명령어와 @닉네임',
        description:
          '/스타포스 22, /이벤트, /장비 닉네임, @닉네임처럼 자주 쓰는 기능은 LLM 없이 바로 카드로 보여줍니다. 입력창에서 / 를 누르면 명령어 자동완성이 열립니다.',
      },
      {
        title: '스트리밍과 오프라인 안내',
        description:
          '답변을 SSE로 한 글자씩 보내고, PC가 꺼져 있으면 VPS의 Nginx가 오프라인 안내를 돌려줍니다. 공지는 하루, 나무위키는 일주일마다 자동으로 다시 수집합니다.',
      },
    ],
    architecture: {
      description:
        '브라우저 요청은 VPS의 Nginx를 거쳐 Tailscale로 집 PC에 전달됩니다. PC의 LangGraph가 질문을 분류한 뒤 캐릭터 조회와 하이브리드 검색을 거쳐 Qwen3 8B로 답을 만듭니다. VPS는 PC의 8000번 포트에만 접근하도록 Tailscale ACL로 제한했습니다.',
      dataFlow: [
        '질문 분류: Qwen3 8B가 JSON으로 의도·캐릭터명·검색어를 정하고, 은어(스포·터지다)는 사전으로 공식 용어로 바꿉니다.',
        '캐릭터 조회: Nexon Open API 결과를 하루 캐시하고, 248KB 장비 응답을 3KB 요약으로 줄입니다.',
        '검색: bge-m3 벡터와 Kiwi 형태소 BM25를 Qdrant에서 RRF로 합칩니다 (25문항 hit@5 96%, MRR 0.930).',
        '답변: 작은 조각으로 찾고 섹션 전체를 넣으며, 표는 행마다 "키: 값"으로 펼칩니다 (17문항 답변 정확도 94%, 응답 중앙값 1.4초).',
      ],
    },
    problems: [
      {
        title: '8B 모델이 넓은 표에서 다른 행을 읽음',
        problem: '"22성 파괴 확률"을 물으면 26성 값(18.53%)을 답하거나 자료에 없다고 답했습니다.',
        cause:
          '표가 600자 조각으로 잘려 22성 행이 컨텍스트에 없었고, 들어가도 2줄 병합 머리글과 7개 열을 작은 모델이 잘못 읽었습니다.',
        solution:
          '검색에 걸린 조각의 섹션 전체를 다시 합쳐 넣고, 표를 "22성: 파괴 확률(일반) 16.85%" 같은 행 단위 문장으로 펼쳤습니다. 긴 표는 질문에 나온 단계의 행만 남깁니다.',
        result:
          '같은 질문에 정답(16.85%)을 내고, 캐릭터 장비의 현재 성과 조합한 질문도 맞혔습니다.',
      },
      {
        title: 'LLM 근거 검증이 맞는 답을 막음',
        problem:
          '답변을 같은 8B 모델로 검증했더니 맞는 답 3개를 근거 없음으로 막고, 조건을 잘못 읽은 답은 통과시켰습니다.',
        cause: '작은 모델은 캐릭터 정보와 표를 조합한 추론을 근거 없는 주장으로 판단했습니다.',
        solution:
          '답변에 나온 숫자가 자료에 그대로 있는지를 코드로 검사하고, LLM 검증은 선택 기능으로 돌렸습니다.',
        result: '답변 정확도가 82%에서 94%로, 응답 중앙값이 3.4초에서 1.4초로 좋아졌습니다.',
      },
      {
        title: '두 모델이 VRAM에 함께 올라가지 않음',
        problem: '생성 속도가 초당 9.8토큰으로, 기대치의 1/7 수준이었습니다.',
        cause:
          'Windows가 VRAM 1.2GB를 쓰고 있어 Qwen3 8B와 임베딩 모델 bge-m3가 질문마다 번갈아 올라갔습니다.',
        solution: 'Flash Attention과 q8_0 KV 캐시로 컨텍스트 메모리를 절반으로 줄였습니다.',
        result: '두 모델이 함께 GPU에 상주하고 생성 속도가 초당 67.8토큰이 됐습니다.',
      },
    ],
    retrospective: {
      learned: [
        '같은 PC에서 Qwen3-30B-A3B(RAM 오프로드)도 측정했지만, 임베딩 모델과 메모리를 다투며 응답이 26배 느려져 8B를 유지했습니다. 모델 크기보다 하드웨어 안에서의 배치가 더 중요했습니다.',
        '평가 질문 세트를 먼저 만들고 변경마다 다시 돌려, 체감이 아닌 수치로 개선 여부를 판단했습니다.',
      ],
      improvements: [
        '표의 "미적용" 같은 조건을 반대로 읽는 오답이 1건 남아 있어, 조건 문구를 따로 확인하는 검사가 필요합니다.',
        '평가 질문을 50개 이상으로 늘리고 실제 사용자 질문으로 보강할 계획입니다.',
      ],
    },
    links: [],
  },
  {
    slug: 'bing-wallpaper',
    name: 'Bing Wallpaper Downloader',
    summary: 'Bing 배경화면 링크에서 사진을 찾아 원하는 해상도로 저장하는 웹 도구',
    period: '1일',
    type: '개인 프로젝트',
    role: '웹 화면 및 다운로드 API 구현',
    purpose:
      'Bing에서 마음에 드는 사진을 찾고도 원하는 해상도로 저장하기가 불편했습니다. 사진 링크를 붙여 넣거나 오늘의 사진을 불러온 뒤, 화면 크기에 맞는 JPG로 저장할 수 있는 도구를 하루 만에 만들었습니다.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js 22', 'Docker', 'Nginx'],
    featured: true,
    cover: {
      src: '/images/projects/bing-wallpaper/screenshot.png',
      alt: 'Bing 사진 미리보기와 해상도 선택, JPG 다운로드 버튼이 있는 배경화면 다운로더 화면',
      caption: 'Bing 배경화면 미리보기와 JPG 다운로드',
    },
    demoUrl: 'https://3geun.com/bing-wallpaper/',
    features: [
      {
        title: '사진 찾기',
        description:
          'Bing 이미지 주소나 최근 사진 정보 링크로 배경화면을 찾고, 링크 없이 오늘의 사진도 불러올 수 있습니다.',
      },
      {
        title: '해상도 선택과 JPG 저장',
        description:
          '원본과 기본 해상도를 선택하거나 가로·세로를 직접 입력해 미리 본 뒤 JPG로 저장할 수 있습니다.',
      },
    ],
    architecture: {
      description:
        '브라우저가 Node.js API에 사진을 요청하면 서버가 Bing 사진 목록이나 이미지 응답을 가져옵니다. Bing에 가로·세로를 전달해 크기를 조정하고, 받은 JPG를 브라우저로 전송합니다.',
    },
    problems: [],
    links: [],
  },
]
