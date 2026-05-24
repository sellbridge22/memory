const stateEngine = require('../state_engine');
const mockPaymentProcessor = require('../mock_payment_processor');
const { getInitialState, calculateDefectScore } = stateEngine;

// Mocking 외부 API 호출을 테스트 전반에 걸쳐 사용합니다.
jest.mock('../../src/scripts/mock_payment_processor', () => ({
    processPayment: jest.fn(),
}));


describe('E2E Integration Test: CRITICAL ERROR Flow & Payment Gateway', () => {
    let initialContext;

    beforeEach(() => {
        // 테스트 시작 전 초기 상태 설정 및 Mock API 리셋
        jest.clearAllMocks();
        initialContext = { email: "user@example.com", jobSector: "tech" };
    });

    test('1. Defect Score가 임계값 미만일 때 (Free Tier) 정상 작동 확인', async () => {
        // 1단계: 초기 상태 및 점수 계산
        const currentState = getInitialState(initialContext);
        const defectScore = calculateDefectScore(currentState, { inputA: 'low', inputB: 'normal' });

        expect(defectScore).toBeLessThan(50); // 임계값 미만 확인 (가정)
        let userFlowResult = await stateEngine.handleDiagnosis(initialContext, defectScore);

        // 2단계: 결과 흐름 검증 - 구매 유도 없음
        expect(userFlowResult.tier).toBe('FREE');
        expect(userFlowResult.ctaType).toBe('INFO'); // 정보성 CTA만 나옴
        console.log("\n✅ Test 1 Passed: Free Tier Flow 정상 작동.");
    });

    test('2. Defect Score가 임계값 이상일 때 (Critical State) - 결제 플로우 성공 테스트', async () => {
        // 1단계: 고위험 데이터 입력으로 점수 높이기
        const highDefectContext = { email: "premium@example.com", jobSector: "high_risk" };
        const defectScore = calculateDefectScore(initialContext, { inputA: 'critical', inputB: 'severe' });

        // 2단계: 상태 전이 트리거 (Critical State 진입)
        let userFlowResult = await stateEngine.handleDiagnosis(highDefectContext, defectScore);

        expect(userFlowResult.tier).toBe('PRO'); // Pro Tier로 강제 전이 확인
        expect(userFlowResult.ctaType).toBe('PAYMENT_REQUIRED'); // 결제가 필수라는 CTA가 나와야 함

        // 3단계: Mock Payment Gateway 성공 시뮬레이션 및 상태 업데이트 검증
        mockPaymentProcessor.processPayment.mockResolvedValue({ success: true, transactionId: 'SUCCESS_TXN' });

        const paymentResult = await stateEngine.completeUpgrade(highDefectContext, 'PRO');

        expect(paymentResult.success).toBe(true); // 최종 상태가 성공적으로 변경되었는지 확인
        expect(mockPaymentProcessor.processPayment).toHaveBeenCalledWith(
            "premium@example.com", 
            19900 // 가정된 PRO 가격
        );
        console.log("\n✅ Test 2 Passed: Critical State -> Payment Success 플로우 정상 작동.");
    });

    test('3. 결제 실패 시나리오 테스트 (Failure Handling)', async () => {
        // 1단계: 고위험 데이터 입력으로 점수 높이기 (Critical State 진입 가정)
        const failContext = { email: "fail@example.com", jobSector: "high_risk" };
        const defectScore = calculateDefectScore(initialContext, { inputA: 'critical', inputB: 'severe' });

        // 2단계: Mock Payment Gateway 실패 시뮬레이션 설정
        mockPaymentProcessor.processPayment.mockResolvedValue({ success: false, transactionId: null });

        // 3단계: 결제 진행 및 실패 처리 검증
        const paymentResult = await stateEngine.completeUpgrade(failContext, 'PRO');

        expect(paymentResult.success).toBe(false); // 최종 상태가 실패했는지 확인
        expect(paymentResult.message).toContain("결제가 실패했습니다"); // 사용자에게 명확한 에러 메시지가 전달되는지 확인
        console.log("\n✅ Test 3 Passed: Payment Failure 플로우 정상 작동.");
    });
});