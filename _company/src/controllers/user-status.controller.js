import { calculateAndAdvancePELS } from '../services/pelsService';

/**
 * 사용자 진단 상태를 업데이트하고 PELS 변화 및 구조적 위험을 평가하는 컨트롤러입니다.
 * @param {Object} req - Request 객체 (사용자 ID, 현재 시간 포함)
 * @param {Object} res - Response 객체
 */
export const updateStatus = async (req, res) => {
    try {
        // 1. 데이터 추출 및 유효성 검사
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required." });
        }

        // 2. Mock 사용자 데이터 로드 (실제로는 DB 조회)
        // 임시로 오늘 시간으로 설정하고 초기 PELS를 가정합니다.
        const mockUserData = {
            email: email,
            pels: Math.random() * 15 + 5, // 테스트를 위해 랜덤 시작점 부여
            lastActivityAt: Date.now(),
            hasPurchasedModule: () => false,
            hasNotPurchasedModule: () => true
        };

        // 3. PELS 서비스 실행 (핵심 비즈니스 로직)
        const { newPelsScore, structuralAlert, requiredForcedAction } = calculateAndAdvancePELS(mockUserData, Date.now());

        let responseBody = {
            success: true,
            newPelsScore: newPelsScore,
            structuralAlert: structuralAlert || null,
            suggestedAction: 'Continue diagnosing.', // 기본 액션
            requiredForcedActionCode: requiredForcedAction || null
        };

        // 4. 상태 전이 로직에 따른 응답 조정 (강제 개입)
        if (requiredForcedAction) {
            responseBody.suggestedAction = `[System Override] Critical Defect Detected (${requiredForcedAction}). Immediate Module Purchase Required.`;
        } else if (structuralAlert && !requiredForcedAction) {
             // 경고는 있지만 강제 코드는 아닐 때, 다음 단계를 유도
            responseBody.suggestedAction = `Warning detected: ${structuralAlert}. Proceed to next module analysis?`;
        }


        // 5. 성공 응답 반환
        res.status(200).json({
            success: true,
            data: responseBody
        });

    } catch (error) {
        console.error("Status Update Error:", error);
        res.status(500).json({ success: false, message: "Internal system error during status check." });
    }
};