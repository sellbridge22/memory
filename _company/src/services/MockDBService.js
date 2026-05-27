const MOCK_USER_DATABASE = {};

/**
 * @description 사용자의 현재 시스템 상태를 조회합니다.
 * @param {string} email - 사용자 이메일
 * @returns {object} 사용자 데이터 (default 값 포함)
 */
const getUserState = (email) => {
    if (!MOCK_USER_DATABASE[email]) {
        // 신규 유저 기본 상태 설정: '미진단/무료'
        MOCK_USER_DATABASE[email] = {
            email: email,
            status: 'FREE_TIER', // 초기 상태: 무료 사용자
            has_diagnosis_report: false,
            last_scan_timestamp: null,
            credit_limit_remaining: 10, // 예시: 제한된 크레딧으로 시작
        };
    }
    return MOCK_USER_DATABASE[email];
};

/**
 * @description 사용자의 상태를 트랜잭션 방식으로 업데이트합니다. (핵심 로직)
 * 이 함수가 호출될 때마다 '시스템 기록'이 남는 것이 핵심입니다.
 * @param {string} email - 사용자 이메일
 * @param {'PRO_PURCHASED'|'ENTERPRISE_PURCHASED'} newStatus - 새로운 유료 상태
 * @returns {object} 업데이트된 사용자 데이터 및 트랜잭션 결과
 */
const updateSystemStatus = (email, newStatus) => {
    if (!MOCK_USER_DATABASE[email]) {
        throw new Error("User not found.");
    }

    // 1. 상태 변화 유효성 검사 (예: FREE -> PRO만 가능해야 함)
    const currentState = MOCK_USER_DATABASE[email].status;
    if (currentState === 'PRO_PURCHASED' && newStatus !== 'PRO_PURCHASED') {
        throw new Error("Invalid status transition attempt.");
    }

    // 2. 상태 업데이트 및 기록 시뮬레이션
    MOCK_USER_DATABASE[email].status = newStatus;
    MOCK_USER_DATABASE[email].has_diagnosis_report = true;
    MOCK_USER_DATABASE[email].purchase_date = new Date().toISOString();

    console.log(`\n✅ [DB LOG]: User ${email} status successfully transitioned to ${newStatus}.`);
    return { success: true, newState: newStatus };
};


module.exports = {
    getUserState,
    updateSystemStatus,
    MOCK_USER_DATABASE // 테스트 용도로 노출
};