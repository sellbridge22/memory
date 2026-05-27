/**
 * @fileoverview Diagnosis Workflow Manager: 시스템 결함 진단 워크플로우의 핵심 상태 전이 로직을 관리합니다.
 * 이 모듈은 사용자 인터랙션(T1)부터 최종 'SYSTEM OVERLOAD' 경고 단계까지의 흐름을 책임집니다.
 * @module diagnosisWorkflowManager
 */

// ------------------------------------------
// [MOCK Dependencies] (실제 환경에서는 ContextDrainService, StateAPI 등에서 주입받아야 함)
// ------------------------------------------

/**
 * 사용자의 인지 자원 고갈 정도를 시뮬레이션하는 서비스 모의 객체.
 */
const MockContextDrainService = {
    getDrainLevel: (sessionDurationMinutes) => {
        // 세션이 길어질수록 Drain Level이 높아지는 로직을 가정합니다.
        let drain = 100 - Math.min(Math.floor(sessionDurationMinutes / 5) * 8, 90); // 최대 90% 감소
        return { level: drain, decayRate: 0.1 + (sessionDurationMinutes > 20 ? 0.3 : 0) };
    },

    isOverloaded: (drainLevel) => {
        // 경고 임계치(Threshold) 정의에 따라 로직 실행 [근거: sessions/2026-05-25T11:30_ComponentPropsContract.md]
        return drainLevel <= 25; 
    }
};

/**
 * 시스템의 사용자 상태를 업데이트하고, 경고 메시지를 표시하는 API 모의 객체.
 */
const MockStateAPI = {
    triggerErrorModal: (errorCode, message) => {
        console.error(`\n🚨 [SYSTEM ALERT] Code: ${errorCode}`);
        console.error(`🚨 [SYSTEM ALERT] Message: ${message}`);
        // 실제로는 여기에 DOM 조작 또는 전역 이벤트 발행 로직이 들어갑니다.
    },
    updateUserState: (state) => {
        console.log(`✅ User State Updated to: ${JSON.stringify(state)}`);
    }
};


/**
 * Diagnosis Workflow Manager 클래스. 
 * T1 -> T2 -> ... -> FINAL_STATE 로의 상태 전이를 강제합니다.
 */
class DiagnosisWorkflowManager {
    constructor(userContext) {
        if (!userContext || !userContext.email) {
            throw new Error("Invalid User Context provided.");
        }
        this.user = userContext;
        this.currentState = 'INITIAL_INTERACTION'; // T1 시작 상태
        console.log(`[Manager] Workflow Initialized for ${this.user.email}. State: ${this.currentState}`);
    }

    /**
     * 초기 사용자 인터랙션(T1)을 처리하고, 시스템의 구조적 결함을 감지합니다.
     * @param {Object} t1Input - T1 단계에서 수집된 사용자의 입력 데이터 (예: 설문조사 결과).
     * @returns {Promise<{success: boolean, nextState: string}>} 다음 상태와 성공 여부.
     */
    async processT1Interaction(t1Input) {
        console.log("--- [STEP 1/3] T1 Interaction Processing Start ---");
        
        // 1. 데이터 유효성 검증 (필수 필드 체크)
        if (!t1Input.jobSector || t1Input.scanResults?.length === 0) {
            MockStateAPI.triggerErrorModal('INPUT-MISSING', "진단에 필요한 필수 정보를 모두 입력해 주세요.");
            return { success: false, nextState: 'ERROR_INPUT' }; // Failure Path 1
        }

        // 2. 시스템 자원 모니터링 (Context Drain 체크)
        const drainResult = MockContextDrainService.getDrainLevel(30); // 30분 세션 가정
        if (MockContextDrainService.isOverloaded(drainResult.level)) {
            MockStateAPI.triggerErrorModal('CONTEXT-DRAIN', `경고: 인지 자원 고갈 임계치 도달 (${Math.round(drainResult.level)}%). 시스템 과부하가 의심됩니다.`);
            return { success: false, nextState: 'ERROR_OVERLOAD' }; // Failure Path 2
        }

        // 3. 구조적 결함 감지 로직 (핵심 비즈니스 로직)
        const structuralDefectDetected = this._checkStructuralIntegrity(t1Input);
        if (!structuralDefectDetected) {
            this.currentState = 'SUCCESS_T2';
            return { success: true, nextState: 'ADVANCEMENT' }; 
        } else {
             // 결함 감지 성공 시, 즉시 Critical Error 상태로 강제 전이 (핵심 로직)
            await this._forceTransitionToCriticalError(t1Input);
            this.currentState = 'CRITICAL_FAILURE';
            return { success: false, nextState: 'CRITICAL_ERROR' }; // Failure Path 3 (우리가 원하는 경로)
        }
    }

    /**
     * 구조적 무결성 검사 로직을 시뮬레이션합니다. 특정 패턴의 결함을 감지하여 강제로 실패를 유도합니다.
     * @param {Object} t1Input - 사용자 입력 데이터.
     * @returns {boolean} 결함 발견 여부 (true = 결함 존재).
     */
    _checkStructuralIntegrity(t1Input) {
        // [핵심 비즈니스 로직]: 만약 'A1'과 같은 특정 패턴의 결과가 있고, 동시에 'tech' 섹터에 속한다면 위험도가 높다고 가정합니다.
        const isHighRiskPattern = t1Input.scanResults.includes("A1") && t1Input.jobSector === "tech";
        return isHighRiskPattern; 
    }

    /**
     * 시스템 오류 발생 시, 강제적으로 경고 모달을 트리거하고 사용자 상태를 업데이트합니다. (Atomic Transition)
     * @param {Object} input - 실패 원인을 파악하기 위한 입력 데이터.
     */
    async _forceTransitionToCriticalError(input) {
        console.log("\n================================================");
        console.warn("[!!!] 🛑 CRITICAL SYSTEM FAILURE DETECTED!");
        
        // 1. 전용 에러 코드 정의 및 메시지 구성 [근거: 지난 의사결정 로그, 코다리 개인 메모리]
        const errorCode = "AUTH-STRUC"; 
        let message = "사용자의 현재 데이터 구조에서 심각한 시스템 오류 패턴이 감지되었습니다.";

        if (input.jobSector === 'tech') {
            message += " 특히 'A1' 지표는 일반적인 진단 모델의 범위를 벗어납니다. 즉시 전문가 진단(Enterprise)이 필요합니다.";
        }

        // 2. 경고 모달 트리거 및 사용자에게 노출 [근거: 코다리 검증된 지식]
        MockStateAPI.triggerErrorModal(errorCode, message);

        // 3. 상태 강제 변경 로직 (핵심)
        const failureState = {
            userStatus: "AWAITING_DIAGNOSIS", // 사용자 상태를 '진단 대기'로 설정
            lastDefectCode: errorCode,       // 어떤 결함으로 실패했는지 기록
            timestamp: new Date().toISOString()
        };
        MockStateAPI.updateUserState(failureState);

        console.log("================================================\n");
    }
}

export { DiagnosisWorkflowManager };