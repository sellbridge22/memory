const mockPaymentProcessor = require('../../src/utils/mockPaymentProcessor');
// 가상의 API 핸들러 함수를 가져옴 (실제로는 이 파일에서 모든 플로우가 시작됨)
const { processDiagnosticScan, completeTransaction } = require('../../api/diagnosticFlow'); 

describe('E2E Payment Flow Integration Test Suite', () => {
    
    // --- TEST CASE 1: 성공적인 E2E 트랜잭션 (Happy Path) ---
    test('TC-001: 진단 완료 -> 결제 성공 -> 상태 업데이트까지 완벽히 진행되는지 검증', async () => {
        const mockUser = { email: 'success@example.com' };
        const scanResults = ["A1", "B3"];
        
        // 1. 초기 스캔 및 진단 리포트 생성 (API 호출)
        let report = await processDiagnosticScan(mockUser, scanResults);
        expect(report.status).toBe('CRITICAL_ERROR'); // 필수 경고 메시지 확인

        // 2. 결제 프로세스 진행 (Mock API 사용)
        const paymentResult = await mockPaymentProcessor.processPaymentSuccess('dummy-token', 19900);
        expect(paymentResult.success).toBe(true);

        // 3. 최종 거래 완료 및 사용자 상태 업데이트 (핵심 로직 검증)
        let finalStatus;
        try {
            finalStatus = await completeTransaction(mockUser, paymentResult.transactionId, 'PRO');
        } catch (e) {
            fail(`E2E Flow 실패: 상태 전이 중 에러 발생 - ${e.message}`);
        }

        // 최종 검증: 사용자의 기술적 상태가 업데이트되었는지 확인해야 함
        expect(finalStatus).toBe('USER_STATUS_UPDATED'); 
    });

    // --- TEST CASE 2: 클라이언트 입력 실패 시나리오 (State Transition Error) ---
    test('TC-002: 사용자 필수 정보 누락/오류로 인해 결제 전에 플로우가 막히는지 검증', async () => {
        const mockUser = { email: '' }; // Email이 비어있음
        const scanResults = ["X9"];

        // 1. 스캔 시도 (API는 실행되나, 클라이언트에서 유효성 검사 실패)
        let report;
        try {
            report = await processDiagnosticScan(mockUser, scanResults);
        } catch (e) {
             // 기대하는 에러 메시지 구조와 토큰이 반환되는지 확인해야 함
            expect(e.message).toContain('Email 주소가 유효하지 않습니다.'); 
        }

        // 2. 결제 시도 자체가 발생하지 않아야 하며, 'Critical Error'가 아닌 'Input Error'로 처리되어야 함
        const paymentAttempt = await completeTransaction(mockUser, null, null);
        expect(paymentAttempt).toBe('FLOW_INTERRUPTED'); // 플로우가 결제 단계를 건너뛰었는지 확인
    });

    // --- TEST CASE 3: 외부 결제 게이트웨이 실패 시나리오 (Air-gap/Failure State) ---
    test('TC-003: 게이트웨이에서 오류 발생(카드 거절 등) 후, 사용자에게 명확한 가이드라인을 제공하는지 검증', async () => {
        const mockUser = { email: 'failure@example.com' };
        const scanResults = ["B2"];

        // 1. 스캔 및 진단 리포트 생성 (성공 가정)
        await processDiagnosticScan(mockUser, scanResults); 

        // 2. 결제 시도 - 모킹 실패 호출 사용
        const paymentResult = await mockPaymentProcessor.processPaymentFailure();
        expect(paymentResult.success).toBe(false);
        expect(paymentResult.errorCode).toBe('PAYMENT-GATEWAY-FAIL'); // 우리가 정의한 코드가 반환되는지 확인

        // 3. 최종 상태 전이 시도 - 결제 실패 플래그 전달
        const finalStatus = await completeTransaction(mockUser, null, 'FAILED_AT_PAYMENT', paymentResult);

        // 최종 검증: 상태가 '결제 대기'나 '실패'로 정확히 기록되어야 함. 
        expect(finalStatus).toBe('PAYMENT_FAILURE_STATE'); 
    });
});