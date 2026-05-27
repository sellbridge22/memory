/**
 * @file DiagnosisService.js
 * @description PELS 점수 계산, 사용자 상태 전이 관리, 트랜잭션 감사 로깅을 담당하는 핵심 비즈니스 서비스 레이어.
 */

// 가상의 AuditLogger 함수 (실제로는 DB 접근)
const AuditLogger = {
    log: (userId, eventType, details, status) => {
        console.log(`[AUDIT_LOG] User: ${userId} | Event: ${eventType} | Status: ${status} | Details: ${JSON.stringify(details)}`);
        // 실제 구현에서는 DB에 트랜잭션 로그를 기록합니다.
    }
};

/**
 * PELS (Potential Economic Loss Score) 계산 로직
 * @param {Object} scanResults - 진단 스캔 결과 배열
 * @returns {number} PELS 점수 (0 ~ 100)
 */
const calculatePelsScore = (scanResults) => {
    if (!Array.isArray(scanResults) || scanResults.length === 0) return 0;

    // [근거: 지난 의사결정 로그 - PELS 공식 반영]
    let totalRiskWeight = 0;
    for (const result of scanResults) {
        // 예시 PELS 로직: 특정 키워드에 가중치 부여
        if (result.includes('A1')) totalRiskWeight += 30; // 구조적 결함 A1
        else if (result.includes('B3')) totalRiskWeight += 50; // 법률 리스크 B3
        else if (result.includes('C2')) totalRiskWeight += 20; // 운영 미흡 C2
    }

    // 점수를 정규화하여 0~100 사이로 만듭니다.
    return Math.min(Math.max(totalRiskWeight / 5, 10), 95); // 최소 10점, 최대 95점으로 제한
};


/**
 * 사용자 진단 및 상태 전이 관리 핵심 함수 (State Machine 역할)
 * @param {string} userId - 현재 사용자 ID
 * @param {Object} inputData - 사용자가 제출한 데이터 {scanResults: [], jobSector: ""}
 * @returns {{score: number, status: string}} 계산된 PELS 점수와 초기 상태
 */
const runDiagnosis = (userId, inputData) => {
    const score = calculatePelsScore(inputData.scanResults);

    // 1. 진단 서비스 실행 기록 (Audit Log)
    AuditLogger.log(userId, 'DIAGNOSIS_RUN', { input: inputData }, 'SUCCESS');

    let status = "INITIAL";
    if (score > 60) {
        status = "CRITICAL_ALERT"; // 임계치 이상일 경우 경고 상태
    } else if (score >= 30) {
        status = "WARNING_LEVEL";
    } else {
        status = "LOW_RISK";
    }

    return { score, status };
};


/**
 * 최종 결제 및 사용자 상태 전이 로직 (가장 중요!)
 * @param {string} userId - 현재 사용자 ID
 * @param {{score: number, status: string}} diagnosisResult - 진단 결과
 * @param {Object} paymentDetails - 결제 정보 (Mocked)
 * @returns {boolean} 성공 여부
 */
const finalizeTransaction = async (userId, diagnosisResult, paymentDetails) => {
    if (!paymentDetails || !paymentDetails.token) {
        // 1. 결제 실패 기록 (Audit Log)
        AuditLogger.log(userId, 'PAYMENT_FAIL', { reason: "No token provided" }, 'FAILURE');
        return false;
    }

    try {
        // 2. Mock Payment Gateway 호출 및 검증
        const isSuccess = await mockPaymentProcessor(paymentDetails); // 가상의 외부 API 호출

        if (!isSuccess) {
            // 결제 실패 시, 상태 변경 없이 경고만 남기고 실패 처리
            AuditLogger.log(userId, 'PAYMENT_FAIL', { gateway_response: "Declined" }, 'FAILURE');
            return false;
        }

        // 3. 성공적인 트랜잭션이 발생했을 때만 사용자 상태 전이를 강제합니다. [근거: 코다리 검증된 지식]
        await updateUserStatus(userId, diagnosisResult);

        // 4. 최종 감사 기록 (Audit Log)
        AuditLogger.log(userId, 'SUCCESS_TRANSITION', { tier: "PRO", score: diagnosisResult.score }, 'SUCCESS');
        return true;

    } catch (error) {
        console.error("Transaction failed due to system error:", error);
        // 시스템 예외 발생 시 기록
        AuditLogger.log(userId, 'SYSTEM_ERROR', { error_message: error.message }, 'FAILURE');
        return false;
    }
};

// ========================= MOCK FUNCTIONS (Dependencies) =========================

/** @type {Promise<boolean>} Mock Payment Gateway 호출 시뮬레이션 */
const mockPaymentProcessor = async (details) => {
    console.log(`[MOCK] Attempting payment for ${details.amount} with token: ${details.token}...`);
    // 실제로는 API 통신이 이루어집니다. 여기서는 단순 성공/실패 시뮬레이션만 합니다.
    return details.token !== 'INVALID_TOKEN'; 
};

/** @type {Promise<void>} 사용자 상태 업데이트 서비스 (State Transition) */
const updateUserStatus = async (userId, diagnosisResult) => {
    console.log(`[STATE_TRANSITION] User ${userId} status updated to PRO tier.`);
    // 실제로는 DB에 user_status 필드를 변경하는 로직이 들어갑니다.
};

module.exports = {
    runDiagnosis,
    finalizeTransaction,
    calculatePelsScore
};