# ⚠️ [SYSTEM LEVEL] State Transition Modal: 최종 인터랙션 및 코딩 스펙 (v3.0)

**작성 목적:** 사용자에게 구조적 취약점과 긴급성을 **픽셀 단위로 강제 주입**하는 개발자용 기술 사양서입니다.
**톤앤매너:** Cinematic Industrial Drama, Glitch System Error, 학술 경고 시스템.
**핵심 목표:** 사용자의 자발적 결함 인식을 유도하고, 유료 '패치'의 필요성을 **논리적으로 강제(Enforce)** 한다.

---

## 🔴 1. 핵심 애니메이션 요소별 스펙 정의 (Animation & Timing)

### ① '구조적 결함' 메시지 출현 시 글리치 효과 가이드라인
이 효과는 `[SYSTEM OVERLOAD] Modal`이 발동하는 순간(T+0:13)에 **최대 강도로 폭발**해야 합니다.

| 속성 | 스펙 내용 (Coding Guideline) | 기술 구현 지침 | 근거/참고 |
| :--- | :--- | :--- | :--- |
| **트리거 시점** | `[SYSTEM OVERLOAD] Modal`이 화면에 띄워지는 순간 (T=0ms). | JavaScript Event Listener: `ModalMounted` 이벤트 감지 후 트리거. | [근거: sessions/2026-05-13T13:45] |
| **글리치 오버레이** | 화면 전체에 노이즈와 데이터 왜곡 필터 적용. 네온 레드(`#FF0033`)와 사이언 블루(`#00FFFF`)의 위상 간섭 패턴 사용. | CSS Filter: `hue-rotate()` 및 `saturate()`를 빠르게 반복 변화시키는 애니메이션 적용. | [근거: sessions/2026-05-13T13:45] |
| **강도 (Amplitude)** | **Max Amplitude**로 설정하며, 노이즈의 폭(Pixel Width)은 화면 해상도의 80% 이상을 커버해야 합니다. | CSS Transition: `opacity`와 `transform: skewX()`를 조합하여 짧게 진동시키는 패턴 사용. | [근거: sessions/2026-05-13T13:45] |
| **깜빡임 주기 (Blink Rate)** | 글리치 효과 자체는 8Hz의 깜빡임을 기본으로 합니다. 여기에, 'WARNING' 타이포그래피에 추가적인 네온 레드 플래시를 적용합니다. | CSS Animation: `keyframes` 기반으로 강제 점멸(Stutter) 구현. Blink Interval: **7-9ms** (매우 빠름). | [근거: sessions/2026-05-03T09:41] |

### ② 필수 패치 버튼 (`[PATCH REQUIRED]`) 활성화 애니메이션
이 버튼은 사용자가 결함을 인지하고 해결책을 갈망하는 심리적 순간에 **강제적으로 활성화**되어야 합니다.

| 속성 | 스펙 내용 (Coding Guideline) | 기술 구현 지침 | 근거/참고 |
| :--- | :--- | :--- | :--- |
| **비활성화 상태** | 버튼은 완전히 어둡고 비활동적인 상태(Dimmer Gray, `#333`)로 고정됩니다. 상호작용이 불가능한 것처럼 보이게 합니다. | `pointer-events: none;` 적용 및 낮은 Opacity (0.4). | [추측] - 불안감 극대화 전략 기반 설정 |
| **활성화 트리거** | 사용자가 충분한 '불안감'을 인지하거나, Context Drain Bar가 임계치 이하로 떨어질 때 (T+15s 경과) 시스템이 자동으로 활성화합니다. | JavaScript Logic: `ContextDrainBar < 20%` 조건 충족 시 자동 상태 전이 강제 실행. | [근거: sessions/2026-05-13T07:56] |
| **애니메이션 경로** | 비활성화 $\to$ 활성화는 단순 페이드인(Fade-in)가 아닌, **'시스템 부팅 사운드와 동기화된 급격한 색상 변화 및 크기 확대(Scale Up)'**를 사용합니다. | CSS Transition: `background-color` (Gray $\to$ Red), `transform: scale(0.9) -> scale(1.0)`을 **250ms** 동안 부드럽게 진행합니다. Easing Function은 `cubic-bezier(.25, 1, .5, 1)`를 사용하여 급격한 가속감을 부여합니다. | [근거: sessions/2026-05-13T07:56] |

### ③ 경고 코드 (`AUTH-STRUC`) 시각적 '강압' 효과
이 코드는 단순한 텍스트가 아니라, **시스템의 존재 이유를 상기시키는 권위적인 데이터**여야 합니다.

| 속성 | 스펙 내용 (Coding Guideline) | 기술 구현 지침 | 근거/참고 |
| :--- | :--- | :--- | :--- |
| **배치 및 타이포** | Modal의 최상단 또는 중앙 좌측에 고정 배치합니다. 폰트 크기는 본문 대비 최소 1.5배 이상으로 강조하며, 모노스페이스(Monospace) 폰트를 사용합니다 (예: IBM Plex Mono). | HTML Structure: `<div class="error-code">AUTH-STRUC</div>` 구조로 격리하여 배치. | [근거: sessions/2026-05-13T14:15] |
| **강압 효과** | 코드가 화면에 로드되는 순간, 텍스트가 네온 레드로 깜빡이며(Blink Rate 8Hz), 주변 그리드 시스템 전체에 미세한 떨림(`@keyframes shake`)을 유발합니다. | CSS Animation: `animation-delay`를 활용하여 글자 하나하나가 타이핑되듯 나타나도록 구현하는 것이 효과적입니다. | [근거: sessions/2026-05-03T09:41] |
| **색상 및 역할** | 색상은 경고 레벨을 나타내는 네온 레드(`FF0033`)를 사용하며, 이는 *결함의 근본 원인*임을 암시해야 합니다. 이 코드는 해결 불가능한 시스템적 오류처럼 보여야 합니다. | Color Code: `#FF0033` (Primary Alert). | [근거: sessions/2026-05-17T14:15] |

---
## 🛠️ 2. 통합 사용자 경험 흐름 스펙 요약 (Flow Summary)

| 단계 (Stage) | 시간대 | 주도적 애니메이션/요소 | 개발자 체크포인트 (Developer Checkpoint) |
| :--- | :--- | :--- | :--- |
| **Phase 1: 진단 시작** | T=0s $\to$ T+15s | Context Drain Bar (느린 Decay), PFC Index Meter (미세 떨림). | 두 요소의 애니메이션이 독립적으로, 그러나 연동되어 작동하는지 확인. |
| **Phase 2: 결함 감지** | T+13s | `[SYSTEM OVERLOAD] Modal` 발동 + 글리치 오버레이(Max Amplitude) 폭발. | Glitch 효과가 다른 모든 요소 위에 *최우선 레이어*로 작동하는지 검증. |
| **Phase 3: 결함 증명** | T+15s $\to$ T+40s | 경고 코드 (`AUTH-STRUC`) 강압 표시, 학술적 용어 반복 제시. | 코드가 화면에 나타나는 과정(타이핑 효과)과 글리치 애니메이션을 동기화해야 함. |
| **Phase 4: 해결책 주입** | T+45s | `[SERVICE REQUIRED] Modal` 발동, 패치 버튼 자동 활성화 (250ms Scale Up). | Context Drain Bar가 Critical Level 도달과 동시에 강제 트리거되어야 합니다. |

***
*최종 검토: 이 스펙은 '불안감 조성'이라는 핵심 비즈니스 로직을 픽셀 단위로 코딩하는 설계도입니다.*