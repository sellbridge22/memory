/**
 * @fileoverview Diagnosis State Transition Service Layer (Core Business Logic)
 * 진단 기록의 상태 변화를 시스템 레벨에서 강제하는 핵심 로직.
 * 외부 API 호출은 이 서비스 레이어를 통과해야 함.
 */

// --- [1] 타입 정의 및 상수 설정 ---

/** 
 * 모든 가능한 Diagnosis Record의 상태(State) 목록.
 * '상태 전이'가 일어나는 지점을 명확히 합니다.
 */
export enum DiagnosisStatus {
    INITIAL = "NEW_RECORD",      // 초기 진단 데이터 입력 직후 (최소 단계)
    DIAGNOSED = "ANALYSIS_COMPLETE", // 분석 완료, 위험 경고 표시 (진단 리포트 노출)
    REQUIRED_PATCH = "CRITICAL_DEFECT_FOUND", // 결함 발견, 패치 구매 강제 유도
    PAYMENT_PENDING = "WAITING_FOR_TRANSACTION", // 결제 대기 상태
    COMPLETED = "SYSTEM_CLEANSED"  // 최종 완료 및 시스템 정상화
}

/** 
 * API 호출 시 필요한 Request Body의 인터페이스.
 */
export interface TransitionInput {
    currentRecord: {
        id: string;
        status: DiagnosisStatus;
        data: any; // 진단 결과 데이터 (점수, 결함 리스트 등)
    };
    transitionPayload: {
        type: 'DIAGNOSTIC' | 'PAYMENT_SUCCESS' | 'MANUAL_UPDATE';
        payload?: Record<string, any>; // 전이 시 필요한 추가 데이터 (예: 결제 ID, 패치 버전)
    }
}

/** 
 * API 응답의 인터페이스. 성공/실패 여부를 명확히 합니다.
 */
export interface TransitionOutput {
    success: boolean;
    newStatus: DiagnosisStatus | null;
    message: string; // 사용자에게 보여줄 메시지 (경고톤 유지)
    updatedRecord?: any; // 상태 변경 후의 전체 레코드 데이터
}


// --- [2] 핵심 로직 구현: State Machine Engine ---

/** 
 * 주어진 진단 기록과 전이 페이로드를 기반으로 다음 상태를 결정하고,
 * 유효하지 않은 전이는 시스템 에러로 강제 거부합니다. (가장 높은 우선순위)
 * @param input TransitionInput - 현재 기록 및 요청 정보
 * @returns TransitionOutput - 새로운 상태와 메시지
 */
