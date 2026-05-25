/**
 * @fileoverview Structural Defect Detection Service.
 * 사용자 입력 기반으로 시스템 상태 변화(State Machine)와 결함 여부를 진단합니다.
 */

const { processPayment, updateUserStatus, ERROR_CODES } = require('./mockPaymentProcessor');

// === State Machine 정의 ===
// 1. Initial Scan -> Diagnosis (T1 완료 지점)
// 2. Diagnosis -> Warning/Upgrade Prompt (T2 유도)
// 3. Payment Attempt -> Final Status Update (T3 완료)

/**
 * @description T1 진단 스캔을 수행하고, 구조적 결함 존재 여부를 판단합니다.
 * @param {string} email - 사용자 이메일
 * @param {string} jobSector - 직무 분야
 * @param {string[]} scanResults - 진단 결과 리스트 (예: ['A1', 'B3'])
 * @returns {{isCriticalDefect: boolean, defectCode?: string, message: string}}
 */
const runInitialScan = (email, jobSector, scanResults) => {
    console.log(`\n--- 🔎 [STATE 1/3: Initial Scan] 스캔 시작...`);

    // 가상의 복잡한 로직을 통해 결함을 감지한다고 가정합니다.
    if (!scanResults || scanResults.length < 2) {
        return { isCriticalDefect: false, message: "진단 결과가 충분하지 않아 구조적 문제는 발견되지 않았습니다." };
    }

    // 임의 로직: 'A1'과 'B3'이 모두 포함되어 있으면 심각한 결함으로 간주
    if (scanResults.includes("A1") && scanResults.includes("B3")) {
        console.warn(`🚨 [DEFECT FOUND] A1 & B3 조합 감지: CRITICAL Structural Flaw.`);
        return { 
            isCriticalDefect: true, 
            defectCode: 'AUTH-STRUC', // 구조적 오류 코드
            message: "경고: 진단 결과가 시스템의 알려진 취약점(Structural Flaws)과 일치합니다. 이는 사용자의 노력 부족 문제가 아닌, 시스템 자체의 결함입니다."
        };
    }

    return { isCriticalDefect: false, message: "현재로서는 치명적인 구조적 결함은 발견되지 않았습니다. 하지만 지속적인 모니터링이 필요합니다." };
};


/**
 * @description T2 단계 진입: 사용자에게 패치 구매를 유도하고 Payment 프로세스를 시도합니다.
 * @param {string} email - 사용자 이메일
 * @param {string} defectCode - 발견된 결함 코드
 * @returns {{success: boolean, message: string}}
 */
const attemptPatchPurchase = async (email, defectCode) => {
    console.log(`\n--- ⚠️ [STATE 2/3: Warning & Upgrade] 패치 구매 유도 시작...`);

    // PRO Tier의 가격을 사용합니다. (₩19,900 가정)
    const PRO_PRICE = 19900; 

    try {
        // ⚡️ Payment Gateway 호출 (모킹된 API 호출)
        const paymentResult = await processPayment(email, PRO_PRICE);

        if (!paymentResult.success) {
            return { success: false, message: `결제 실패: ${paymentResult.code} (${paymentResult.code === 'AUTH-401' ? '카드 거절 또는 유효성 오류입니다.' : '시스템 인프라 문제입니다. 나중에 다시 시도해 주세요.'})` };
        }

        // 3. 최종 상태 업데이트 (T3 완료)
        const statusMessage = `PRO_${defectCode}_ACTIVE`;
        updateUserStatus(email, statusMessage);

        return { success: true, message: "패치가 성공적으로 적용되었습니다. 시스템 안정화가 확인됩니다." };

    } catch (error) {
        // API 호출 중 치명적인 예외 발생 시 처리
        console.error(`❌ [FATAL ERROR] State 2/3에서 예외 포착:`, error.message);
        return { success: false, message: `시스템 오류 발생: ${error.message}. 관리자에게 문의가 필요합니다.` };
    }
};


/**
 * @description 전체 진단 워크플로우를 실행하는 메인 함수 (E2E 시뮬레이션).
 * @param {object} userData - 사용자 데이터 객체
 */
const runFullDiagnosisFlow = async (userData) => {
    if (!userData || !userData.email) {
        throw new Error("INPUT_VALIDATION: 이메일 주소가 필수입니다.");
    }

    // 1. 초기 스캔 수행 및 결함 감지
    const scanResult = runInitialScan(userData.email, userData.jobSector, userData.scanResults);

    if (!scanResult.isCriticalDefect) {
        return { finalStatus: 'PASS', message: scanResult.message };
    }

    // 2. 결함 발견 시 경고 및 패치 구매 유도
    const patchResult = await attemptPatchPurchase(userData.email, scanResult.defectCode);
    
    if (patchResult.success) {
        return { finalStatus: 'PAST', message: patchResult.message };
    } else {
        // 결제 실패 시에도 최종 상태를 명확히 안내해야 함.
        console.warn("⚠️ [FALLBACK] 패치 구매 실패로 인해 사용자를 대기/재시도 페이지로 유도합니다.");
        return { finalStatus: 'FAIL', message: `[필수 조치 필요] ${patchResult.message}` };
    }
};


module.exports = {
    runFullDiagnosisFlow,
    // 테스트용으로 개별 함수 export
    runInitialScan, 
    attemptPatchPurchase
};