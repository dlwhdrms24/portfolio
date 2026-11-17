// "어떻게 동작하나요" 패널: 구조와 평가 결과. 수치는 maple-ai 저장소 README 의 측정값 (2026-11-17).

const PIPELINE = [
  ['질문 분류', 'Qwen3 8B 가 JSON 으로 의도·캐릭터명·검색어를 정함. 은어는 사전으로 공식 용어로 바꿈.'],
  ['캐릭터 조회', 'Nexon Open API, 하루 캐시. 장비 응답 248KB 를 3KB 요약으로.'],
  ['하이브리드 검색', 'bge-m3 벡터 + Kiwi 형태소 BM25 를 Qdrant 에서 RRF 로 합침.'],
  ['답변', '검색은 작은 조각으로, 답변에는 섹션 전체를. 표는 행마다 "키: 값" 으로 펼쳐 넣음.'],
  ['수치 검사', '답변의 숫자가 자료에 그대로 있는지 코드로 확인. 없으면 모른다고 답함.'],
]

const EVALS = [
  ['검색 hit@5 (25문항)', '96%', 'MRR 0.930'],
  ['라우팅 (17문항)', '100%', '지식·캐릭터·복합·잡담'],
  ['답변 정확도 (17문항)', '94%', '응답 중앙값 1.4초'],
]

export function About() {
  return (
    <details className="about">
      <summary>어떻게 동작하나요?</summary>
      <div className="about-body">
        <p>
          질문은 이 서버(VPS)를 거쳐 Tailscale 로 개인 PC 에 전달되고, PC 의 GPU(RTX 3070 Ti 8GB)에서 로컬 LLM 이
          답을 만듭니다. 그래서 PC 가 꺼져 있으면 쓸 수 없습니다.
        </p>
        <ol className="pipeline">
          {PIPELINE.map(([t, d]) => (
            <li key={t}>
              <b>{t}</b>
              <span>{d}</span>
            </li>
          ))}
        </ol>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>평가</th>
                <th>결과</th>
                <th>비고</th>
              </tr>
            </thead>
            <tbody>
              {EVALS.map((r) => (
                <tr key={r[0]}>
                  {r.map((c) => (
                    <td key={c}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="about-note">
          자료: 나무위키 선별 문서 25개 (CC BY-NC-SA 2.0 KR), 넥슨 공지·업데이트·이벤트·캐시샵 (Nexon Open API).
          나무위키는 사용자가 편집하는 위키라 최신 패치와 다를 수 있습니다. 게임 내 정보를 함께 확인해 주세요.
        </p>
      </div>
    </details>
  )
}
