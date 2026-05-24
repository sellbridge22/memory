/**
 * @description Stripe 결제 게이트웨이를 모킹하는 서비스 레이어.
 * 실제 API 호출 대신 비동기 로직을 시뮬레이션하여 테스트 환경에 사용됩니다.
 */
const mockPaymentProcessor = {
    /**
     * 가상의 트랜잭션을 처리하고 성공/실패 여부를 반환합니다.
     * @param {string} email - 사용자 이메일
     * @param {number} amount - 청구 금액 (가정)
     * @returns {Promise<{success: boolean, transactionId: string|null}>}
     */
    processPayment: async (email, amount) => {
        console.log(`[MOCK PAY]: ${email} 계정에 $${amount} 결제 시도 중...`);
        // 테스트 목적으로 성공 여부를 강제 할 수 있는 로직을 추가합니다.
        // 실제 환경에서는 외부 API 응답에 의존하겠지만, 여기서는 일단 시간 지연과 가짜 결과를 반환합니다.
        await new Promise(resolve => setTimeout(resolve, 50)); // 네트워크 지연 시뮬레이션

        // 테스트 케이스를 위해 임의로 성공을 가정하지만, 필요시 이 로직을 변경하여 실패도 검증 가능하도록 설계했습니다.
        if (email.includes("fail")) {
             return { success: false, transactionId: null }; // 의도적 실패 시뮬레이션
        }

        const mockTxnId = `txn_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        console.log(`[MOCK PAY]: 성공! 트랜잭션 ID ${mockTxnId}`);
        return { success: true, transactionId: mockTxnId };
    }
};

module.exports = mockPaymentProcessor;