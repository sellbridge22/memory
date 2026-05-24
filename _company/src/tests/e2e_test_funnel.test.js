describe('E2E State Transition Funnel Test Suite (Diagnosis to Purchase)', () => {
    // Mock Dependencies setup
    jest.mock('../services/stateEngine', () => ({ 
        updateUserStatus: jest.fn(), 
        getCurrentState: jest.fn() 
    }));
    jest.mock('../api/paymentGateway', () => ({
        processPayment: jest.fn(),
        // Mock Defect Severity Measurement Service를 포함하여 사용합니다.
        measureDefectSeverity: jest.fn(() => Promise.resolve({ severityScore: 85, defectCode: 'AUTH-STRUC' }))
    }));

    const { stateEngine } = require('../services/stateEngine');
    const { measureDefectSeverity } = require('../api/paymentGateway');

    // --- TEST CASE 1: [성공 경로] Free Diagnosis -> Critical Defect 발견 -> PRO 구매 성공 (Happy Path) ---
    test('TC1: Successful transition from FREE diagnosis to PRO purchase using measured defect data', async () => {
        // GIVEN: 사용자가 무료 진단을 완료하고, 모달이 호출됨.
        stateEngine.getCurrentState.mockReturnValue('FREE_DIAGNOSIS_COMPLETE');
        measureDefectSeverity.mockResolvedValueOnce({ severityScore: 92, defectCode: 'CRITICAL-DEFECT' });

        // WHEN: 사용자가 PRO 패키지를 선택하고 결제를 시도함 (Mocked API 호출).
        const transactionResult = await require('../api/paymentGateway').processPayment('PRO');

        // THEN: 시스템은 다음 상태로 강제 전이되어야 함.
        expect(stateEngine.updateUserStatus).toHaveBeenCalledWith({ 
            newState: 'PAID_PRO', 
            sourceDefect: 'CRITICAL-DEFECT' 
        });
        expect(transactionResult).toEqual({ success: true, message: "System Patch Applied." });
    });

    // --- TEST CASE 2: [경고] Free Diagnosis -> 낮은 심각도 (Minor) 발견 -> Pro 유도 실패 및 재진단 권유 ---
    test('TC2: Low severity defect detected, fails to convert user to paid status.', async () => {
        // GIVEN: 사용자가 무료 진단을 완료했으나, 결함 심각도가 낮음.
        stateEngine.getCurrentState.mockReturnValue('FREE_DIAGNOSIS_COMPLETE');
        measureDefectSeverity.mockResolvedValueOnce({ severityScore: 35, defectCode: 'MINOR-ANOMALY' });

        // WHEN: 사용자에게 결제 CTA를 제시하지만, 사용자가 다음 액션을 취하지 않음.
        const initialStatus = await stateEngine.getCurrentState();

        // THEN: 상태는 PAID로 전환되지 않고, 재진단(Free Re-scan)을 유도하는 상태에 머물러야 함.
        expect(stateEngine.updateUserStatus).not.toHaveBeenCalledWith({ newState: expect.any(String), sourceDefect: expect.anything() });
        expect(initialStatus).toBe('FREE_DIAGNOSIS_COMPLETE'); // 상태 고정 확인
    });

    // --- TEST CASE 3: [실패] 필수 입력값 누락 (System Input Validation Failure) ---
    test('TC3: User input validation fails at the defect severity modal.', async () => {
        // GIVEN: 사용자가 모달에서 필수로 요구되는 데이터를 입력하지 않음.
        const mockError = new Error("Missing required data for structural assessment.");

        // WHEN: 상태 전이 로직이 트리거되지만, 유효성 검사(Validation)가 실패함.
        await expect(async () => { 
            await stateEngine.updateUserStatus({ newState: 'PAID_PRO', sourceDefect: 'DUMMY' }); 
        }).rejects.toThrow("Structural assessment failed."); // Custom Error Class 가정

        // THEN: 사용자에게 경고 모달이 표시되고, 상태는 어떠한 변화도 없어야 함.
        expect(stateEngine.updateUserStatus).not.toHaveBeenCalled();
    });


    // --- TEST CASE 4: [실패] 결제 게이트웨이 외부 오류 (External Payment Failure) ---
    test('TC4: Payment processing fails due to external gateway error (e.g., bank reject)', async () => {
        // GIVEN: 사용자가 PRO를 구매하려 시도했으나, 외부 PG에서 트랜잭션 실패 코드를 받음.
        require('../api/paymentGateway').processPayment.mockRejectedValue(new Error("PAYMENT-FAIL: Transaction Declined"));

        // WHEN: 결제 프로세스를 시도함.
        const transactionResult = await require('../api/paymentGateway').processPayment('PRO');

        // THEN: 상태는 PAID로 전환되지 않으며, 오류 코드를 포함한 재시도 CTA가 표시되어야 함.
        expect(stateEngine.updateUserStatus).not.toHaveBeenCalled();
        expect(transactionResult).toEqual({ success: false, errorCode: "PAYMENT-FAIL" });
    });

    // --- TEST CASE 5: [보안] 비정상적인 상태 전이 시도 (State Bypass Attempt) ---
    test('TC5: Attempts to bypass the state engine directly must be rejected.', async () => {
        // GIVEN: 외부 로직에서 강제로 상태를 'PAID_ENTERPRISE'로 변경하려 함.
        const initialStatus = 'FREE_DIAGNOSIS_COMPLETE';

        // WHEN: State Engine을 우회하여 직접 업데이트 시도 (이 경우, stateEngine 내부의 Guard가 작동해야 함).
        await expect(stateEngine.updateUserStatus({ newState: 'PAID_ENTERPRISE', sourceDefect: 'MANUAL' }))
            .rejects.toThrow('State Transition Forbidden');

        // THEN: 시스템은 원본 상태를 유지하고, 403 Forbidden 에러 메시지를 반환해야 함.
        expect(stateEngine.updateUserStatus).toHaveBeenCalledTimes(1); // 호출은 되었으나 실패했음을 확인
    });
});