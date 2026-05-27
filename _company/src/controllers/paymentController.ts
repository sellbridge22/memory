/**
 * PaymentController.ts: API 엔드포인트 역할을 하며 요청을 받고 비즈니스 로직(Service)에 위임합니다.
 */

import { processSubscriptionUpgrade, checkDiagnosisScore } from '../services/SubscriptionService';

// Mock Request Body Type
interface RequestBody {
    userId: string;
    paymentToken: string; // 결제 성공 시 받는 토큰
    sourceDefectCode: string; // AUTH-STRUC 등 구조적 오류 코드
}

/**
 * 🚀 E2E 유료 전환 처리 엔드포인트 (POST /api/v1/convert)
 * @param reqBody - 요청 바디 데이터
 */
export const convertToPro = async (reqBody: RequestBody): Promise<{ success: boolean; message: string }> => {
    console.log("\n--- [Controller] Received conversion request ---");

    try {
        // 1. 서비스 호출 및 트랜잭션 시작
        const updatedUser = await processSubscriptionUpgrade(
            reqBody.userId,
            reqBody.paymentToken,
            reqBody.sourceDefectCode
        );

        // 성공 시 응답 구조는 단순한 성공이 아닌 '시스템적 변화'를 강조해야 합니다.
        return { 
            success: true, 
            message: `✅ 성공적으로 Pro 계정으로 승격되었습니다. 사용자 상태가 ${updatedUser.status}로 기록되었으며, 모든 권한을 복구했습니다.` 
        };

    } catch (e) {
        // 구조적 결함이나 결제 실패 시, 전문적인 오류 메시지를 반환합니다.
        const error = e instanceof Error ? e : new Error("Unknown System Error");
        console.error(`[Controller] ERROR: ${error.message}`);

        // 핵심은 사용자가 '내 실수'가 아닌 '시스템의 구조적 결함'으로 느끼게 하는 것입니다.
        return { 
            success: false, 
            message: `🚨 시스템 오류 발생 (AUTH-STRUC): 요청 처리에 실패했습니다. 원인 추정: ${error.message}. 저희는 구조적인 무결성 문제를 진단해야 합니다.` 
        };
    }
};

/**
 * 무료 사용자 진단 점수 확인 엔드포인트 (GET /api/v1/diagnose)
 */
export const checkDiagnosis = async (userId: string, scanResults: any[]): Promise<{ requiresUpgrade: boolean; score: number }> => {
    return await checkDiagnosisScore(userId, scanResults);
};