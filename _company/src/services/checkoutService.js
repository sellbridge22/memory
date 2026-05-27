/**
 * @fileoverview CheckoutFlowSimulator의 핵심 비즈니스 로직과 상태 전이(State Transition)를 담당하는 서비스 레이어.
 * PELS 계산 및 모든 에러 케이스에서 일관된 'System Warning' 논리를 강제함.
 */

// --- 상수 정의 (Critical Error Tone 유지) ---
const STATES = {
    INITIAL: 'INITIATED',
    PENDING_VALIDATION: 'AWAITING_DATA',
    RISK_WARNING: 'CRITICAL_ALERT', // PELS 경고 상태
    PAYMENT_FAILED: 'TRANSACTION_FAILURE',
    SUCCESS: 'COMPLETED'
};

/**
 * 가상의 사용자 상태를 업데이트하는 모킹 함수. 실제 DB/Redis 연동 필요.
 * @param {string} email - 사용자 이메일
 * @param {object} stateData - 새로운 상태 데이터 (예: PELS, last_transaction_time)
 */
const updateUserStatus = async (email, stateData) => {
    console.log(`[DB] User ${email} status updated. New State: ${stateData.status}`);
    // 실제 환경에서는 JWT 또는 세션 기반의 DB 업데이트가 필요함.
};


/**
 * PELS(Psychological Fatigue Cost Index) 계산 로직. 시간이 줄어들수록 가파르게 증가하도록 설계.
 * @param {number} initialPels - 초기 PELS 점수 (0~100)
 * @param {number} timeRemainingSeconds - 남은 시간 (초 단위). 
 * @returns {{newPels: number, warningLevel: string}} 업데이트된 PELS 값과 경고 레벨.
 */
const calculatePELS = (initialPels, timeRemainingSeconds) => {
    let pelsIncrease = Math.max(0, initialPels / 100 * (1 - (timeRemainingSeconds / 3600))); // 시간 감소에 비례한 증가
    
    // 임계치 로직: 시간이 5분 이하일 때 PELS 증폭 계수 적용
    if (timeRemainingSeconds < 300) {
        pelsIncrease *= 1.5; // 경고 단계에서 리스크를 과장하여 보여줌
    }

    let newPels = Math.min(120, initialPels + pelsIncrease); // 최대 PELS 120으로 제한
    let warningLevel = 'NORMAL';

    if (newPels >= 85) {
        warningLevel = 'CRITICAL_ALERT'; // 시스템 경고 발동
    } else if (newPels >= 60 && timeRemainingSeconds < 300) {
        warningLevel = 'HIGH_RISK'; // 높은 리스크 구간
    }

    return { newPels: Math.round(newPels), warningLevel };
};


/**
 * 핵심 결제 플로우 시뮬레이터 (State Machine). 모든 단계의 상태 전이를 관리합니다.
 * @param {string} email - 사용자 이메일
 * @param {object} paymentDetails - 결제 정보
 * @param {number} initialPelsScore - 시작 PELS 점수
 * @returns {Promise<{success: boolean, finalState: string, message: string}>} 최종 결과 객체.
 */
const processCheckout = async (email, paymentDetails, initialPelsScore) => {
    let currentState = STATES.INITIAL;
    let currentPels = initialPelsScore;
    
    console.log(`\n--- [CHECKOUT START] User: ${email} ---`);

    try {
        // 1단계: PELS 계산 및 경고 확인 (Timer Expiry Simulation)
        const timeRemaining = 350; // 예시 시간 (약 5분)
        const { newPels, warningLevel } = calculatePELS(initialPelsScore, timeRemaining);
        currentPels = newPels;
        currentState = STATES.RISK_WARNING;

        console.warn(`[SYSTEM WARNING]: PELS Score Increased! Current: ${newPels}/120. Level: ${warningLevel}`);
        if (warningLevel !== 'NORMAL') {
            // 💡 지시사항 반영: 경고 메시지를 강제로 노출시키는 로직을 구현합니다.
            await new Promise(resolve => setTimeout(resolve, 500)); // 시각적 효과를 위한 대기 시간 모킹
        }

        // 2단계: 결제 데이터 검증 및 전이 (Input Failure Simulation)
        if (!paymentDetails || !paymentDetails.cardToken) {
            throw new Error("PAYMENT_INPUT_FAILURE"); // 입력 실패 강제 발생
        }

        // 3단계: Mock API 호출 (Network/Processing simulation)
        const paymentResult = await mockPaymentGateway(paymentDetails);

        if (!paymentResult.success) {
             // 지시사항 반영: 네트워크 오류나 결제 정보 실패 시, 재강조 로직 발동
            currentState = STATES.PAYMENT_FAILED;
            throw new Error(`AUTH-STRUC: ${paymentResult.reason}. PELS 증가 필요.`); 
        }

        // 성공 상태 전이
        currentState = STATES.SUCCESS;
        await updateUserStatus(email, { status: currentState, pels: currentPels });
        return { success: true, finalState: currentState, message: "System Integrity Restored. Module Activated." };

    } catch (error) {
        console.error(`[ERROR CAPTURED]: ${error.message}`);
        let finalMessage = `SYSTEM FAILURE DETECTED. (${error.message}).`;
        let finalState = STATES.PAYMENT_FAILED;

        // 💡 지시사항 반영: 모든 실패 시나리오에서 공통 경고 문구를 반환합니다.
        if (error.message.includes("PAYMENT_INPUT_FAILURE")) {
            finalMessage = "CRITICAL ERROR: Payment data is incomplete. Re-verification is mandatory to prevent structural loss.";
        } else if (error.message.includes("AUTH-STRUC")) {
             finalMessage = `System Failure (${error.message}). Manual intervention required! PELS Score must be stabilized.`;
        }

        await updateUserStatus(email, { status: finalState, pels: currentPels });
        return { success: false, finalState: finalState, message: finalMessage };
    }
};

/** Mock Payment Gateway 호출 */
const mockPaymentGateway = async (details) => {
    console.log("[API] Attempting payment processing...");
    await new Promise(resolve => setTimeout(resolve, 1000)); // 네트워크 지연 모킹
    
    // 네트워킹 오류 시뮬레이션: 특정 조건에서 강제 실패 처리
    if (Math.random() < 0.2) {
        return { success: false, reason: "NETWORK_TIMEOUT", code: "EIO-503" };
    }

    // 성공 로직
    return { success: true, transactionId: `TX-${Date.now()}` };
};


module.exports = {
    processCheckout,
    calculatePELS,
    STATES
};