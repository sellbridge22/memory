// src/services/AccountService.js

/**
 * @typedef {("FREE_TIER"|"PAID"|"ENTERPRISE")} UserTierState
 */

class AccountService {
    constructor(dbService) {
        this.db = dbService; // MockDBService를 의존성 주입 받음
    }

    /**
     * 사용자 ID와 결제 정보를 바탕으로 상태 전이를 시도하고, 트랜잭션을 기록합니다.
     * @param {string} email - 사용자 이메일
     * @param {Object} paymentData - 실제 결제 성공에 대한 메타데이터 (e.g., transactionId)
     * @returns {Promise<{success: boolean, newState: UserTierState, message: string}>} 상태 전이 결과
     */
    async processSuccessfulPayment(email, paymentData) {
        console.log(`[SERVICE] Starting state transition for ${email}...`);

        // 1. 현재 사용자 데이터 로드 및 검증 (DB 조회 시뮬레이션)
        const userData = await this.db.getUserByEmail(email);
        if (!userData || !userData.status) {
            console.error("[ERROR] User data not found or incomplete.");
            return { success: false, newState: 'FREE_TIER', message: "사용자 정보가 유효하지 않아 상태 전이를 할 수 없습니다." };
        }

        const currentState = userData.status;
        let newState = currentState;

        // 2. 상태 전이 로직 (핵심 비즈니스 규칙)
        if (currentState === 'FREE_TIER' && paymentData.tierId === 'PRO') {
            newState = 'PAID'; // 성공적으로 PRO 티어로 업그레이드
        } else if (currentState !== 'FREE_TIER') {
             // 이미 유료 상태이거나 잘못된 트랜잭션인 경우
             return { success: false, newState: currentState, message: "이미 활성화된 계정입니다. 적절한 프로모션을 확인해주세요." };
        } else {
            // 다른 오류 또는 처리할 수 없는 케이스
            return { success: false, newState: currentState, message: "상태 전이 조건을 충족하지 못했습니다." };
        }

        if (newState === 'FREE_TIER') {
             console.warn("[SERVICE] State change failed internally.");
             return { success: false, newState: 'FREE_TIER', message: "시스템 오류로 상태 변경에 실패했습니다." };
        }

        // 3. 사용자 데이터 업데이트 (상태 기록)
        await this.db.updateUserStatus(email, newState);
        console.log(`[SUCCESS] State successfully transitioned to ${newState}.`);

        // 4. 감사 로그 기록 (Audit Log) - 이 부분이 가장 중요합니다! [근거: CEO 지시사항 검토]
        const auditLog = {
            userId: userData.id,
            action: 'TIER_UPGRADE',
            fromState: currentState,
            toState: newState,
            details: `Payment successful for ${paymentData.tierId}. Transaction ID: ${paymentData.transactionId}`,
            timestamp: new Date().toISOString()
        };
        await this.logAudit(auditLog);

        return { success: true, newState: newState, message: "🎉 시스템 권한이 성공적으로 활성화되었습니다!" };
    }

    /**
     * 감사 로그를 데이터베이스에 기록합니다. (실제로는 별도의 AuditLog 테이블 사용)
     * @param {Object} logData - 감사 로그 객체
     */
    async logAudit(logData) {
        console.log(`[AUDIT] Logging transaction: ${logData.action}`);
        // 실제 환경에서는 DB에 기록하는 로직이 들어갑니다. 여기서는 MockDBService를 재활용합니다.
        await this.db.saveAuditLog(logData);
    }
}

module.exports = AccountService;