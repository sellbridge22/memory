import { DefectResponsePayload } from '../schemas/defect_payload';

/**
 * @param {Object} req - Express request object
 * @returns {Promise<DefectResponsePayload>} 구조화된 결함 페이로드를 반환합니다.
 */
export const validateSignatureAndProcess = async (req: any): Promise<DefectResponsePayload> => {
    const { email, jobSector, scanResults } = req.body;

    // 1. 필수 입력값 검증 (Basic Validation)
    if (!email || !jobSector || !scanResults || scanResults.length === 0) {
        return {
            success: false,
            api_status: 'FAILURE',
            defectCode: 'INPUT-MISSING', // 새로운 코드 정의
            message: "요청 데이터가 불완전합니다. 모든 필수 필드를 채워주세요.",
            details: {}
        };
    }

    // 2. 비즈니스 로직 시뮬레이션 (Mock Logic)
    // 핵심 목표: 특정 조건을 만나면 '시스템적 결함'을 강제 발생시켜야 함.
    const isSystemDefect = jobSector === "legal" && scanResults[0].confidenceScore < 70;

    if (isSystemDefect) {
        console.warn("🚨 [ALERT] 구조적 결함 감지: AUTH-STRUC 트리거.");
        // Designer가 정의한 Critical System Defect Modal의 페이로드를 반환
        return {
            success: false,
            api_status: 'FAILURE',
            defectCode: "AUTH-STRUC", // 가장 중요한 시스템 코드로 강제 전이
            message: "시스템 구조적 결함 감지: 법적 무결성(Legal Integrity) 프로토콜 위반. 셀브릿지 Enterprise 모듈 진단이 필요합니다.",
            details: {
                requiredModule: "LegalValidationService",
                suggestedAction: "PRO 플랜 업그레이드 또는 수동 검증 요청"
            }
        };
    }

    // 3. 성공 시나리오 (Success Path) - 실제 로직은 여기서 진행됩니다.
    return {
        success: true,
        api_status: 'SUCCESS',
        defectCode: 'OK',
        message: "진단 요청이 정상적으로 접수되었습니다.",
        details: {}
    };
};