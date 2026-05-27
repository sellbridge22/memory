// VssStateTransitionEngine.ts: 핵심 상태 전이 및 데이터 유효성 검사 로직
import { DiagnosisPayload, UserStatus } from '../types'; // 가상의 타입 정의

/**
 * @description 사용자 입력 페이로드와 현재 시스템 상태를 기반으로 다음 상태(State)를 결정하고, 구조적 결함 여부를 판단합니다.
 * 이 엔진은 단순한 API 호출이 아닌, 비즈니스 로직을 강제하는 핵심 계층입니다.
 * @param payload - 클라이언트가 전송하는 모든 데이터 (진단 결과, 선택 티어 등).
 * @param currentState - 현재 사용자의 시스템 상태 (예: '진단 완료', '결제 대기').
 * @returns {Promise<{ newState: string, structuralError?: { code: string; message: string } }>} 새로운 상태와 구조적 에러 메시지(있을 경우)를 반환합니다.
 */
export const VssStateTransitionEngine = async (payload: DiagnosisPayload, currentState: UserStatus) => {
    console.log(`[VSS Engine] State Transition 시작. Current State: ${currentState}`);

    let structuralError: { code: string; message: string } | undefined = undefined;

    // 1. Payload 유효성 검증 (Mandatory Payload Validation)
    if (!payload || !payload.email || !payload.scanResults?.length) {
        structuralError = { 
            code: 'PAYLOAD-MISSING', 
            message: "🚨 CRITICAL SYSTEM WARNING: 필수 데이터 필드(이메일, 스캔 결과 등)가 누락되었습니다. 진단 과정이 비정상적으로 종료될 수 있습니다." 
        };
    }

    // 2. 구조적 취약점 분석 및 상태 전이 로직 (Core Business Logic)
    if (structuralError) {
        return { newState: 'STATE_ERROR', structuralError }; // 데이터 누락 시 즉시 오류 상태로 강제 전환
    }

    const hasCriticalVulnerability = payload.scanResults.some(result => result.includes('CRITICAL'));

    // 3. 비즈니스 플로우 검증 및 에러/성공 페이로드 반환
    if (currentState === 'PENDING_DIAGNOSIS' && !hasCriticalVulnerability) {
        // 구조적 결함이 없는 경우: 다음 단계(PRO Kit 구매 유도)로 강제 전이시키되, 경고 메시지 포함.
        structuralError = { 
            code: 'LOW-RISK-WARNING', 
            message: "⚠️ 시스템 진단 결과는 정상 범위에 가깝습니다만, 아직 구조적 취약점(Structural Vulnerability)을 완전히 배제할 수 없습니다. PRO Kit 구매를 통해 최소한의 안정화를 권장합니다."
        };
        return { newState: 'STATE_RECOMMENDATION', structuralError };

    } else if (currentState === 'PENDING_DIAGNOSIS' && hasCriticalVulnerability) {
        // 구조적 결함 발견 시: 가장 높은 수준의 경고와 구매를 강제합니다.
        structuralError = { 
            code: 'AUTH-STRUC', 
            message: "🚨 CRITICAL ERROR DETECTED: 시스템 구조에 심각한 취약점(Structural Flaw)이 감지되었습니다. 이 상태는 즉시 패치(Patch)가 필요하며, PRO Kit을 통한 응급 처방 절차가 필수적입니다."
        };
        return { newState: 'STATE_ALERT', structuralError };

    } else if (structuralError === undefined && payload.selectedTierId === 'PRO') {
         // 모든 검증 통과 및 구매 시도 성공
         return { newState: 'STATE_SUCCESS' };
    }


    // 기본 케이스 또는 디버깅용 fallback
    return { newState: 'STATE_UNKNOWN' }; 
};

/**
 * @description 가상의 타입 정의 (실제 프로젝트에서는 별도의 types/index.ts에 정의되어야 함)
 */
export type DiagnosisPayload = {
    email: string;
    scanResults: string[]; // 예: ['A1-PASS', 'B3-CRITICAL']
    selectedTierId?: 'FREE' | 'PRO' | 'ENTERPRISE';
};

export type UserStatus = 'PENDING_DIAGNOSIS' | 'STATE_ALERT' | 'STATE_RECOMMENDATION' | 'STATE_SUCCESS' | 'STATE_ERROR';