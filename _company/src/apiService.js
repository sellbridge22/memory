/**
 * @fileoverview 백엔드 API 호출을 모킹하는 서비스 계층. 모든 상태 전이와 비즈니스 로직의 핵심이 여기에 정의되어야 합니다.
 * 진단 결과, 사용자 상태 업데이트, 구매 시도 등 모든 트랜잭션은 이곳에서 Mocking되고 검증됩니다.
 */

const CRITICAL_ERROR_TONE = {
    AUTH: "🚨 [시스템 경고]: 인증 모듈에 구조적 결함이 감지되었습니다. 로그 제출 필수.",
    PAYMENT: "❌ [트랜잭션 에러]: 결제 게이트웨이 연결 오류. 데이터 무결성 검증이 필요합니다.",
    GENERAL: "⚠️ [경고]: 시스템 상태가 불안정합니다. 진단 과정 재시도가 필요합니다."
};

/**
 * 1. 자가진단 시뮬레이션 및 결과 반환 (Diagnosis State -> Result State)
 * @param {string} email - 사용자 이메일 주소
 * @param {string} jobSector - 직무 분야
 * @returns {Promise<{success: boolean, data: object, error?: string}>} 진단 결과를 포함한 응답 객체
 */
export const simulateDiagnosis = async (email, jobSector) => {
    console.log(`[API Call] Starting diagnosis for ${email}...`);
    await new Promise(resolve => setTimeout(resolve, 1500)); // 네트워크 지연 시뮬레이션

    // 가상의 복잡한 비즈니스 로직 검증
    if (!email || !jobSector) {
        return { success: false, error: CRITICAL_ERROR_TONE.AUTH };
    }

    // 85% 확률로 'Critical Defect' 발견 시뮬레이션 (구매 유도 강제)
    const isDefective = Math.random() < 0.85;
    let diagnosisData = { score: Math.floor(Math.random() * 100), defectsFound: [] };

    if (isDefective && jobSector === 'tech') {
        diagnosisData.defectsFound.push("AUTH-STRUC"); // 핵심 결함 코드 주입
        return { success: true, data: diagnosisData, message: "심각한 시스템 구조적 결함을 발견했습니다." };
    } else if (isDefective) {
         // 다른 유형의 결함이 발견되었지만, PRO Kit로 연결되는 임계점 근처에 있음.
        diagnosisData.defectsFound.push("METRIC-ANOMALY"); 
        return { success: true, data: diagnosisData, message: "진단 점수가 기준치 이하입니다. 추가 검증이 필요합니다." };
    } else {
        // 정상 범위 (구매 유도 실패 지점)
        return { success: true, data: diagnosisData, message: "현재는 시스템적으로 큰 결함은 감지되지 않았습니다. 주기적 점검을 권장합니다." };
    }
};

/**
 * 2. PRO Kit 구매 시도 (Result State -> Paid State 또는 Failure State)
 * @param {string} email - 사용자 이메일
 * @param {'PRO'|'ENTERPRISE'} tierId - 선택한 등급
 * @returns {Promise<{success: boolean, transactionId?: string, error?: string}>} 구매 결과를 포함한 응답 객체
 */
export const attemptPurchase = async (email, tierId) => {
    console.log(`[API Call] Attempting purchase for ${tierId} kit...`);
    await new Promise(resolve => setTimeout(resolve, 2000)); // 결제 처리 지연 시뮬레이션

    // 가상의 결제 성공/실패 로직 구현 (Mock Payment Gateway)
    const isPaymentSuccessful = Math.random() > 0.1; // 90% 성공률 가정

    if (!isPaymentSuccessful) {
        return { success: false, error: CRITICAL_ERROR_TONE.PAYMENT };
    }

    // 상태 전이 강제 기록 (UserStateService 호출 시뮬레이션)
    console.log(`[API Success] User state updated to ${tierId} paid.`);
    
    return { 
        success: true, 
        transactionId: `TX-${Date.now()}-${Math.random().toFixed(0)}`,
        message: `${tierId} PRO Kit 구매가 완료되었습니다. 시스템 권한이 활성화됩니다.`
    };
};

/**
 * 모든 API 호출을 통합 관리하는 객체
 */
export const ApiService = {
    diagnose: simulateDiagnosis,
    buy: attemptPurchase
};