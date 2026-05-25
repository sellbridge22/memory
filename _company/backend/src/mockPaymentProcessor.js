/**
 * @fileoverview Mock Payment Gateway Service. 외부 결제 시스템과의 연동을 모킹합니다.
 * 모든 예외 상황(네트워크, 카드 거절)을 포착하고, 비즈니스 로직에 맞는 오류 코드를 반환하는 것이 핵심입니다.
 */

// 💳 상수 정의: 비즈니스에서 사용하는 공식 에러 코드 그룹
const ERROR_CODES = {
    PAYMENT_SUCCESS: 'TXN-200',
    PAYMENT_FAIL_CARD: 'AUTH-401', // 카드 거절 (가장 흔함)
    PAYMENT_FAIL_NETWORK: 'INFRA-503', // 네트워크 문제 (시스템적 결함)
    PAYMENT_UNSUPPORTED: 'TXN-999' // 지원하지 않는 트랜잭션 타입
};

/**
 * 가상의 사용자 상태 업데이트 서비스.
 * 실제로는 DB에 기록되어야 합니다. 여기서는 콘솔 로그로 대체합니다.
 * @param {string} email - 사용자 이메일
 * @param {string} status - 새로운 시스템 상태 (e.g., "PRO_ACTIVE")
 */
const updateUserStatus = (email, status) => {
    console.log(`✅ [DB WRITE SUCCESS] User ${email}: Status updated to "${status}".`);
    return true; // 성공 시 true 반환
};

/**
 * @description 모킹된 결제 트랜잭션을 시뮬레이션합니다.
 * @param {string} email - 사용자 이메일
 * @param {number} amount - 거래 금액
 * @returns {Promise<{success: boolean, transactionId: string, code: string}>}
 */
const processPayment = async (email, amount) => {
    console.log(`\n--- 💰 [MOCK PAYMENT START] ${amount}원 결제 시도 (${email}) ---`);

    // === 디버깅/테스트 로직 추가 구간 ===
    if (!email || !amount || typeof amount !== 'number') {
        throw new Error("INVALID_INPUT: 필수 파라미터가 누락되었습니다.");
    }

    await new Promise(resolve => setTimeout(resolve, 50)); // API 지연 시간 시뮬레이션 (50ms)

    // 테스트 케이스별 실패 모킹
    if (amount > 19000 && Math.random() < 0.2) { // 20% 확률로 네트워크 오류 발생 모킹
        console.warn("🚨 [MOCK FAIL] PAYMENT_FAIL_NETWORK: 가상의 인프라 문제 발생.");
        return { success: false, transactionId: null, code: ERROR_CODES.PAYMENT_FAIL_NETWORK };
    }

    if (amount === 999) { // 특정 금액은 무조건 실패 모킹
        console.error("❌ [MOCK FAIL] PAYMENT_FAIL_CARD: 카드 거절 코드 발생.");
        return { success: false, transactionId: null, code: ERROR_CODES.PAYMENT_FAIL_CARD };
    }

    // 성공 케이스
    const mockTxnId = `TXN-${Date.now()}`;
    console.log(`✅ [MOCK SUCCESS] 결제 완료. Transaction ID: ${mockTxnId}`);
    return { success: true, transactionId: mockTxnId, code: ERROR_CODES.PAYMENT_SUCCESS };
};

module.exports = {
    processPayment,
    updateUserStatus,
    ERROR_CODES
};