/**
 * AuditLogger.ts: 모든 시스템 상태 변화(특히 PAID-STATE)를 기록하는 유틸리티.
 * 중요한 로그는 단순 DB INSERT가 아닌, 전용 '구조적 결함 추적 테이블'에 저장되어야 합니다.
 */

interface LogEntry {
    userId: string;
    timestamp: Date;
    eventType: 'PURCHASE_SUCCESS' | 'AUTH-STRUC_FAIL' | 'STATUS_UPDATE';
    details: any; // 변경된 상태값, 결제 트랜잭션 ID 등
    sourceDefectCode: string | null;
}

/**
 * 로그를 기록하는 함수 (실제로는 DB Connection Pool을 사용해야 함)
 * @param entry - 기록할 로그 엔트리
 */
export const auditLog = async (entry: LogEntry): Promise<void> => {
    console.log(`[AUDIT LOG]: ${JSON.stringify(entry, null, 2)}`);
    // TODO: 실제 DB 연결 및 트랜잭션 커밋 로직 구현 필요
};

/**
 * 특정 사용자 ID에 대해 상태 변화를 기록합니다.
 */
export const logUserStatusChange = async (userId: string, status: 'FREE' | 'PRO' | 'ENTERPRISE', sourceDefectCode: string): Promise<void> => {
    await auditLog({
        userId: userId,
        timestamp: new Date(),
        eventType: 'STATUS_UPDATE',
        details: { newStatus: status, previousStateCheck: true },
        sourceDefectCode: sourceDefectCode
    });
};