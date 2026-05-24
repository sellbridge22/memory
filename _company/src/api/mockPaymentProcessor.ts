/**
 * @module mockPaymentProcessor
 * @description 외부 결제 게이트웨이 및 구조적 결함 측정 서비스를 모킹합니다.
 * 이 서비스는 단순히 API 호출을 흉내내는 것이 아니라, '상태 전이의 권위'를 부여하는 역할을 합니다.
 */

// --- [Mock Defect Severity Measurement Service] ---
/**
 * 사용자의 데이터를 받아 '구조적 결함 심각도 점수'와 '경고 코드'를 계산합니다.
 * @param diagnosticData - 진단 과정에서 수집된 데이터 (예: 활동성, 누락 지표 등).
 * @returns Promise<{ severityScore: number, defectCode: string }>
 */
export async function measureDefectSeverity(diagnosticData: any): Promise<{ severityScore: number, defectCode: string }> {
    console.log(`[SERVICE] Measuring structural defects based on input data...`);

    // 1. 데이터 검증 및 초기 오류 처리 (테스트 케이스 3 대비)
    if (!diagnosticData || !diagnosticData.scanResults || diagnosticData.scanResults.length < 2) {
        throw new Error("Structural assessment failed: Insufficient diagnostic data provided.");
    }

    // 2. 가상의 '시스템적 결함 점수' 계산 로직 (Placeholder Logic)
    let score = diagnosticData.scanResults.filter(r => r.includes('CRITICAL')).length * 30;
    score += Math.random() * 15; // 랜덤 노이즈 추가

    // 3. 심각도 및 경고 코드 결정 (가장 중요한 비즈니스 로직)
    let defectCode: string;
    if (score >= 75) {
        defectCode = 'CRITICAL-DEFECT';
        console.warn(`[ALERT] CRITICAL DEFECT DETECTED! Score: ${Math.round(score)}`);
    } else if (score >= 30) {
        defectCode = 'MINOR-ANOMALY';
        console.log(`[WARNING] Minor structural anomaly detected.`);
    } else {
        defectCode = 'NOMINAL_STATUS';
        console.info('[INFO] System appears stable.');
    }

    return { 
        severityScore: Math.round(score), 
        defectCode: defectCode 
    };
}


// --- [Mock Payment Processor Service] ---
/**
 * 실제 결제 게이트웨이와의 통신을 시뮬레이션합니다.
 * @param tierId - 구매하려는 티어 (PRO, ENTERPRISE).
 * @returns Promise<{ success: boolean, message: string, errorCode?: string }>
 */
export async function processPayment(tierId: 'PRO' | 'ENTERPRISE'): Promise<{ success: boolean, message: string, errorCode?: string }> {
    console.log(`[PAYMENT] Attempting transaction for ${tierId}...`);

    // Mock Failure Scenario (테스트 케이스 4 대비)
    if (Math.random() < 0.1) { // 10% 확률로 실패 시뮬레이션
        return { success: false, message: "Transaction failed due to external system error.", errorCode: 'PAYMENT-FAIL' };
    }

    // Success Scenario
    return { success: true, message: `${tierId} 패키지 구매 완료. 시스템 안정화가 시작됩니다.` };
}