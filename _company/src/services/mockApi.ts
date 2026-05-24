import { UserScanData, PurchaseData, MockApiResponse } from '../types/testTypes';

/**
 * ------------------------------------------
 * 🧪 MOCK SERVICE LAYER: Sellbridge Core API Simulation
 * 실제 백엔드 호출을 대체하여 테스트 환경의 안정성을 확보합니다.
 * 모든 로직은 여기에 모킹됩니다.
 * ------------------------------------------
 */

/**
 * Step 1: 사용자 진단 및 로그 제출 시뮬레이션 (POST /api/v1/scan)
 * @param userData - UserScanData 객체
 * @returns Promise<MockApiResponse>
 */
export const submitDiagnosisLog = async (userData: UserScanData): Promise<MockApiResponse> => {
    console.log(`[MOCK API] -> Submitting scan data for ${userData.email} (${userData.jobSector})...`);

    // Mocking Logic: CRITICAL 에러가 하나라도 있으면, 임의로 실패 데이터를 반환합니다.
    const hasCriticalDefect = userData.scanResults.some(res => res.level === 'CRITICAL');

    if (!userData.email || !userData.jobSector) {
        return { success: false, message: "API_ERR-001: 필수 사용자 정보를 누락했습니다. 구조적 취약점 진단을 위해서는 모든 필드가 필요합니다." };
    }

    await new Promise(resolve => setTimeout(resolve, 50)); // Network delay simulation

    if (hasCriticalDefect) {
        const reportId = `REPORT-${Date.now()}`;
        return { success: true, message: "진단 로그가 성공적으로 수집되었습니다. 위험 구조적 결함이 감지되었습니다. 상세 리포트를 확인하세요.", data: { 
            reportId: reportId, 
            criticalDefects: ["AUTH-STRUC", "SYSTEM-OVERLOAD"], // 강제 결함 삽입
            status: 'DISCOVERED'
        }};
    } else {
        return { success: true, message: "진단 로그가 정상적으로 처리되었습니다. 당장의 위험은 감지되지 않았습니다.", data: { 
            reportId: `REPORT-CLEARED-${Date.now()}`, 
            criticalDefects: [], 
            status: 'CLEARED'
        }};
    }
};

/**
 * Step 2: 유료 패키지 구매 시뮬레이션 (POST /api/v1/purchase)
 * @param purchaseData - PurchaseData 객체
 * @returns Promise<MockApiResponse>
 */
export const processPurchase = async (purchaseData: PurchaseData): Promise<MockApiResponse> => {
    console.log(`[MOCK API] -> Attempting purchase for ${purchaseData.email} (${purchaseData.selectedTierId})...`);

    await new Promise(resolve => setTimeout(resolve, 100)); // Longer network delay simulation

    // Mocking Logic: 결함 원인이 PAYMENT-FAIL이면 강제 실패
    if (purchaseData.sourceDefect === 'PAYMENT-FAIL') {
        return { success: false, message: "PAYMENT-FAIL-201: 외부 게이트웨이와 통신 오류가 발생했습니다. 카드 정보를 확인하거나 다른 결제 수단을 시도하십시오." };
    }

    // 모든 로직을 거쳤다는 성공 메시지 반환 (실제로는 사용자 상태 업데이트 포함)
    return { success: true, message: `[SUCCESS] ${purchaseData.selectedTierId} 패키지 구매가 완료되었습니다. 시스템의 신뢰성이 복구되었습니다.`, data: {} };
};

// 필요한 경우 다른 엔드포인트도 여기에 추가합니다 (예: GET /api/v1/status)