/**
 * @fileoverview User State Transition and Purchase Flow API Mockup.
 * 진단 결과에 따라 유료 솔루션으로의 상태 전이(State Transition)를 강제합니다.
 */
const DefectCodes = require('../constants/DefectCodes');

// 가상의 DB 연결 및 사용자 상태 업데이트 함수 (실제 구현 시 필요)
const mockUpdateUserStatus = async (email, status) => {
    console.log(`[DB Mock] User ${email} state updated to: ${status}`);
    return true;
};


/**
 * @function processPurchase
 * @description 사용자가 구매를 시도할 때의 전체 흐름을 처리합니다. 상태 전이와 결제 로직이 핵심입니다.
 * @param {object} input - 구매 요청 데이터 (예: email, selectedTierId, sourceDefect)
 * @returns {Promise<{success: boolean, message: string, newStatus: string}>} 거래 성공 여부 및 새로운 사용자 상태
 */
const processPurchase = async (input) => {
    console.log(`\n[Service] Attempting purchase for ${input.email} (${input.selectedTierId})...`);

    // 1. 구매 전 필수 검증: '구조적 결함' 코드가 명확해야 함 [근거: 지난 의사결정 로그]
    if (!input.source_defect || input.source_defect !== DefectCodes.DIAGNOSIS_INCONCLUSIVE) {
        throw new Error(JSON.stringify({
            code: "FLOW-INVALID",
            message: "구매를 위한 구조적 결함 코드가 불분명합니다. 진단 단계부터 재진행해야 합니다.",
            tone: "WARNING_CRITICAL"
        }));
    }

    let transactionSuccess = false;
    try {
        // 2. 외부 결제 모듈 연동 시뮬레이션 (Mock API Call) [근거: 코다리 검증된 지식]
        console.log("[Payment Mock] Calling external payment processor...");
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

        // 임시 결제 성공 조건 (실제로는 PG사 응답에 의존)
        if (input.selectedTierId === "PRO") {
            transactionSuccess = true;
        } else {
             throw new Error("가상 거래 실패: PRO 티어만 유효합니다."); // Intentional failure for testing
        }

    } catch (e) {
        // 3. 결제 모듈 에러 처리 및 Critical Error Tone 적용 [근거: 코다리 개인 메모리]
        throw new Error(JSON.stringify({
            code: DefectCodes.PAYMENT_PROCESSOR_FAIL,
            message: `결제 시스템 오류 발생 (${e.message}). 거래를 재시도하거나 관리자에게 문의하세요.`,
            tone: "CRITICAL"
        }));
    }

    // 4. 최종 성공 및 사용자 상태 강제 업데이트 [근거: 코다리 개인 메모리]
    if (transactionSuccess) {
        const newStatus = `CLIENT_ACTIVE_${input.selectedTierId}`;
        await mockUpdateUserStatus(input.email, newStatus);

        return { success: true, message: "진단 및 결제 과정이 성공적으로 완료되었습니다. 이제 시스템에 대한 접근 권한을 획득하셨습니다.", newStatus };
    } else {
         // 이 코드는 위 try-catch에서 처리되지만 안전장치로 남깁니다.
        throw new Error(JSON.stringify({
            code: DefectCodes.STATE_TRANSITION_FAIL,
            message: "사용자 상태 전이 실패.",
            tone: "CRITICAL"
        }));
    }
};

module.exports = { processPurchase };