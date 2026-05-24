/**
 * @fileoverview Payment Completion Controller for /api/v1/purchase-completion
 * Handles the final stage of the user funnel: payment and state transition.
 * Maintains the State Machine pattern by enforcing status updates.
 */

import { Request, Response } from 'express';
// 가정: 사용자 상태 관리를 담당하는 서비스가 존재함
import { UserStateService } from '../services/userStateService'; 
// 외부 결제 게이트웨이와의 통신을 모킹한 프로세서 (실제로는 import)
import { mockPaymentProcessor } from '../../utils/mock_payment_processor';

/**
 * @typedef {object} PurchaseRequest
 * @property {string} email - 사용자 이메일 주소.
 * @property {('PRO'|'ENTERPRISE')} selectedTierId - 사용자가 선택한 티어 ID.
 * @property {number} paymentToken - 결제 게이트웨이에서 받은 토큰 (모킹용).
 * @property {string} source_defect - 이 구매가 해결하려는 핵심 시스템적 결함 코드 (예: AUTH-STRUC).
 */

/**
 * POST /api/v1/purchase-completion
 * 사용자의 유료 패치 구매 완료를 처리하고, 시스템 상태 전이를 강제합니다.
 * @param {Request} req - Express 요청 객체.
 * @param {Response} res - Express 응답 객체.
 */
export const handlePurchaseCompletion = async (req: Request, res: Response) => {
    const { email, selectedTierId, paymentToken, source_defect } = req.body;

    // 1. 입력 유효성 검증 및 필수 데이터 확인 (Safety Check!)
    if (!email || !selectedTierId || !paymentToken || !source_defect) {
        console.error("Payment completion request failed: Missing required fields.");
        return res.status(400).json({ 
            success: false, 
            errorCode: "INPUT-VALIDATION-FAIL",
            message: "필수 정보가 누락되었습니다. 다시 확인 후 진단해주세요." // 경고 톤 유지
        });
    }

    console.log(`[DEBUG] Attempting purchase for ${email} at tier ${selectedTierId}...`);

    try {
        // 2. 결제 모킹 호출 (외부 API 통합 지점)
        const paymentResult = await mockPaymentProcessor({ token: paymentToken, amount: selectedTierId === 'PRO' ? 19900 : 49900 });

        if (!paymentResult || !paymentResult.success) {
            // 결제 실패 시나리오 처리 (상태 변화 없음)
            console.warn(`[WARNING] Payment failed for ${email}: ${paymentResult?.message}`);
            return res.status(503).json({ 
                success: false, 
                errorCode: "PAYMENT-FAIL",
                message: `결제 시스템 오류 발생. (${paymentResult?.message}). 잠시 후 다시 시도해주세요.` // 구조적 문제로 포장
            });
        }

        // 3. 결제 성공 & 상태 전이 (State Machine Transition)
        const newState = await UserStateService.updateUserStatus(email, selectedTierId, source_defect);

        if (!newState || !newState.isSuccess) {
             // 내부 로직 오류 처리 (가장 위험한 시나리오)
            console.error(`[CRITICAL] Failed to transition user state for ${email}.`);
            return res.status(500).json({ 
                success: false, 
                errorCode: "INTERNAL-STATE-ERROR",
                message: "서버 내부 오류가 감지되었습니다. 관리자에게 문의해주세요." 
            });
        }

        // 성공 응답 (다음 단계 유도)
        return res.status(200).json({
            success: true,
            message: `시스템 패치 완료! ${selectedTierId} 등급으로 정상 상태가 복구되었습니다.`,
            newStatus: newState,
            nextActionGuide: "진단 리포트를 다운로드하여 사용 매뉴얼을 숙지하십시오." // 강제 액션 유도
        });

    } catch (error) {
        // 예상치 못한 시스템 오류 처리
        console.error("Unhandled exception during purchase completion:", error);
        return res.status(500).json({ 
            success: false, 
            errorCode: "SYSTEM-CRASH",
            message: "알 수 없는 치명적인 시스템 변칙성이 감지되었습니다." // 최상위 경고톤 유지
        });
    }
};

// 상태 전이 서비스는 임포트된 것으로 가정하고 구현은 제외합니다.
// const UserStateService = require('../services/userStateService');