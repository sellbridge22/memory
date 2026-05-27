/**
 * MiniModuleService.js: 모든 사용자 액션의 상태 전이 및 리스크 계산 로직 관리.
 * 이 서비스는 앱의 핵심 비즈니스 논리를 담당하며, UI 컴포넌트와 분리되어야 합니다.
 */

const MIN_PELS = 10; // 최소 PELS 경고 기준액 (가정)

/**
 * 사용자 액션을 받아 다음 상태를 결정하고 필요한 리스크(경고)를 반환합니다.
 * @param {Object} userData - 현재 사용자 데이터 (email, jobSector 등).
 * @param {string} actionType - 발생한 액션 ("SCAN_COMPLETE", "PAYMENT_ATTEMPT", "MANUAL_SKIP").
 * @param {Object} payload - 액션에 따른 추가 정보 (scanResults, paymentToken 등).
 * @returns {{success: boolean, newState: string, message: string, pelsWarning: number}}
 */
export const processMiniModuleAction = (userData, actionType, payload) => {
    let currentPELS = 0;
    let warningMessage = "";

    // 1. 초기 진단 완료 시나리오 (SCAN_COMPLETE)
    if (actionType === "SCAN_COMPLETE") {
        const scanResults = payload?.scanResults || [];
        
        // 임시 로직: 스캔 결과가 일정 수준 이하일 경우, 즉시 위험 경고 발동.
        if (scanResults.length < 3) {
            currentPELS = MIN_PELS * (1 + Math.random() * 0.5); // 낮은 점수 -> 적은 손실 예상 (초기 단계)
            warningMessage = `[CRITICAL] 분석 결과가 부족합니다. 데이터 누락으로 인한 구조적 리스크가 감지되었습니다.`;
        } else {
            currentPELS = 0;
            warningMessage = "[STATUS OK] 초기 진단 완료. 다음 단계를 진행하세요.";
        }

        return { success: true, newState: "DIAGNOSIS_RESULT", message: warningMessage, pelsWarning: currentPELS };
    }

    // 2. 유료 서비스 구매 시도 (PAYMENT_ATTEMPT) - 가장 중요한 E2E 지점
    if (actionType === "PAYMENT_ATTEMPT") {
        const paymentSuccess = payload?.paymentToken === "SUCCESS"; // Mocked Success Token
        
        if (!paymentSuccess) {
            // FAILURE PATH 1: 결제 실패. 시스템 신뢰도 하락 및 경고 강화.
            currentPELS += MIN_PELS * 2; 
            warningMessage = `[SYSTEM ERROR] 결제 프로세스가 실패했습니다 (AUTH-STRUC). 현재의 구조적 리스크는 ${Math.round(currentPELS)} 이상의 손실로 예측됩니다.`;
            return { success: false, newState: "PAYMENT_FAILED", message: warningMessage, pelsWarning: currentPELS };
        }

        // SUCCESS PATH: 결제 성공 및 상태 업데이트 (가상의 외부 서비스 호출)
        console.log("✅ User state updated successfully for:", userData.email); 
        return { success: true, newState: "SUCCESS", message: "서비스 이용 권한이 활성화되었습니다. 구조적 위협으로부터 해방되십시오.", pelsWarning: 0 };
    }

    // 3. 사용자가 의도적으로 진단 단계를 건너뛰려 할 때 (MANUAL_SKIP) - 시간/강제성 경고
    if (actionType === "MANUAL_SKIP") {
        currentPELS += MIN_PELS * 1.5; // 시간을 지연시키는 행위 자체에 대한 패널티 부여
        warningMessage = `[WARNING] 필수 진단 단계를 건너뛰었습니다. 시간 경과로 인한 잠재적 손실액이 누적되고 있습니다. 현재 리스크: ${Math.round(currentPELS)} PELS`;
        return { success: true, newState: "MANUAL_SKIP_WARNING", message: warningMessage, pelsWarning: currentPELS };
    }

    // 기본 실패 처리
    return { success: false, newState: "UNKNOWN_STATE", message: "처리할 수 없는 액션입니다.", pelsWarning: 0 };
};

export default processMiniModuleAction;