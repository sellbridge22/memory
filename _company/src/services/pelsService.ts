/**
 * @fileoverview PELS (Potential Economic Loss Score) 계산 및 상태 전이 관리 서비스
 * 이 모듈은 모든 프론트엔드 및 백엔드에서 시스템적 위험도를 측정하는 핵심 로직을 제공합니다.
 */

// --- 1. 상수 정의: 임계치와 스타일 기준점 ---
export const PELS_THRESHOLDS = {
    NORMAL: 50000,       // $50,000 이하: 정상 상태
    WARNING: 300000,     // $300,000 미만: 경고 상태 (Critical Threshold 1 ~ Critical Threshold 2)
    CRITICAL: Infinity   // 무한대: 임계점 초과 (가장 높은 위험도)
};

export type PelsState = 'NORMAL' | 'WARNING' | 'CRITICAL';

/**
 * 주어진 데이터셋을 기반으로 잠재적 경제 손실 점수(PELS)를 계산하고 시스템 상태를 판별합니다.
 * @param rawData - 사용자의 진단 결과, 프로필 정보 등 원시 데이터 배열/객체
 * @returns {object} PELS Score와 State 정보를 포함한 구조화된 객체
 */
export const calculatePels = (rawData: Record<string, any>): { score: number; state: PelsState; message: string } => {
    // [로직 설명] 실제 환경에서는 이 부분에 복잡한 비즈니스 로직(예: AI 모델 예측값)이 들어갑니다.
    let baseLoss = 0;

    if (rawData && rawData.scanResults && Array.isArray(rawData.scanResults)) {
        // 예시: 스캔 결과의 개수나 특정 키워드 유무에 따라 가중치 부여
        baseLoss += rawData.scanResults.length * 1500; // 결과당 $1,500 손실 가정
    }

    if (rawData && rawData.jobSector === 'Finance') {
        // 예시: 금융 섹터는 일반적인 위험도가 높다고 가정
        baseLoss += 10000;
    }
    
    // 실제 PELS 점수는 계산된 baseLoss를 기반으로 복잡한 공식을 거칩니다. (여기서는 간단히 사용)
    const calculatedPels = Math.round(Math.max(0, baseLoss));

    let currentState: PelsState;
    let statusMessage: string;

    if (calculatedPels < PELS_THRESHOLDS.NORMAL) {
        currentState = 'NORMAL';
        statusMessage = "시스템 정상 작동 범위 내입니다. 추가적인 구조적 결함은 감지되지 않았습니다.";
    } else if (calculatedPels >= PELS_THRESHOLDS.NORMAL && calculatedPels < PELS_THRESHOLDS.WARNING) {
        currentState = 'WARNING';
        statusMessage = `[⚠️ WARNING] 잠재적 손실액이 임계치에 근접했습니다 (${Math.round(calculatedPels / 1000)}k). 즉시 진단 및 보정이 필요합니다.`;
    } else { // calculatedPels >= PELS_THRESHOLDS.WARNING
        currentState = 'CRITICAL';
        statusMessage = `[🚨 CRITICAL ERROR] 구조적 결함이 심각하게 감지되었습니다 (${Math.round(calculatedPels / 1000)}k). 서비스 이용은 필수 생존 조건입니다.`;
    }

    return {
        score: calculatedPels,
        state: currentState,
        message: statusMessage,
    };
};

/**
 * 테스트용 가짜 API 호출 함수 (실제 백엔드 라우트 역할을 모킹)
 */
export const mockApiCall = (inputData: Record<string, any>): Promise<{ score: number; state: PelsState; message: string }> => {
    return new Promise((resolve) => {
        // 100ms 지연을 통해 비동기 통신 시뮬레이션
        setTimeout(() => {
            const result = calculatePels(inputData);
            resolve(result);
        }, 100);
    });
};

export { PELS_THRESHOLDS };