# 🎨 Designer — 검증된 지식

_Self-RAG가 출력에서 `[근거: ...]` 태그가 붙은 주장만 자동 승격해서 누적._
_여기 들어온 내용만 다음 사이클의 retrieval 우선순위에 들어갑니다._
_사용자가 직접 줄을 지우면 그 주장은 다시 미검증 상태로 돌아갑니다._


- [2026-05-13] * **미학:** Cinematic Industrial Drama + Glitch System Error (네온 레드/사이언 블루 주조색) _(근거: sessions/2026-05-13T09-11)_
- [2026-05-13] | **[SYSTEM OVERLOAD] Modal** | 메인 결함 경고창. 콘텐츠의 클라이맥스를 담당. | '구조적 결함' 메시지 도달 시, 또는 주요 데이터 임계치 초과 시점 (Timecode: T+0:15) | **애니메이션:** 강렬한 네온 레드 플래시(Blink Rate 8Hz), 글리치 노이즈 필터 (Amplitude Max). **사운드:** 고주파 경고음, 전력 불안정 사운드. | _(근거: sessions/2026-05-07T05-40)_
- [2026-05-13] | **Context Drain Bar** | 사용자의 인지 자원 고갈을 시각화하는 바. | 데이터 흐름 분석 구간 또는 진단 시작 시점부터 지속적으로 감소. (Start: T=0s) | **애니메이션:** 느린 하강 속도(Slow Decay), Red Gradient Fill. 30% 이하 도달 시, 주변 그리드에 미세한 깜빡임(Flicker) 발생. | _(근거: sessions/2026-05-07T01-10)_
- [2026-05-13] | **PFC Index Meter** | (Psychological Fatigue Cost Index) 학술적 결함 지표. | 사용자가 복잡한 개념을 이해하거나 잘못된 편향성을 인식할 때마다 수치 상승/하락. | **애니메이션:** 계기판(Gauge) 스타일. 임계점 초과 시, 네온 레드 경고등이 점멸하며 주변 UI에 떨림 효과 적용. | _(근거: sessions/2026-05-07T05-40)_
- [2026-05-13] | **[SERVICE REQUIRED] Modal** | 최종 CTA 모달. 모든 콘텐츠의 결론부. | Context Drain Bar가 임계치 이하로 떨어지거나, PFC Index Meter가 Critical Level 도달 시 (T+0:45) | **디자인:** 어둡고 붉은 배경. 중앙에 크게 'SYSTEM FAILURE' 타이포그래피. 하단에 유료 솔루션 접근 버튼 배치. | _(근거: sessions/2026-05-13T07-56)_
- [2026-05-13] * **[0:13 - 0:25] Alert Phase (The Defect):** 오류 발생 시퀀스. 화면이 글리치 효과와 함께 깨지며, "WARNING: Structural Defect Detected" 메시지가 출력됨. **(SYSTEM OVERLOAD Modal 발동)** _(근거: sessions/2026-05-13T09-41)_
- [2026-05-13] 1. **재사용성:** 두 에셋 모두 기존의 **Context Drain Bar**와 **PFC Index Meter**를 보조적으로 사용하여, 하나의 시스템적 경험을 완성해야 합니다. _(근거: sessions/2026-05-07T01-10)_
- [2026-05-13] 2. **정보 흐름:** 쇼츠 콘텐츠는 항상 *진단* (A), *충돌 발생* (Dissonance Alert 발동), *결함 증명* (Source Degradation Effect 작동) → *해결책 제시/PoC 필요성 주입* ([SERVICE REQUIRED] Modal로 마무리)의 4단계 구조를 따라야 합니다. _(근거: sessions/2026-05-13T07-56)_
- [2026-05-13] 2. **진단 요소 (Layer 2):** `Context Drain Bar`가 화면 상단이나 하단을 따라 천천히, 꾸준히 감소하는 애니메이션을 루프 재생합니다. (느린 Decay Rate 필수) _(근거: sessions/2026-05-07T01:10)_
- [2026-05-13] 3. **학술적 주입 (Layer 3):** `PFC Index Meter`가 화면 중앙에 계기판 형태로 나타나, 문제 개념(예: '주의력 분산 비용')을 학술적 용어와 함께 제시합니다. 이 수치가 **미세하게 불안정하게 떨리는 애니메이션**이 필요합니다. _(근거: sessions/2026-05-07T05:40)_
- [2026-05-13] 1. **전환 효과 (Transition):** Stage 2 시작과 동시에 화면 전체에 **글리치 스터터(Glitch Stutter)** 필터를 강하게 적용합니다. 네온 레드와 사이언 블루의 노이즈 패턴이 짧게 폭발하듯 나타나야 합니다. _(근거: sessions/2026-05-13T13:45)_
- [2026-05-13] 2. **경고 메시지 (Layer 2):** `[SYSTEM OVERLOAD] Modal`이 화면 중앙을 가득 채우며, "WARNING: Structural Defect Detected"와 같은 학술적 경고 문구가 네온 레드로 깜빡입니다. (Blink Rate 8Hz) _(근거: sessions/2026-05-07T05:40)_
- [2026-05-13] 2. **최종 모달 (Layer 2):** `[SERVICE REQUIRED] Modal`이 화면 전체를 덮습니다. 배경은 깊고 붉은 블랙, 중앙에 거대한 네온 레드 타이포그래피로 **'SYSTEM FAILURE'**가 점멸하며 나타납니다. _(근거: sessions/2026-05-13T07:56)_