/**
 * @fileoverview VSS (Validation & Safety System)의 핵심 진단 상태 전이 로직 모킹 서비스.
 * 모든 트랜잭션은 시스템적 결함 해결 경험을 기술적으로 강제하는 것이 목표입니다.
 */

// ========================================
// 1. STATE MACHINE DEFINITION
// ========================================

/**
 * 사용자 계정의 현재 상태를 정의합니다. (State Machine)
 * S0: Initial State - 진단 전.
 * S1: Diagnosis Completed - 무료 진단을 완료했으나, 결함이 경미하여 패치 불필요.
 * S2: PRO Kit Required - 구조적 취약점(Structural Vulnerability) 감지. PRO Kit 필수 구매 상태.
 * S3: Enterprise Locked - 엔터프라이즈급 시스템 교체 필요 (최상위 유료 단계).
 */
export enum UserState {
    S0_INITIAL = "S0", // 초기 진단 전 상태
    S1_SAFE = "S1",    // 안전한 상태 (패치 불필요)
    S2_VULNERABLE = "S2",// 취약 상태 (PRO Kit 필요)
    S3_CRITICAL_LOCK = "S3" // 치명적 결함, 전면 시스템 교체 권고
}

/**
 * 진단 결과 구조체.
 */
export interface ScanResults {
    scanId: string;
    defectCode: string; // 예: AUTH-STRUC, DATA-MISMATCH 등
    severityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    description: string;
}

/**
 * 진단 요청 본문 (Request Body Definition)
 */
export interface DiagnosisRequest {
    email: string; // 필수 필드
    jobSector: string; // 운영 부문 정보 (Operational Sector)
    scanResults: ScanResults[]; // 핵심 데이터 배열
    timestamp: string;
}

/**
 * 진단 응답 본문 (Response Body Definition)
 */
export interface DiagnosisResponse {
    success: boolean;
    message: string;
    userState: UserState;      // 업데이트된 최종 사용자 상태
    requiredAction: 'NONE' | 'PRO_KIT_PURCHASE' | 'ENTERPRISE_CONSULT'; // 필수 행동 유도
    payload: {
        statusDetails?: string;
        warningCode?: string;
        ctaMessage?: string;
    };
}

// ========================================
// 2. CORE LOGIC IMPLEMENTATION (MOCK API)
// ========================================

/**
 * 진단 요청을 처리하고 사용자 상태 전이를 강제하는 모킹 서비스입니다.
 * @param request - 클라이언트가 제출한 진단 요청 데이터.
 * @returns State Transition에 따른 구조화된 응답 객체.
 */
export const diagnoseSystem = (request: DiagnosisRequest): DiagnosisResponse => {
    console.log(`[VSS DIAGNOSIS START] Processing diagnosis for ${request.email} in sector ${request.jobSector}`);

    // 1. Input Validation & Initial State Check
    if (!request.email || !request.scanResults?.length) {
        return {
            success: false,
            message: "Input validation failed. Please provide required log data.",
            userState: UserState.S0_INITIAL,
            requiredAction: 'NONE',
            payload: {}
        };
    }

    // 2. Structural Vulnerability Assessment (핵심 비즈니스 로직)
    let hasCriticalDefect = false;
    const highSeverityCount = request.scanResults.filter(r => r.severityLevel === 'HIGH').length;

    if (highSeverityCount >= 1 || request.scanResults.some(r => r.defectCode.includes('AUTH-STRUC'))) {
        hasCriticalDefect = true;
    }

    let newState: UserState;
    let requiredAction: 'NONE' | 'PRO_KIT_PURCHASE' | 'ENTERPRISE_CONSULT';
    let message: string;

    // 3. State Transition Logic (가장 중요한 부분)
    if (hasCriticalDefect) {
        // Critical Defect 감지 -> PRO Kit 구매 유도 (S2)
        newState = UserState.S2_VULNERABLE;
        requiredAction = 'PRO_KIT_PURCHASE';
        message = `🚨 CRITICAL ALERT: ${request.scanResults[0].defectCode} 구조적 결함이 감지되었습니다. 즉시 패치가 필요합니다.`; // 경고 메시지 강제 출력 [근거: 지난 의사결정 로그]

    } else if (highSeverityCount > 0) {
        // Medium Defect 감지 -> 모니터링/추가 데이터 요구 (S1 유지 또는 약간 상승)
        newState = UserState.S1_SAFE;
        requiredAction = 'NONE'; // 일단은 무료 진단으로 끝내고, 다음 단계에서 추가 데이터를 요청할 수 있음.
        message = `⚠️ WARNING: 경미한 취약점 ${request.scanResults[0].defectCode}가 감지되었습니다. 현재는 시스템 운영에 지장이 없으나 정기 모니터링이 필요합니다.`;

    } else {
        // Clean Slate -> 안전 (S1)
        newState = UserState.S1_SAFE;
        requiredAction = 'NONE';
        message = "✅ System Check Passed. 현재 시스템은 구조적 결함 없이 안정적으로 운영되고 있습니다.";
    }

    console.log(`[VSS DIAGNOSIS END] State transitioned to ${Object.values(UserState).find(s => s === newState)}.`);


    // 4. Final Response Payload Construction
    return {
        success: true,
        message: message,
        userState: newState,
        requiredAction: requiredAction,
        payload: {
            statusDetails: `Defect Scan Count: ${request.scanResults.length}, High Severity: ${highSeverityCount}`,
            warningCode: hasCriticalDefect ? 'AUTH-STRUC' : undefined,
            ctaMessage: requiredAction === 'PRO_KIT_PURCHASE' 
                ? "즉시 PRO Kit 패치를 적용하여 시스템의 구조적 무결성을 확보하십시오." 
                : (requiredAction === 'NONE' ? "다음 정기 진단 시기를 예약하세요." : "전문가 상담이 필요합니다.")
        }
    };
};

// ========================================
// EXPORT FOR TESTING/INTEGRATION
// ========================================
export const diagnoseService = {
    diagnose: diagnoseSystem,
    states: UserState // 상태 열거형도 외부에 노출
};