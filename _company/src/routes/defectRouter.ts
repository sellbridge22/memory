import { Router } from 'express';
import { validateSignatureAndProcess } from '../controllers/defectController';

const router = Router();

// POST /api/v1/validate-signature
router.post('/validate-signature', async (req: any, res: any) => {
    try {
        const result = await validateSignatureAndProcess(req);
        if (!result.success) {
            // 실패 시 HTTP 403 Forbidden과 함께 구조화된 오류 페이로드를 반환합니다.
            return res.status(403).json({
                error: "Access Denied",
                details: result // 클라이언트가 이 구조를 파싱하도록 강제함
            });
        }
        // 성공 시 200 OK와 함께 결과를 반환합니다.
        res.status(200).json(result);

    } catch (error) {
        console.error("Gateway Error:", error);
        // 치명적인 서버 오류 발생 시에도, 최대한 구조화된 에러 메시지를 반환하는 것이 원칙입니다.
        res.status(500).json({
            success: false,
            api_status: 'FAILURE',
            defectCode: "SERVER-FAIL",
            message: "서버 처리 중 예기치 않은 시스템 오류가 발생했습니다. 관리자에게 문의하세요.",
            details: {}
        });
    }
});

export default router;