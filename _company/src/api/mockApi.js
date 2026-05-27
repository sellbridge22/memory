/**
 * @fileoverview Mock API Layer for Critical Defect Funnel.
 * 이 레이어는 실제 백엔드 엔드포인트와 통신하는 것을 시뮬레이션합니다.
 * 핵심은 '상태 전이'와 '구조적 에러 코드 반환'을 강제하는 것입니다.
 */

// -------------------------------------------------
// [API Endpoint 1] 손실액 계산 및 진단 점수 산출 (가장 중요)
// -------------------------------------------------
export const calculateLossAndScore = async ({ scope, regulatoryArea, severityLevel }) => {
    console.log(`[API Call] Calculating loss for Scope: ${scope}, Area: ${regulatoryArea}...`);

    // Mock 로직: 입력 값에 따라 손실액을 동적으로 계산합니다.
    let baseLoss = 100_000_000; // 최소 기본 손실 (₩1억)
    if (severityLevel === 'High') {
        baseLoss *= Math.random() * 4 + 1; // 2~5배 증가
    } else if (regulatoryArea === 'GDPR' && scope === 'Global') {
        baseLoss = 3_000_000_000; // GDPR 글로벌 Scope일 경우 최소 30억 설정 강제
    }

    // 손실액을 10억 ~ 50억 범위로 클리핑 및 포매팅
    let finalLoss = Math.min(Math.max(baseLoss, 1_000_000_000), 5_000_000_000);
    finalLoss = Math.round(finalLoss / 100) * 100; // 백 단위로 반올림

    // 진단 점수 (Score): Loss와 Scope의 복잡도를 기반으로 산정
    const diagnosisScore = scope.length * severityLevel.length + regulatoryArea.length * 5;

    // 성공적인 API 응답 구조를 강제합니다.
    return {
        success: true,
        message: "진단 점수 및 잠재 손실액 계산 완료.",
        data: {
            calculatedLossAmount: finalLoss, // 최종 산출된 금액 (₩)
            diagnosticScore: Math.min(100, diagnosisScore), // 0~100 사이의 점수
            recommendation: "PRO 솔루션 사용이 필수적입니다.",
        }
    };
};

// -------------------------------------------------
// [API Endpoint 2] 결제 처리 및 사용자 상태 전이 (State Change)
// -------------------------------------------------
export const processPayment = async ({ email, selectedTierId, sourceDefect }) => {
    console.log(`[API Call] Attempting payment for ${selectedTierId} from defect: ${sourceDefect}`);

    // Mock 로직: 결제 성공 확률을 높이되, 실패 케이스를 강제합니다.
    if (Math.random() < 0.1) { // 10% 확률로 PAYMENT-FAIL 시뮬레이션
        return { success: false, errorCode: 'PAYMENT-FAIL', message: "결제 게이트웨이 오류. 결제를 재시도해 주세요." };
    }

    // 성공 케이스: 사용자 상태 업데이트 로직을 강제합니다.
    console.log(`[SUCCESS] User ${email} status updated to ${selectedTierId}.`);

    return {
        success: true,
        transactionId: `TX-${Date.now()}`,
        userStatusUpdate: "PRO_ACTIVE", // 핵심 상태 전이값
        message: "결제가 성공적으로 완료되었으며, 시스템 접근 권한이 업데이트되었습니다."
    };
};

/**
 * @typedef {object} LegalBasisItem
 * @property {string} code - 법적 근거 코드 (예: GDPR-Art.17)
 * @property {string} title - 전문 용어 제목 (예: Right to Erasure)
 * @property {string} description - 구체적인 법적 설명 및 영향 범위
 */

// -------------------------------------------------
// [Data Structure] 전문 법률 근거 데이터 정의
// -------------------------------------------------
export const LEGAL_BASES = [
    { code: 'GDPR-Art.17', title: 'Right to Erasure (삭제권)', description: '개인정보 주체는 자신의 정보가 처리되는 것을 원하지 않을 경우, 해당 데이터를 삭제할 권리를 가집니다.' },
    { code: 'CCPA-Sec.302', title: 'Opt-Out Mechanism', description: '소비자는 개인정보의 판매 및 공유에 대해 거부권을 행사할 수 있는 명확한 메커니즘을 요구합니다.' },
    { code: 'SEC-Reg.10b-5', title: 'Misrepresentation Liability', description: '허위 진술이나 누락된 정보는 금융 거래에서 심각한 법적 책임을 초래하며, 이는 재정적 손실로 직결됩니다.' }
];