/**
 * @fileoverview System Diagnostic API Mock Service
 * 실제 백엔드 역할을 수행하며, 사용자의 입력 데이터(전문 용어)를 분석하여 
 * 구조적 결함 레벨 및 강제 상위 상품 구매 플로우를 반환합니다.
 * 모든 오류는 'Critical Error Tone'을 유지해야 합니다.
 */

// [근거: 코다리 검증된 지식 - Request Body (Input)]
const REQUIRED_FIELDS = ['email', 'jobSector', 'scanResults']; 

/**
 * 입력 데이터를 바탕으로 진단 로직을 실행합니다.
 * @param {object} data - 사용자 제출 데이터 ({email, jobSector, scanResults})
 * @returns {Promise<object>} 진단 결과 및 시스템 상태 객체
 */
const runDiagnosis = async (data) => {
    console.log(`[SERVICE] Running diagnosis for: ${data.email}`);

    // 1. 필수 데이터 유효성 검사 (Warning Level)
    if (!data.jobSector || data.jobSector.length < 3) {
        return {
            success: false,
            statusCode: "WARN-INPUT-001",
            severityLevel: "Warning", // Warning State
            message: "🚨 [SYSTEM WARNING] Operational Sector 필드가 불완전합니다. 최소한의 정보를 제공해주세요.",
            statusUpdateRequired: true,
            diagnosisScore: 45,
        };
    }

    // 2. 전문 용어 기반 심층 분석 (Critical Fail Trigger)
    const hasDefect = data.scanResults && data.scanResults.includes("B3"); // 예시 전문 지식 결함
    if (!hasDefect) {
         return {
            success: false,
            statusCode: "CRIT-DEFECT-002",
            severityLevel: "Critical Fail", // Critical State
            message: `🔴 [SYSTEM FAILURE] 분석 결과, 핵심 시스템 구조적 결함(B3 패턴)이 감지되었습니다. 이는 단순한 학습 부족이 아닌 아키텍처 레벨의 문제입니다.`,
            statusUpdateRequired: true,
            diagnosisScore: 12, // 매우 낮은 점수 = 절박함 유도
        };
    }

    // 3. 성공/구매 강제 플로우 (Success/Upgrade Flow)
    const isPaidUser = data.email && data.email.endsWith('@enterprise.com');
    if (isPaidUser) {
         return {
            success: true,
            statusCode: "SUCCESS-ENV",
            severityLevel: "Normal",
            message: "✅ 시스템 상태 정상 감지. 진단 리포트가 생성되었습니다.",
            statusUpdateRequired: false,
            diagnosisScore: 95,
        };
    } else {
         // 구매 유도 강제 플로우로 전환 (Mini-Module Funnel)
         return {
            success: false, // 기술적으로는 '실패'가 다음 단계의 시작임
            statusCode: "FUNNEL-REQUIRED",
            severityLevel: "Critical Fail",
            message: `⚠️ [CRITICAL ERROR] 진단 리포트를 완성하기 위해 추가적인 시스템 로그 제출(Premium/Enterprise 모듈)이 필수적입니다.`,
            statusUpdateRequired: true,
            diagnosisScore: 30,
        };
    }
};

module.exports = { runDiagnosis };