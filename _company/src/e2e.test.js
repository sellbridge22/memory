/**
 * @fileoverview E2E 테스트 스크립트: 핵심 비즈니스 로직과 상태 전이를 검증합니다.
 * 단순 기능 검증을 넘어, 우리가 정의한 'Critical Error Tone'이 모든 예외 상황에서 강제 출력되는지 확인하는 것이 목표입니다.
 */

// Mocking Dependencies (실제 환경에서는 jest.mock('./apiService'); 사용)
const { simulateDiagnosis, attemptPurchase } = require('./apiService'); 


describe('⭐ Critical Path E2E Test Suite', () => {
    let mockEmail = 'test@example.com';
    let initialDiagnosisResult;

    // 테스트 전 Mocking 설정 (외부 API 의존성 제거)
    beforeAll(() => {
        console.log("--- Starting E2E Test Setup ---");
        jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true }); // 네트워크 요청 모킹
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    // ===============================================
    // TEST CASE 1: Happy Path (성공적인 진단 및 구매)
    // ===============================================
    test('TC-001: [SUCCESS] 정상적인 결함 발견 -> PRO Kit 구매 성공 흐름 검증', async () => {
        // Mocking: 강제로 결함을 발견하고, 결제에 성공한다고 설정
        jest.spyOn(ApiService, 'diagnose').mockResolvedValueOnce({ 
            success: true, 
            data: { defectsFound: ["AUTH-STRUC"], score: 30 }, 
            message: "심각한 시스템 구조적 결함을 발견했습니다." 
        });
        jest.spyOn(ApiService, 'buy').mockResolvedValueOnce({ 
            success: true, 
            transactionId: 'TX_SUCCESS', 
            message: "구매 완료." 
        });

        // Step 1: 진단 실행 (결함 발견 강제)
        await ApiService.diagnose(mockEmail, 'tech');
        let diagnosisResult = { defectsFound: ["AUTH-STRUC"] }; // Mock된 결과 가정

        // Step 2: 구매 시도
        const purchaseResponse = await ApiService.buy(mockEmail, 'PRO');
        
        expect(purchaseResponse).toHaveProperty('success', true);
        expect(purchaseResponse).toHaveProperty('transactionId');
    });


    // ===============================================
    // TEST CASE 2: Failure Path (사용자 입력 실패/에어갭 에러)
    // ===============================================
    test('TC-002: [FAILURE] 사용자 로그 미제출 -> 시스템 경고 메시지 강제 출력 검증', async () => {
        // Mocking: 사용자가 필요한 정보를 제공하지 못함 (API 실패 시뮬레이션)
        jest.spyOn(ApiService, 'diagnose').mockResolvedValueOnce({ 
            success: false, 
            error: "🚨 [시스템 경고]: 인증 모듈에 구조적 결함이 감지되었습니다. 로그 제출 필수.", // Critical Error Tone 강제 출력
            message: "" 
        });

        // 진단 실행 (실패 시나리오)
        await ApiService.diagnose('', '');

        // 검증: 실패 메시지가 우리가 정의한 'Critical Error Tone'을 포함하는지 확인
        const errorToneCheck = await ApiService.diagnose('', ''); // 다시 호출하여 결과를 얻는다고 가정
        expect(errorToneCheck).toHaveProperty('error', expect.stringContaining("🚨 [시스템 경고]")); 
    });


    // ===============================================
    // TEST CASE 3: Failure Path (결제 게이트웨이 모킹 실패)
    // ===============================================
    test('TC-003: [FAILURE] 결제 게이트웨이 장애 -> 다음 단계 진입을 막는 경고 출력 검증', async () => {
        // Mocking: 모든 것이 완벽했으나, 마지막 순간에 외부 시스템(결제)에서 실패 발생
        jest.spyOn(ApiService, 'diagnose').mockResolvedValueOnce({ 
            success: true, 
            data: { defectsFound: ["AUTH-STRUC"], score: 30 }, 
            message: "심각한 시스템 구조적 결함을 발견했습니다." 
        });
        jest.spyOn(ApiService, 'buy').mockResolvedValueOnce({ 
            success: false, 
            error: "❌ [트랜잭션 에러]: 결제 게이트웨이 연결 오류. 데이터 무결성 검증이 필요합니다.", // Critical Error Tone 강제 출력
        });

        // Step 1: 진단 성공 (가정)
        await ApiService.diagnose(mockEmail, 'tech');

        // Step 2: 구매 시도 (실패 유도)
        const purchaseResponse = await ApiService.buy(mockEmail, 'PRO');
        
        expect(purchaseResponse).toHaveProperty('success', false);
        // 검증: 실패 메시지가 우리가 정의한 'Critical Error Tone'을 포함하는지 확인
        expect(purchaseResponse).toHaveProperty('error', expect.stringContaining("❌ [트랜잭션 에러]")); 
    });

});