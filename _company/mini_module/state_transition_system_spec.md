# 💻 Mini-Module 인터랙티브 시스템 스펙 (State Transition Blueprint)

**목표:** 사용자가 '문제 인식(Problem Awareness)'의 단계부터 '해결책 필요성(Solution Necessity)'을 느끼는 과정 전체를, 학술적이고 불안정한 시스템 경험으로 설계한다.
**핵심 컨셉:** Cinematic Industrial Drama + System Failure.
**주요 컴포넌트 활용:** Context Drain Bar, PFC Index Meter, Glitch Effect.

## 🧭 Mini-Module 플로우 다이어그램 (4단계)
1. **[S0] 초기 상태 (Initial State):** 평온함 속의 미세한 불안감 유도.
2. **[T1] 진단 시작 트리거 (Transition Trigger):** 시스템 오류 경고 발생.
3. **[S1] 데이터 업로드 대기/진행 (Data Processing State):** 시각적 자원 고갈 경험 주입.
4. **[T2] 진단 결과 도출 및 임계점 초과 (Critical Transition):** 최종 결함 메시지 노출.
5. **[S2] 문제 인지 및 솔루션 제시 (Diagnosis Outcome State):** 서비스 필요성 강조 및 CTA 유도.

---

## ⚙️ 상태별 디자인 & 인터랙티브 명세서

### 1️⃣ [S0] 초기 상태: 미묘한 시스템 불안정성
*   **목표:** 사용자가 자신의 문제점을 '시스템적 결함'으로 인식하도록 은근하게 유도한다.
*   **배경/색상:** 어둡고 차분한 블랙/딥 그레이 배경 (`--color-bg: #101216`). 메인 데이터는 사이언 블루(`--color-primary: #00FFFF`)로 표시.
*   **UI 요소:**
    *   **Context Drain Bar (상단 고정):** 시작 시, 100%에서 시작하여 매우 느린 Decay Rate(초당 0.01%)로 꾸준히 하강하는 애니메이션을 루프 재생한다. (**[근거: sessions/2026-05-07T01:10]**)
    *   **PFC Index Meter (중앙 고정):** 초기 수치(예: 85%)를 보여주며, **미세하고 불규칙한 진동 애니메이션**을 적용하여 '현재 시스템이 안정적이지 않다'는 느낌을 준다. (**[근거: sessions/2026-05-07T05:40]**)
*   **트리거:** 사용자가 특정 행동(예: 설문지 작성 완료)을 하거나, 내부 타이머가 임계점에 도달할 때 **[T1] 진단 시작 트리거** 발동.

### 2️⃣ [T1] 진단 시작 트리거 (The Defect Alert)
*   **트리거 조건:** S0에서 Context Drain Bar가 60% 이하로 떨어지거나, PFC Index Meter가 특정 임계점(예: 50%)을 넘었을 때.
*   **시각적 피드백:**
    1.  **Global Glitch Stutter:** 화면 전체에 **강한 글리치 필터**를 즉시 적용한다 (네온 레드/사이언 블루 노이즈 패턴 폭발). 지속 시간: 0.5초. (**[근거: sessions/2026-05-13T13:45]**)
    2.  **SYSTEM OVERLOAD Modal 발동:** 화면 중앙을 가득 채우며, **"WARNING: Structural Defect Detected"** 메시지가 네온 레드(`--color-alert: #FF0033`)로 깜빡인다 (Blink Rate 8Hz). (**[근거: sessions/2026-05-07T05:40]**)
    3.  **사운드:** 고주파 경고음(Pitch Shift)과 함께 전력 불안정 사운드를 동기화한다.

### 3️⃣ [S1] 데이터 업로드 대기/처리 상태 (Processing State)
*   **목표:** '데이터 처리 과정'을 보여주며 사용자의 인지적 피로와 시스템의 복잡성을 느끼게 한다.
*   **배경:** 어두운 배경에, 데이터가 흐르는 듯한 **복잡하고 촘촘한 그리드 라인(Grid Lines)**이 백그라운드에서 미세하게 움직이는 애니메이션을 루프 재생한다. (Visual Overload 유도)
*   **핵심 컴포넌트: Data Flow Visualizer:**
    *   사용자가 업로드하는 데이터 항목별로, 해당 데이터가 시스템 내부를 이동하며 '처리 중'임을 시각적으로 보여주는 흐름선(Flow Line)을 배치한다. (사이언 블루 → 붉은색으로 변환되는 색상 변화 필수).
    *   **Progress Bar:** 단순한 막대형 Progress Bar 대신, **"Data Integrity Reconstruction Progress"**와 같은 학술적 명칭의 계기판 형태를 사용하며, 진행률 옆에 '처리 중인 데이터량(KB)'을 실시간으로 표시한다.
