/**
 * @fileOverview '사인하기' 액션에 대한 API 컨트롤러 (API Gateway 역할)
 * 이 파일은 클라이언트의 요청을 받아 핵심 비즈니스 로직인 purchaseService를 호출합니다.
 */

const { processSignAttempt } = require('../services/purchaseService');

// 예시: Express 라우터 핸들러 스타일
exports.handleSignRequest = async (req, res) => {
    try {
        // 1. 요청 본문에서 사용자 정보 추출
        const user = req.body; // { email: "user@example.com", ... } 등 예상 구조

        // 2. 비즈니스 로직 게이트웨이 호출 (핵심)
        const result = await processSignAttempt(user);

        if (!result.success) {
            // 성공하지 않았고, 명확한 에러 코드가 반환되었을 경우
            console.log(`[API Handler] 구조적 결함 감지 및 강제 오류 처리: ${result.errorCode}`);
            // 클라이언트에게 200 OK와 함께 '에러' 응답 객체를 보내서 UI/State Machine이 이 데이터를 읽게 함 (UX 통제)
            return res.status(403).json({
                status: 'FAILURE', // FAILURE 상태 전이를 명시
                error: {
                    code: result.errorCode, 
                    message: result.message
                }
            });
        }

        // 성공 케이스 (이 플로우에서는 발생해서는 안 됩니다)
        res.status(200).json({ status: 'SUCCESS', message: 'Sign completed.' });

    } catch (error) {
        console.error("Unhandled Error in Sign Controller:", error);
        res.status(500).json({ 
            status: 'FAILURE', 
            error: { code: "SERVER-ERROR", message: "시스템 처리 중 오류가 발생했습니다." }
        });
    }
};