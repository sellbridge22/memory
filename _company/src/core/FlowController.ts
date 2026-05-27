/**
 * @fileoverview System State Machine Orchestrator for Sellbridge Funnel.
 * 이 컨트롤러는 사용자 여정(User Journey)의 모든 상태 전이를 관리하며,
 * 비즈니스 로직과 시스템적 결함 경고를 강제하는 핵심 게이트 역할을 합니다.
 */

export type FlowState = 'INITIAL' | 'DIAGNOSIS_START' | 'CRITICAL_WARNING' | 'SOLUTION_PRESENTATION' | 'GAP_MODAL' | 'PURCHASED' | 'FAILURE';

interface UserData {
    email: string;
    jobSector: string;
    scanResults: string[];
    timestamp: number;
}

/**
 * State Machine의 전역 상태를 관리합니다.
 */
class FlowController {
    private currentState: FlowState = 'INITIAL';
    public state: FlowState get() { return this.currentState; }
    
    constructor(initialData: UserData) {
        // 초기 진단 데이터를 기반으로 시작 상태 설정
        this.transitionTo('DIAGNOSIS_START', initialData);
    }

    /**
     * 시스템의 상태를 변경하고, 이에 따른 액션 및 로직을 실행합니다.
     * @param newState - 목표로 하는 새로운 FlowState
     * @param payload - 상태 전이 시 필요한 추가 데이터 (예: API 응답)
     */
    public transitionTo(newState: FlowState, payload?: any): void {
        console.log(`[FLOW_CONTROL] State Transition: ${this.currentState} -> ${newState}`);
        this.currentState = newState;

        switch (newState) {
            case 'DIAGNOSIS_START':
                // 1단계: 데이터 수집 및 초기 진단 실행 (API 호출 필요)
                console.log("[SYSTEM] Running initial diagnosis check...");
                break;
            case 'CRITICAL_WARNING':
                // 2단계: 구조적 결함 발견 - 불안감 증폭 단계
                this.triggerCriticalWarning(payload);
                break;
            case 'SOLUTION_PRESENTATION':
                // 3단계: 해결책 제시 (PRO 티어 진입)
                console.log("[SYSTEM] Solution presented. User must acknowledge defect.");
                break;
            case 'GAP_MODAL':
                // 4단계: 경계 모달 강제 유도 - 핵심 수익화 로직 실행
                this.handleGapModuleEnforcement(payload); // <-- 가장 중요한 게이트
                break;
            case 'PURCHASED':
                // 5단계: 구매 완료 및 상태 업데이트 기록
                console.log("[SYSTEM] Transaction successful. Updating user status in backend.");
                break;
            case 'FAILURE':
                // 실패 케이스 처리 (예: 네트워크 에러, 인증 실패)
                console.error("[FATAL_ERROR] System flow failed. Check logs for details.");
                break;
            default:
                break;
        }
    }

    /**
     * 진단 과정에서 임계치를 넘었을 때의 경고 로직 (디자인 스펙 반영)
     */
    private triggerCriticalWarning(payload: any): void {
        const defectLevel = payload?.diagnosisScore || 0;
        if (defectLevel > 75) {
            // Critical Error Tone 적용 및 UI 컴포넌트 활성화 로직 호출
            console.warn(`[ALERT] CRITICAL DEFECT DETECTED: ${payload.structuralDefectCode}. Displaying 'System Failure' modal.`);
            // 실제로는 Designer의 Modal Component를 띄우는 함수가 여기에 연결됩니다.
        } else {
             console.log("[INFO] Defect level is manageable. Proceeding to basic solution suggestion.");
        }
    }

    /**
     * [핵심 게이트] 경계 모달 로직: PRO 구매 직후, Gap Product 구매를 강제합니다.
     * @param payload - 현재 상태 정보 및 결제 시도 결과
     */
    private handleGapModuleEnforcement(payload: any): void {
        const attemptedTier = payload?.selectedTierId;

        if (attemptedTier === 'PRO') {
            console.log(`[GAP_MODULE] Detected PRO purchase attempt. Checking for structural gap.`);
            
            // 1. Gap Module 필요성 검증 로직 실행
            const requiredGapCode = this.checkStructuralGaps(payload);

            if (requiredGapCode) {
                console.error(`[ERROR: ${requiredGapCode}] 시스템 아키텍처에 심각한 결함이 있습니다. PRO만으로는 해결 불가합니다.`);
                // 2. 강제 모달 표시 및 ENTERPRISE 티어 유도 (진단 서비스 재필요)
                this.transitionTo('GAP_MODAL', { requiredGapCode, suggestedTier: 'ENTERPRISE' });
            } else {
                console.log("[INFO] No critical gap detected. Allowing PRO purchase.");
                this.transitionTo('SOLUTION_PRESENTATION'); // 정상적으로 진행 허용 (매우 드문 경우)
            }
        } else if (attemptedTier === 'ENTERPRISE') {
             // ENTERPRISE는 Gap Product이므로 이 단계에서 바로 구매 가능해야 함.
             console.log("[INFO] Enterprise Tier selected. Proceeding to final payment.");
        }
    }

    /**
     * 구조적 결함 여부를 판단하는 Mock API 호출 (실제 백엔드 로직과 연동)
     */
    private checkStructuralGaps(payload: any): string | null {
        // 이 부분은 실제 backend /api/check_gap_defects 엔드포인트와 통신해야 합니다.
        if (Math.random() > 0.5 && payload?.structuralDefectCode) {
            return `AUTH-STRUC-${payload.structuralDefectCode}`; // 결함 코드를 이용해 Gap ID 생성
        }
        return null;
    }

    // ... 기타 상태 전이 로직 (예: reset(), getHistory() 등 추가 가능)
}

export default FlowController;