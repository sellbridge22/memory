/**
 * SubscriptionService.ts: 사용자 구독 및 상태 변경 로직을 처리하는 핵심 서비스 레이어.
 * 이 함수는 모든 비즈니스 트랜잭션의 원자성을 보장해야 합니다.
 */

import { auditLog, logUserStatusChange } from '../utils/AuditLogger';

// 가상의 DB 인터페이스 (실제로는 Prisma나 TypeORM 사용)
type UserState = { id: string; status: 'FREE' | 'PRO' | 'ENTERPRISE'; lastLogin: Date };

/**
 * 사용자 상태를 업데이트하고 트랜잭션을 완료하는 핵심 함수.
 * @param userId - 사용자 ID
 * @param paymentToken - 결제 성공을 증명하는 토큰 (Mock)
 * @returns 새로운 UserState 객체
 */
export const processSubscriptionUpgrade = async (userId: string, paymentToken: string, sourceDefectCode: string): Promise<UserState> => {
    console.log(`\n--- [SVC] Starting Subscription Upgrade for User ${userId} ---`);

    // 1. 결제 게이트웨이 호출 및 검증 (가장 먼저 실패할 수 있는 지점)
    try {
        if (!paymentToken || paymentToken.length < 10) {
            throw new Error("Payment token is invalid or missing.");
        }
        console.log("[SVC] ✅ Payment Gateway Success: Transaction simulated.");

    } catch (e) {
        // 결제 실패 시, 사용자 상태 변경은 절대 일어나면 안 됨.
        await auditLog({ userId: userId, timestamp: new Date(), eventType: 'PAYMENT_FAIL', details: e instanceof Error ? e.message : 'Unknown Failure', sourceDefectCode: sourceDefectCode });
        throw new Error("Payment processing failed.");
    }

    // 2. DB 상태 업데이트 (원자성 보장 필요)
    const newStatus = "PRO"; // 결제 성공 시 강제 PRO로 설정
    console.log(`[SVC] 💾 Updating User ${userId} status to ${newStatus}...`);
    // TODO: 실제 트랜잭션 커밋 로직 구현 (SELECT FOR UPDATE 등)

    // 3. Audit Log 기록 및 상태 변경 확정
    await logUserStatusChange(userId, newStatus, sourceDefectCode);

    console.log(`[SVC] ✨ SUCCESS: User ${userId} status updated to ${newStatus}.`);

    return { id: userId, status: newStatus, lastLogin: new Date() };
};

/**
 * 진단 점수 기반의 상태 전이 로직 (무료 사용자에게만 작동)
 */
export const checkDiagnosisScore = async (userId: string, scanResults: any[]): Promise<{ requiresUpgrade: boolean; score: number }> => {
    // 가상의 복잡한 비즈니스 로직 처리 시뮬레이션
    const score = Math.random() * 10 + 50; // 50~60점대 점수 생성

    if (score < 70) {
        return { requiresUpgrade: true, score: score };
    } else {
        return { requiresUpgrade: false, score: score };
    }
};