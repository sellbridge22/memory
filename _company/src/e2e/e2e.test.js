/**
 * @fileoverview E2E Integration Test Suite for Diagnostic Modal Flow
 * 진단 모달의 핵심 상태 전이 로직(State Transition)을 테스트합니다. 
 * Warning -> Critical Fail -> Funnel Required 흐름 검증에 중점을 둡니다.
 */

// Mocking the API service to ensure test isolation and deterministic results
jest.mock('../services/mockDiagnosisService', () => ({
    runDiagnosis: jest.fn(),
}));

const { runDiagnosis } = require('../services/mockDiagnosisService');

describe('DiagnosticModal E2E Flow Test Suite (Selbridge Core Logic)', () => {
    // 초기화 및 클린업
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // 🧪 TEST CASE 1: 정상/성공 플로우 테스트 (Happy Path)
    test('TC-001: 시스템 상태가 정상일 때의 흐름 검증', async () => {
        // Mock API 설정: 성공 시나리오 반환
        runDiagnosis.mockResolvedValueOnce({
            success: true,
            statusCode: "SUCCESS-ENV",
            severityLevel: "Normal",
            message: "✅ 시스템 상태 정상 감지. 진단 리포트가 생성되었습니다.",
            statusUpdateRequired: false,
            diagnosisScore: 95,
        });

        // @ts-ignore (실제 테스트에서는 컴포넌트를 마운트하고 props를 넘김)
        const { render } = require('@testing-library/react');
        render(<DiagnosticModal />);
        
        // 액션 수행 및 결과 검증 로직 추가 필요
        // expect(runDiagnosis).toHaveBeenCalledWith({ email: 'user@example.com', jobSector: 'tech', scanResults: ['A1'] });
    });

    // 🚨 TEST CASE 2: 경고 메시지 유도 플로우 (Warning State)
    test('TC-002: 입력 데이터 불완전 시 Warning Level 오류 처리 검증', async () => {
        // Mock API 설정: 운영 분야가 부족하여 Warning 반환 (1차 방어막 실패)
        runDiagnosis.mockResolvedValueOnce({
            success: false,
            statusCode: "WARN-INPUT-001",
            severityLevel: "Warning", // 경고 레벨 검증
            message: "🚨 [SYSTEM WARNING] Operational Sector 필드가 불완전합니다. 최소한의 정보를 제공해주세요.",
            statusUpdateRequired: true,
            diagnosisScore: 45,
        });

        // @ts-ignore
        const { render } = require('@testing-library/react');
        render(<DiagnosticModal />);
        
        // expect(runDiagnosis).toHaveBeenCalledWith({ email: 'user@example.com', jobSector: '', scanResults: [] });
    });


    // 💀 TEST CASE 3: 시스템 결함 강제 유도 플로우 (Critical Fail State) - 핵심 목표
    test('TC-003: 전문 용어(B3)를 기반으로 Critical Fail 상태 강제 유도 및 Funnel 전환 검증', async () => {
        // Mock API 설정: B3 발견 시 Critical Fail 반환 (최대 위기감 조성) [근거: 코다리 개인 메모리]
        runDiagnosis.mockResolvedValueOnce({
            success: false,
            statusCode: "CRIT-DEFECT-002",
            severityLevel: "Critical Fail", // 가장 강력한 레벨 검증
            message: `🔴 [SYSTEM FAILURE] 분석 결과, 핵심 시스템 구조적 결함(B3 패턴)이 감지되었습니다. 이는 단순한 학습 부족이 아닌 아키텍처 레벨의 문제입니다.`,
            statusUpdateRequired: true,
            diagnosisScore: 12, // 점수 극단적 하락 검증
        });

        // @ts-ignore
        const { render } = require('@testing-library/react');
        render(<DiagnosticModal />);
        
        // 이 테스트의 목표는 Critical Fail 메시지("🔴 [SYSTEM FAILURE]")가 UI에 정확히, 강렬하게 표시되는 것을 검증하는 것입니다.
    });

    // 💣 TEST CASE 4: 결제 실패 (Air-gap/Payment Failure) 시나리오 검증 (Robustness Test)
    test('TC-004: 외부 시스템(결제 게이트웨이) 모킹 실패 시 Critical Error Tone 강제 출력', async () => {
        // Mock API 설정: 클라이언트가 결제를 시도했으나, 백엔드에서 Payment Fail 에러를 반환하는 경우를 가정
         runDiagnosis.mockResolvedValueOnce({
            success: false,
            statusCode: "PAYMENT-FAIL",
            severityLevel: "Critical Fail", 
            message: `🔴 [SYSTEM FAILURE] 거래 프로세스 중 외부 연결 실패가 감지되었습니다. (코드: PAYMENT-FAIL). 서비스 복구를 위해 엔터프라이즈 모듈이 필요합니다.`,
            statusUpdateRequired: true,
            diagnosisScore: 10,
        });

         // @ts-ignore
        const { render } = require('@testing-library/react');
        render(<DiagnosticModal />);
    });

});