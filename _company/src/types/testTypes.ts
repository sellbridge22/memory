/**
 * Sellbridge E2E Testing Data Contract Definitions
 * 모든 테스트와 API 통신은 이 타입들을 준수해야 합니다.
 */

// 1. 사용자 진단 결과 입력 스펙 (Initial Input)
export type ScanResult = {
    scanId: string; // e.g., A1, B3
    level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    description: string;
};

/**
 * @typedef {object} UserScanData
 * @property {string} email - 사용자 이메일 (Primary Identifier)
 * @property {'tech' | 'finance' | 'healthcare' | string} jobSector - 직군 분류
 * @property {ScanResult[]} scanResults - 진단 스캔 결과 배열
 * @property {Date} timestamp - 데이터 수집 시간
 */

// 2. 결제 및 티어 선택 입력 스펙 (Purchase Input)
export type TierSelection = 'FREE' | 'PRO' | 'ENTERPRISE';

/**
 * @typedef {object} PurchaseData
 * @property {string} email - 사용자 이메일
 * @property {TierSelection} selectedTierId - 사용자가 선택한 티어
 * @property {'AUTH-STRUC' | 'PAYMENT-FAIL' | 'SYSTEM-OVERLOAD'} sourceDefect - 구매를 유도한 구조적 결함 원인 (System Defect ID)
 */

// 3. API 응답 스펙 (Mock Response Contract)
export type ApiResponse<T> = {
    success: boolean;
    message: string; // 에러 메시지는 반드시 Critical Error Tone을 유지해야 함
    data?: T;
}

/**
 * @typedef {object} DiagnosisReport
 * @property {string} reportId - 진단 리포트 고유 ID (UUID)
 * @property {string[]} criticalDefects - 발견된 핵심 취약점 키워드 배열
 * @property {'DISCOVERED' | 'CLEARED'} status - 현재 시스템 상태
 */

export type MockApiResponse = ApiResponse<DiagnosisReport> | ApiResponse<{ success: boolean }>;