export function transitionDiagnosisState(input: TransitionInput): TransitionOutput {
    const { currentRecord, transitionPayload } = input;
    const currentState = currentRecord.status;

    let nextStatus: DiagnosisStatus | null = null;
    let message: string = "";
    let success = false;

    try {
        switch (currentState) {
            case DiagnosisStatus.INITIAL:
                if (transitionPayload.type === 'DIAGNOSTIC') {
                    // 1단계: 초기 진단 -> 분석 완료 상태 전이 로직
                    const defectCount = Object.keys(currentRecord.data).filter(key => currentRecord.data[key] === 'DEFECT').length;
                    if (defectCount > 0) {
                        nextStatus = DiagnosisStatus.REQUIRED_PATCH; // 결함 발견 시 바로 강제 전이
                        message = `🚨 [경고 코드: AUTH-STRUC] 치명적인 시스템 변칙성 ${defectCount}건을 감지했습니다. 패치가 필수입니다.`;
                    } else {
                        nextStatus = DiagnosisStatus.DIAGNOSED; // 결함 없음, 일단 진단 완료로 처리
                        message = "✅ 구조적 결함을 확인하지 못했지만, 추가 분석이 필요합니다.";
                    }
                } else {
                    // 유효하지 않은 전이 시도 (예: 초기 상태에서 바로 결제 요청)
                    throw new Error("Invalid State Transition Attempt. 다음 단계로 진입하기 위한 필수 진단 과정을 먼저 거쳐야 합니다.");
                }
                break;

            case DiagnosisStatus.REQUIRED_PATCH:
                if (transitionPayload.type === 'PAYMENT_SUCCESS') {
                    // 2단계: 결제 완료 -> 대기 상태 전이 로직
                    nextStatus = DiagnosisStatus.PAYMENT_PENDING;
                    message = `⚙️ 패치 프로세스가 시작되었습니다. 시스템 재구축에 시간이 필요합니다.`;
                } else {
                     throw new Error("Payment must be successful to proceed. Please complete the transaction via the secured gateway.");
                }
                break;

            case DiagnosisStatus.PAYMENT_PENDING:
                 if (transitionPayload.type === 'MANUAL_UPDATE' && transitionPayload.payload?.success) {
                    // 3단계: 시스템 패치 완료 -> 최종 정상화 상태 전이 로직
                    nextStatus = DiagnosisStatus.COMPLETED;
                    message = "✨ 모든 구조적 결함이 수정되었으며, 시스템은 안정화되었습니다.";
                } else if (transitionPayload.type !== 'MANUAL_UPDATE') {
                     throw new Error("Invalid Action: Only manual confirmation can advance the state from PENDING.");
                 }
                break;

            case DiagnosisStatus.DIAGNOSED | DiagnosisStatus.COMPLETED:
                // 이미 끝난 상태에서 무리한 전이를 시도하는 경우 (예외 처리)
                throw new Error(`System State Lockout: Current status (${currentState}) prevents further transitions.`);
        }

        if (nextStatus && nextStatus !== currentState) {
            success = true;
            message += `\n[INFO] 성공적으로 '${DiagnosisStatus[Object.keys(DiagnosisStatus).find(key => DiagnosisStatus[key] === nextStatus)]}' 상태로 전이합니다.`;
        }

    } catch (e: any) {
        // 🚨 시스템 레벨 예외 처리 블록 (가장 중요)
        success = false;
        const errorMsg = e.message || "Unknown System Error.";
        if (!errorMsg.includes("Invalid State Transition Attempt") && !errorMsg.includes("System State Lockout")) {
            // 우리가 정의한 경고 톤을 유지하며 에러 메시지 재구성
            return { success: false, newStatus: null, message: `🛑 [ERROR CODE: ${Math.floor(Math.random() * 1000)}] 시스템 오류 발생. 원인: 구조적 전이 경로가 유효하지 않습니다. 상세 내용: ${errorMsg}` };
        } else {
            return { success: false, newStatus: null, message: `🛑 [SYSTEM FAILURE] ${errorMsg}` };
        }
    }

    // 최종 성공 반환 구조체 구성
    const updatedRecord = { ...currentRecord, status: nextStatus || currentState, data: currentRecord.data };

    return { 
        success: success, 
        newStatus: nextStatus, 
        message: message, 
        updatedRecord: updatedRecord 
    };
}

// --- [3] 예시 사용법 및 테스트 (테스트 코드를 주석 처리) ---
/*
const initialData = { id: "user-123", status: DiagnosisStatus.INITIAL, data: { A: 'OK', B: 'DEFECT' } };

console.log("--- 🧪 Test Case 1: 정상적인 결함 발견 -> 전이 시도 ---");
let result1 = transitionDiagnosisState({ currentRecord: initialData, transitionPayload: { type: 'DIAGNOSTIC' } });
// console.log(result1); // 예상: REQUIRED_PATCH로 성공

console.log("\n--- 🧪 Test Case 2: 초기 상태에서 결제 요청 시도 (실패 예시) ---");
let result2 = transitionDiagnosisState({ currentRecord: initialData, transitionPayload: { type: 'PAYMENT_SUCCESS' } });
// console.log(result2); // 예상: 시스템 에러 코드 반환

console.log("\n--- 🧪 Test Case 3: 이미 완료된 상태에서 진단 시도 (실패 예시) ---");
let finishedData = { id: "user-124", status: DiagnosisStatus.COMPLETED, data: {} };
let result3 = transitionDiagnosisState({ currentRecord: finishedData, transitionPayload: { type: 'DIAGNOSTIC' } });
// console.log(result3); // 예상: System State Lockout 에러 반환
*/

export default {
    transitionDiagnosisState
};