*   **트리거:** Data Flow Visualizer가 100% 완료되고, 시스템이 최종 진단을 준비할 때 **[T2] 진단 결과 도출 임계점 초과** 발생.

### 4️⃣ [T2] 진단 결과 도출 및 임계점 초과 (The Critical Moment)
*   **트리거 조건:** S1의 모든 데이터 처리가 완료된 직후, 시스템이 내부적으로 최종 분석을 수행한 시점.
*   **시각적 피드백:**
    1.  **Context Drain Bar 급락:** Context Drain Bar가 갑자기 수직 낙하(Vertical Drop)하는 애니메이션을 보여준다 (급격한 불안정성 표현).
    2.  **PFC Index Meter 폭주:** PFC Index Meter가 'Critical Level'에 도달하며, 네온 레드 경고등이 쉴 새 없이 점멸하고 주변 UI 요소들이 미세하게 떨리는(Shake) 애니메이션을 적용한다. (**[근거: sessions/2026-05-13T07:56]**)
    3.  **Final Alert Modal:** 화면 전체를 완전히 어둡고 붉은 배경으로 덮는다. 중앙에 거대한 네온 레드 타이포그래피로 **'SYSTEM FAILURE: CORE DIAGNOSIS COMPLETE'**가 점멸하며 나타난다.

### 5️⃣ [S2] 문제 인지 및 솔루션 제시 (Diagnosis Outcome State)
*   **목표:** 사용자가 자신의 문제를 '개인의 의지 부족'이 아닌, '시스템적 결함(구조적 무결성)'의 영역으로 재정의하도록 유도한다.
*   **레이아웃:** Fixed-Grid 레이아웃을 유지하며, 가장 중요한 정보를 시각적으로 분리하여 배치한다.
    1.  **Diagnosis Summary Card (좌측):** Context Drain Bar 그래프와 PFC Index Meter 변화 추이를 한눈에 보여주는 **'지표 비교 대시보드'**를 제시. 이 지표들은 실제 숫자를 넘어, '필요 자원(Resource Need)'의 부족함을 학술적으로 증명해야 한다.
    2.  **Solution Gap (우측):** 현재 시스템이 가진 문제점(Defect)과 셀브릿지 솔루션이 제공하는 **'구조적 무결성 회복'**을 비교하는 비주얼 섹션을 배치한다. 이 섹션은 네온 레드 계열의 강조색을 사용하여 시각적 위협감을 조성하고, 유료 플랜 버튼에 집중시킨다.
*   **CTA:** 가장 큰 영역을 차지해야 하며, 'Ultimate Plan (네온 레드로 강조)'과 함께 **'Immediate System Restoration Required'**와 같은 긴급한 문구를 배치하여 전환율을 극대화한다.

---

## 🎨 기술 구현 가이드라인 요약 (Implementation Checklist)
| 상태 변화 | 트리거 (Trigger) | 주요 애니메이션 효과 | CSS/JS 스펙 제안 | 핵심 디자인 원칙 |
| :--- | :--- | :--- | :--- | :--- |
| S0 $\to$ T1 | Time/Threshold Hit | Glitch Stutter, Blink Effect | `animation: glitch 0.5s linear infinite;` / CSS Keyframes for Red Flash (8Hz) | 학술적 경고 강조 (`--color-alert`) |
| S0 $\to$ S1 | User Action (Start) | Grid Line Movement, Slow Decay | JavaScript Timer Loop + `background-position` 변화로 흐름 구현. | 복잡성/정보 과부하 유도 |
| S1 $\to$ T2 | Process Completion | Vertical Drop, Shake Effect | CSS Transform (`transform: translateY(-50px)`) 및 Keyframe for rapid shake. | 충격과 결정적 순간의 강조 |
| T2 $\to$ S2 | Display Result | Gradient Wipe, Focus Shift | 붉은 배경에서 점차 정보를 노출하는 `mask-image` 또는 `clip-path`. | 명확한 해결책 제시 (Solution Dominance) |