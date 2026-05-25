/**
 * @fileoverview Express API Controller. 외부와 통신하는 게이트웨이 역할을 합니다.
 */

const { runFullDiagnosisFlow } = require('./defectService');

// 전역적으로 사용되는 예외 처리 핸들러
const errorHandler = (err, req, res) => {
    console.error("🚨 [API HANDLER ERROR] 요청 처리 중 심각한 에러 발생:", err);
    res.status(500).json({ 
        success: false, 
        message: "서버 내부 오류가 발생했습니다. 구조적 분석을 위해 잠시 후 다시 시도해 주십시오." 
    });
};

/**
 * POST /v1/diagnose 엔드포인트 핸들러
 * @param {object} req - Request object (body에 사용자 데이터 포함)
 * @param {object} res - Response object
 */
const diagnoseUser = async (req, res) => {
    // 💡 Input Validation: 가장 먼저 입력 값의 무결성을 체크합니다. [근거: 코다리 개인 메모리]
    const { email, jobSector, scanResults } = req.body;

    if (!email || !jobSector || !scanResults) {
        return res.status(400).json({ 
            success: false, 
            message: "유효한 진단을 위해서는 이메일, 직무 분야, 그리고 스캔 결과가 모두 필요합니다." 
        });
    }

    try {
        // E2E 플로우 실행 (State Machine 구동)
        const finalReport = await runFullDiagnosisFlow({ email, jobSector, scanResults });

        if (finalReport.finalStatus === 'PASS') {
            return res.status(200).json({ 
                success: true, 
                report: finalReport, 
                cta_required: false // 추가 액션 필요 없음
            });
        } else if (finalReport.finalStatus === 'PAST') {
            return res.status(200).json({ 
                success: true, 
                report: finalReport, 
                cta_required: false // 이미 구매 완료된 상태 가정
            });
        } else {
            // FAIL 상태는 패치 구매가 필수적임을 의미합니다.
            return res.status(412).json({ // HTTP 412 Precondition Failed 사용 (결제 전 조건 실패)
                success: false, 
                report: finalReport, 
                cta_required: true,
                suggested_tier: "PRO" // 강제로 PRO 티어 구매를 유도합니다.
            });
        }

    } catch (e) {
        // 서비스 로직 자체에서 발생한 치명적 오류 포착
        return res.status(400).json({ 
            success: false, 
            message: `요청 처리 실패: ${e.message}` 
        });
    }
};

module.exports = {
    diagnoseUser,
    errorHandler
};