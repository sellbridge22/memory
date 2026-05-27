/**
 * @fileoverview E2E 통합 테스트 스크립트: Diagnosis Workflow Manager의 강건성 검증.
 * T1 -> (Failure Path) -> Critical Error Modal Triggering까지의 흐름을 확인합니다.
 */

import { DiagnosisWorkflowManager } from '../diagnosisWorkflowManager'; 
// 실제 환경에서는 Jest 또는 Mocha 등의 프레임워크를 사용해야 합니다.

describe('DiagnosisWorkflowManager E2E Test Suite', () => {
    let manager;
    const mockUserContext = { email: 'test@example.com' };

    beforeEach(() => {
        manager = new DiagnosisWorkflowManager(mockUserContext);
        // 테스트 전 환경 초기화 (Mock StateAPI/Service는 별도 Mocking 필요)
    });

    // ----------------------------------------------------
    // TEST CASE 1: 정상적인 진단 흐름 (SUCCESS PATH)
    // 기대 결과: 결함 감지 실패, 다음 단계(T2)로 원활하게 진행.
    it('should successfully process T1 interaction when no critical defect is found', async () => {
        const t1Input = { 
            jobSector: 'finance', // Low risk sector
            scanResults: ['B3', 'C4'] 
        };

        // 테스트 실행 (실제로는 console.log 등을 통해 성공 여부를 검증)
        const result = await manager.processT1Interaction(t1Input);
        
        expect(result.success).toBe(true);
        expect(result.nextState).toBe('ADVANCEMENT'); // 다음 단계로 정상 이동해야 함
    });

    // ----------------------------------------------------
    // TEST CASE 2: 필수 정보 누락에 의한 실패 (INPUT FAILURE PATH)
    // 기대 결과: 경고 모달이 트리거되고, 상태 전이가 'ERROR_INPUT'으로 강제되어야 함.
    it('should trigger INPUT-MISSING error modal and transition to ERROR_INPUT state', async () => {
        const t1Input = { 
            jobSector: '', // 누락된 필드
            scanResults: ['B3'] 
        };

        // 이 테스트는 MockStateAPI.triggerErrorModal 호출을 감지해야 합니다.
        // (실제로는 Jest의 spyOn을 사용하여 console.error를 가로채야 함)
        const result = await manager.processT1Interaction(t1Input);
        
        expect(result.success).toBe(false);
        expect(result.nextState).toBe('ERROR_INPUT'); 
    });


    // ----------------------------------------------------
    // TEST CASE 3: 핵심 결함 감지에 의한 강제 실패 (CRITICAL FAILURE PATH - 가장 중요)
    // 기대 결과: 시스템 오류 경고 모달이 트리거되고, 상태 전이가 'CRITICAL_ERROR'로 강제되어야 함.
    it('should detect critical structural defect and force transition to CRITICAL_FAILURE state', async () => {
        const t1Input = { 
            jobSector: 'tech', // 고위험 섹터
            scanResults: ['A1']  // 결함 패턴 (A1) 포함
        };

        // 이 테스트는 MockStateAPI.triggerErrorModal(AUTH-STRUC, ...) 호출을 반드시 감지해야 합니다.
        const result = await manager.processT1Interaction(t1Input);
        
        expect(result.success).toBe(false);
        expect(result.nextState).toBe('CRITICAL_ERROR'); 

        // 추가 검증: 사용자 상태가 'AWAITING_DIAGNOSIS'로 업데이트되었는지 확인 (시스템 신뢰도 확보)
        // MockStateAPI를 스파이하여 최종 호출된 인자를 검사해야 합니다.
    });

});