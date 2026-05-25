# State Transition Modal: 핵심 오류 변수 정의 (Developer Spec v1.0)

## 🎯 목적
사용자의 인지적 불안감(Cognitive Anxiety)을 극대화하고, 시스템의 구조적 취약성 해결을 명분으로 유료 서비스를 판매한다. 모든 에러 메시지는 개인의 노력 부족이 아닌, 외부/내부 '시스템적 결함'에 초점을 맞춘다.

## 📚 핵심 오류 변수 목록
### 1. AUTH-STRUC (Authentication Structure Integrity Breach)
*   **정의:** 사용자의 접근 권한이나 세션 관리에 구조적인 문제가 발생했음을 알리는 코드.
*   **데이터 타입:** Code(String) / Level(Enum: CRITICAL, HIGH)
*   **값 범위 예시:** A104X\_KEY\_EXPIRY (Critical), B203Y\_SESSION\_MISMATCH (High)

### 2. COMPLIANCE-RISK (Regulatory Compliance Vulnerability)
*   **정의:** 사용자가 다루는 데이터가 특정 법규나 산업 표준을 위반할 위험에 처했음을 알리는 코드. 가장 강력한 구매 트리거로 활용한다.
*   **데이터 타입:** RiskType(Enum) / Severity(Int: 1-5)
*   **값 범위 예시:** GDPR\_LACK\_OF\_CONSENT (Critical, Lvl 5), CCPA\_DATA\_RESIDENCY\_BREACH (High, Lvl 4)

### 3. DATA-CORRUPT (Information Schema Degradation Risk)
*   **정의:** 사용자가 활용하는 데이터 소스의 구조적 무결성이나 신뢰도가 떨어졌음을 경고.
*   **데이터 타입:** SourceType(Enum) / IntegrityStatus(String)
*   **값 범위 예시:** EXTERNAL\_FEED\_SCHEMA (Critical), LOCAL\_CACHE\_MISMATCH (High)

## 🗣️ 학술적 근거 문구 가이드라인 (Tone & Manner)
모든 메시지는 '문제 해결'을 전제로 하며, 다음과 같은 용어를 의무적으로 포함해야 한다.
*   **필수 키워드:** 무결성(Integrity), 구조적 결함(Structural Deficiency), 스키마(Schema), 규제 준수(Compliance), 엔트로피(Entropy).
*   **톤앤매너:** 권위적, 학술적, 기술적 (Technical & Academic).

***