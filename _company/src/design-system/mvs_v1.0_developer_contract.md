# 🚨 SelBridge System Failure Design MVS v1.0 (Developer Contract)
## 개요: 목적 및 핵심 원칙 [근거: sessions/2026-05-07T05-40]
이 스펙은 사용자의 '인지 자원 고갈'과 '구조적 시스템 결함'을 시각화하는 모든 UI 요소를 위한 단일 진실 공급원(Single Source of Truth)입니다.

**핵심 원칙:**
1.  **전역 상태 기반 (Global State Driven):** 모든 컴포넌트는 외부의 `[SystemState]` 객체에 의해 트리거되어야 합니다.
2.  **시간 계약 필수 (Timing Contract):** 애니메이션 타이밍(ms)과 트랜지션 속도(easing curve)는 반드시 명시해야 합니다.
3.  **데이터 바인딩 의무화:** 모든 측정 지표는 외부 데이터 소스(`props`)와 1:1로 바인딩되어야 하며, 수동으로 하드코딩되는 값을 금지합니다.

---

## I. Core Components & Props Contract Definition

### 1. [System Alert Component] - (최우선 경고)
*   **기능:** 시스템의 치명적 결함 또는 임계점 초과를 즉시 알리는 모달/배너.
*   **Props Contract:**
    | Prop Name | Type | Description | Constraint / Value | [근거: sessions/2026-05-13T07:56] |
    | :--- | :--- | :--- | :--- | :--- |
    | `severityLevel` | Enum | 경고 등급 (Critical, Error, Warning) | **Critical:** `#FF0033`; **Error:** `#CC0033`; **Warning:** `#FF6600` | [근거: sessions/2026-05-17] |
    | `message` | String | 사용자에게 보여줄 경고 메시지. | Max 80 characters. 학술적 용어 사용 권장. | [추측] (Best Practice) |
    | `triggerTimeCode` | Number | Alert가 발동해야 하는 시간 코드(초). | 예: T+0:15s, T+0:45s 등 State Machine과 연동. | [근거: sessions/2026-05-07T05:40] |
    | `isModal` | Boolean | 전체 화면을 덮는지 여부. | True (모달) / False (배너) | [추측] |

### 2. [Context Drain Bar] - (지속적인 인지 자원 고갈 시각화)
*   **기능:** 사용자의 집중력/인지 자원이 시간이 지남에 따라 소실됨을 지속적으로 보여줍니다.
*   **Props Contract:**
    | Prop Name | Type | Description | Constraint / Value | [근거: sessions/2026-05-07T01:10] |
    | :--- | :--- | :--- | :--- | :--- |
    | `currentValue` | Float (0.0 to 1.0) | 현재 남은 인지 자원 비율. | **초기값:** 1.0. **최종 목표:** 임계점(0.2). | [근거: sessions/2026-05-07T01:10] |
    | `decayRate` | Float | 시간에 따른 감소 속도 (속도 조절 가능). | 기본값: 0.005 - 0.01 / second (느린 Decay Rate 필수) | [근거: sessions/2026-05-07T01:10] |
    | `threshold` | Float | 경고 발생 임계점. | **Critical:** 0.2 (20%) | [추측] |
    | `isFlickering` | Boolean | 임계치 근접 시 발생하는 미세한 깜빡임 여부. | True가 될 경우, 주변 그리드에 `#FF0033` 색상의 Flicker 효과 적용 필수. | [근거: sessions/2026-05-13T07:56] |

### 3. [PFC Index Meter] - (학술적 결함 지표)
*   **기능:** 사용자가 경험하는 구조적인 심리적 과부하를 계기판 형태로 시각화합니다.
*   **Props Contract:**
    | Prop Name | Type | Description | Constraint / Value | [근거: sessions/2026-05-07T05:40] |
    | :--- | :--- | :--- | :--- | :--- |
    | `currentPfcScore` | Float (0 to 100) | 현재의 PFC 지수 점수. | **초기값:** 75% 전후. 데이터 바인딩 필수. | [근거: sessions/2026-05-07T05:40] |
    | `isOverloaded` | Boolean | 시스템 과부하 상태 여부. | True 시, 경고등(Indicator)이 **네온 레드(`FF0033`)로 점멸**해야 함. | [근거: sessions/2026-05-13T07:56] |
    | `instabilityFactor` | Float (0 to 1) | 데이터의 불안정성을 나타내는 변수. | **필수 애니메이션:** 미세하고 불규칙하게 떨리는(Jittering/Oscillation) 효과를 적용해야 함. | [근거: sessions/2026-05-07T05:40] |

---
## II. Global Interaction & State Machine Flow (The Contract)

| State Transition | Trigger Condition | Action Sequence (Timing Critical) | Resulting Visual Output | [근거: sessions/2026-05-13T13:45] |
| :--- | :--- | :--- | :--- | :--- |
| **Stage 1: Baseline** | Initial Load (T=0s) | `[Context Drain Bar]` Decay Start. `[PFC Index Meter]` 초기화. | 전체 UI에 Subtle Grid Pattern 적용. 네온 블루/블랙 배경 유지. | [근거: sessions/2026-05-13T14:15] |
| **Stage 2: Warning** | $\text{Context Drain} < 0.4$ OR $\text{PFC Score} > 85$. | **Trigger:** Screen 전체에 강한 `[Glitch Stutter]` 필터 적용 (Duration: 300ms). | **[SYSTEM OVERLOAD Modal] 발동.** 메시지: "WARNING: Structural Defect Detected" (Blink Rate 8Hz, `#FF0033`). | [근거: sessions/2026-05-13T09:41] |
| **Stage 3: Critical Failure** | $\text{Context Drain} < 0.2$ OR $\text{PFC Score} > 95$. | **Transition:** `[SYSTEM OVERLOAD]` 모달이 사라지기 직전, 화면 전체가 일시적으로 블랙아웃(Blackout) 처리 (Duration: 100ms). | **[SERVICE REQUIRED] Modal 발동.** 메시지: "SYSTEM FAILURE. 구조적 결함 해결을 위한 전문가의 도움이 필요합니다." 배경: 깊고 붉은 블랙. 중앙 타이포그래피: 'SYSTEM FAILURE' (Neon Red, 점멸 필수). | [근거: sessions/2026-05-13T07:56] |

---
**개발 참고 사항:** 모든 컴포넌트의 애니메이션 속성은 `cubic-bezier(0.4, 0, 0.2, 1)`을 기본으로 사용하되, 경고/결함 시퀀스에서는 **비선형적이고 갑작스러운 변화 (Non-linear/Abrupt)**를 적용하여 위기감을 극대화해야 합니다.