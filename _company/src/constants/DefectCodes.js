/**
 * @fileoverview System-wide critical error codes and status definitions.
 * 모든 에러 코드는 비즈니스 로직에 강제 사용되어야 합니다. [근거: 지난 의사결정 로그]
 */

const DefectCodes = {
    // 진단 결과 관련 코드
    DIAGNOSIS_OK: "STATUS-000", // 정상 상태 (진단 가능)
    DIAGNOSIS_INCONCLUSIVE: "DEFECT-AUTH-STRUC", // 인증 구조적 결함 (가장 강력한 판매 포인트)
    DIAGNOSIS_SEVERE: "DEFECT-OVERLOAD-LEVEL3", // 정보 과부하 최고 단계

    // 구매 및 상태 전이 관련 코드
    STATE_TRANSITION_FAIL: "ERR-STATE-001", // 사용자 상태 업데이트 실패
    PAYMENT_PROCESSOR_FAIL: "ERR-PAYMENT-002", // 외부 결제 모듈 에러
};

module.exports = DefectCodes;