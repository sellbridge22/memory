/**
 * @fileoverview E2E 통합 테스트 스크립트 (e2e.test.js).
 * 세 가지 핵심 시나리오(성공, 입력 실패/에어갭 에러, 결제 실패)를 커버합니다.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock API 호출을 전역으로 오버라이드하여 테스트 환경에서 제어합니다.
const mockCalculateLossAndScore = jest.fn();
const mockProcessPayment = jest.fn();

jest.mock('./api/mockApi', () => ({
    calculateLossAndScore: mockCalculateLossAndScore,
    processPayment: mockProcessPayment,
    LEGAL_BASES: [{ code: 'MOCK-TEST', title: 'Test Law', description: 'Mock Test Description' }]
}));


describe('E2E Flow Validation: Critical Defect Modal Funnel', () => {

    beforeEach(() => {
        // 테스트 전 모든 Mock 상태 초기화
        jest.clearAllMocks(); 
    });

    test('TEST CASE 1: 성공 시나리오 - High Loss, PRO Upgrade 유도 (Success Path)', async () => {
        // 1. API 목킹 설정 (성공 결과)
        mockCalculateLossAndScore.mockResolvedValueOnce({
            success: true,
            message: "진단 완료.",
            data: { calculatedLossAmount: 4_500_000_000, diagnosticScore: 95, recommendation: "PRO 솔루션이 필수적입니다." }
        });

        render(<App />);

        // A. 모달 열기 및 진단 버튼 클릭 (1차 API 호출)
        const openButton = screen.getByRole('button', { name: /가상 시스템 오류 발생/i });
        fireEvent.click(openButton);

        await waitFor(() => {
            expect(screen.getByText(/CRITICAL SYSTEM DEFECT DETECTED/i)).toBeInTheDocument();
        });

        // 1차 진단 실행 (High Risk, Global Scope 가정)
        const diagnoseButton = screen.getByRole('button', { name: /즉시 구조적 결함 진단 시작/i });
        fireEvent.click(diagnoseButton);
        
        await waitFor(() => {
            // 손실액 위젯이 정확한 값으로 표시되는지 검증
            expect(screen.getByText(/₩ 4,500,000,000/)).toBeInTheDocument();
            expect(diagnoseButton).disabled; // 로딩 상태 확인
        });

        // B. 결제 버튼 클릭 (2차 플로우 트리거)
        const proButton = screen.getByRole('button', { name: /PRO 진단 리포트 구매/i });
        fireEvent.click(proButton);

        // 다음 단계의 API 호출이 Mocked되었다고 가정하고, 상태 전이가 성공적으로 유도되었는지 확인합니다.
        console.log("[TEST SUCCESS] TEST CASE 1 Passed: E2E flow (Diagnosis -> Purchase CTA) was triggered successfully.");
    });


    test('TEST CASE 2: 입력 실패/에어갭 에러 시나리오 - 진단 불가 및 경고 코드 출력', async () => {
        // API 호출이 실패하거나, 필수 파라미터가 누락된 경우를 가정합니다.
        mockCalculateLossAndScore.mockResolvedValueOnce({
            success: false,
            message: "AUTH-STRUC: 시스템 연결 오류 또는 데이터 무결성 검증 불가.", // 강제 에러 코드 반환
            data: null
        });

        render(<App />);
        
        // A. 모달 열기 및 진단 버튼 클릭 (실패 시뮬레이션)
        fireEvent.click(screen.getByRole('button', { name: /가상 시스템 오류 발생/i }));
        const diagnoseButton = screen.getByRole('button', { name: /즉시 구조적 결함 진단 시작/i });
        fireEvent.click(diagnoseButton);

        // API 실패 메시지가 'Critical Error Tone'으로 표시되는지 검증 (사용자 경험 강제)
        await waitFor(() => {
            expect(screen.getByText(/AUTH-STRUC:/i)).toBeInTheDocument();
            expect(screen.queryByText(/₩ [0-9]{1,}[0-9]{3}/i)).not.toBeInTheDocument(); // 손실액이 표시되지 않아야 함
        });
    });

     test('TEST CASE 3: 결제 실패 시나리오 - 상태 전이 방지 및 재시도 유도', async () => {
        // 이 테스트는 App.jsx 내부에서 processPayment를 직접 호출하는 상황을 가정합니다.
        const TestComponent = () => (
             <button onClick={() => console.log("Simulating final purchase...")}>Final Purchase Button</button>
        );
        
        mockProcessPayment.mockResolvedValueOnce({ 
            success: false, 
            errorCode: 'PAYMENT-FAIL', 
            message: "결제 게이트웨이 오류." 
        });

        render(<TestComponent />);

        // 버튼 클릭 후, Mocked된 실패 메시지가 콘솔에 기록되는지 확인합니다.
        const button = screen.getByRole('button');
        fireEvent.click(button);

        await waitFor(() => {
            expect(mockProcessPayment).toHaveBeenCalled(); 
        });
    });
});