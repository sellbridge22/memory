/**
 * @description 외부 결제 게이트웨이의 호출을 모킹합니다.
 * 실제로는 Stripe, PayPal 등의 API를 호출할 부분이 여기에 들어갑니다.
 */
const mockPaymentProcessor = {
    /**
     * 성공적인 결제 트랜잭션을 시뮬레이션합니다.
     * @param {string} token - 결제 토큰 (모킹에서는 무시)
     * @param {number} amount - 금액
     * @returns {Promise<{success: boolean, transactionId: string}>}
     */
    processPaymentSuccess: async (token, amount) => {
        console.log(`[MOCK PAYMENT] $${amount} 결제 성공 시뮬레이션.`);
        // 딜레이를 주어 실제 네트워크 통신처럼 보이게 함
        await new Promise(resolve => setTimeout(resolve, 300)); 
        return { success: true, transactionId: `txn_${Date.now()}_success` };
    },

    /**
     * 게이트웨이 오류 (예: 카드 거절)를 시뮬레이션합니다.
     * @returns {Promise<{success: boolean, errorCode: string}>}
     */
    processPaymentFailure: async () => {
        console.error("[MOCK PAYMENT] 결제 게이트웨이에서 오류 발생!");
        await new Promise(resolve => setTimeout(resolve, 300));
        // 비즈니스 로직에 맞는 커스텀 에러 코드를 반환하는 것이 중요함
        return { success: false, errorCode: 'PAYMENT-GATEWAY-FAIL', message: '결제 정보가 유효하지 않거나 시스템 오류입니다.' };
    },

    /**
     * 네트워크 연결 자체가 끊기는 경우를 시뮬레이션합니다.
     */
    simulateNetworkError: async () => {
        console.error("[MOCK PAYMENT] 네트워크 통신 불가!");
        throw new Error('NETWORK_TIMEOUT');
    }
};

module.exports = mockPaymentProcessor;