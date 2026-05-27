/**
 * @module pelsService
 * @description PELS(Potential Loss of Structural Integrity Score) 계산 및 사용자 상태 전이를 관리하는 핵심 비즈니스 로직 엔진.
 * 이 서비스는 시스템의 신뢰도를 판매하는 가장 중요한 인터페이스입니다.
 */

const MAX_PELS = 100;
const CRITICAL_DEFECT_THRESHOLD = 30; // PELS가 30을 넘으면 구조적 위험 감지
const FORCED_MODULE_REQUIRED_CODE = "AUTH-STRUC"; // 강제 판매 모듈 코드

/**
 * 현재 사용자 상태를 기반으로 PELS 점수를 업데이트합니다.
 * @param {Object} userData - 사용자의 기본 정보 (예: email, jobSector)
 * @param {number} currentTimeMs - API 호출 시점의 시간 (밀리초).
 * @returns {{newPelsScore: number, structuralAlert: string|null}} 업데이트된 PELS 점수와 경고 메시지.
 */
export function calculateAndAdvancePELS(userData, currentTimeMs) {
    let currentPels = userData.pels || 0;

    // 1. 시간 기반 PELS 증가 로직 (비활성 감지)
    const lastActivityTime = userData.lastActivityAt ? new Date(userData.lastActivityAt).getTime() : currentTimeMs;
    const inactivityDurationMinutes = Math.floor((currentTimeMs - lastActivityTime) / (1000 * 60));

    if (inactivityDurationMinutes > 30 && currentPels < MAX_PELS) {
        // 비활성 상태일 경우, PELS를 증가시킵니다.
        const increaseRate = Math.min(5, Math.floor(inactivityDurationMinutes / 10)); // 최소 5점씩 증가
        currentPels = Math.min(MAX_PELS, currentPels + increaseRate);
    }

    // 2. PELS 점검 및 구조적 경고 메시지 생성
    let structuralAlert = null;
    if (currentPels >= CRITICAL_DEFECT_THRESHOLD) {
        structuralAlert = `[CRITICAL ALERT]: Structural Integrity Loss Detected! PELS Score: ${Math.round(currentPels)}/${MAX_PELS}. Immediate intervention is required.`;
    }

    // 3. 상태 전이 결정 (강제 구매 유도)
    let forcedActionCode = null;
    if (structuralAlert && userData.hasNotPurchasedModule()) {
        // PELS가 임계치에 도달했고, 아직 모듈을 구매하지 않았다면 강제 개입 코드를 할당합니다.
        forcedActionCode = FORCED_MODULE_REQUIRED_CODE;
    }

    return {
        newPelsScore: Math.round(currentPels),
        structuralAlert: structuralAlert,
        requiredForcedAction: forcedActionCode
    };
}

/**
 * 가상의 사용자 데이터 모델 (실제 DB에서 가져온다고 가정)
 */
export function createMockUserData(email, pelInitial = 0, lastActivityOffsetHours = -1): Object {
    const now = Date.now();
    return {
        email: email,
        pels: pelInitial, // 초기 PELS 점수 (DB에서 가져옴)
        lastActivityAt: lastActivityOffsetHours * 60 * 60 * 1000 + now, // 시간 오프셋 적용 가능하도록 설정
        hasPurchasedModule: () => false, // Mock method
        hasNotPurchasedModule: () => true // Mock method
    };
}

export { calculateAndAdvancePELS };