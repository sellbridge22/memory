/**
 * @description GET /api/v1/diagnostic-report 엔드포인트 MVP Stub 구현
 * 이 함수는 실제 DB나 복잡한 로직 호출 없이, 정의된 규칙에 따라 가짜(Mock) 보고서를 반환합니다.
 */

import { DiagnosticApiResponse } from '../types/diagnostic-types';
// 임시 모킹 데이터 (실제로는 외부 서비스에서 가져옴)
const MOCK_DATABASE = {
    "user@example.com": {
        email: "user@example.com",
        jobSector: "tech",
        scanResults: ["A1", "B3"],
        isCritical: true // 초기 테스트를 위해 Critical 상태로 설정
    }
};

/**
 * 사용자 데이터를 받아 진단 보고서를 모킹하여 생성합니다.
 * @param req - Express Request 객체 (Query Params 사용 가정)
 * @returns {Promise<DiagnosticApiResponse>} 구조화된 API 응답
 */
export const getDiagnosticReport = async (req: any): Promise<DiagnosticApiResponse> => {
    const { email } = req.query;

    // 1. 필수 입력값 유효성 검사 (가장 먼저 실패 케이스를 처리해야 함)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return {
            success: false,
            message: "진단 보고서 요청 실패",
            error: {
                code: "INVALID-INPUT",
                userMessage: "요청된 이메일 주소의 형식이 올바르지 않습니다. 다시 확인해주세요.",
                suggestedAction: "유효한 형식의 이메일 주소를 입력하고 재진단을 시도하세요."
            }
        };
    }

    // 2. 데이터베이스 조회 모킹 (실제로는 여기서 DB 호출)
    const userData = MOCK_DATABASE[email];
    if (!userData) {
         return {
            success: false,
            message: "사용자 정보 없음",
            error: {
                code: "USER-NOT-FOUND",
                userMessage: `ID ${email}에 대한 기록을 찾을 수 없습니다.`,
                suggestedAction: "회원가입 또는 로그인 절차를 먼저 완료해주세요."
            }
        };
    }

    // 3. 비즈니스 로직 시뮬레이션 (진단 보고서 생성)
    const deficiencies = [];
    let stabilityIndex = 100; // 기본값: 완벽함

    if (userData.isCritical) {
        // Researcher가 정의한 핵심 변수들을 모킹하여 주입
        deficiencies.push({
            defectId: "AUTH-STRUC",
            displayTitle: "인증 구조 무결성 위협 (Authentication Structure Integrity Breach)",
            severityLevel: "Critical",
            explanationTexts: [
                "현재 사용자의 인증 구조체에 시간 경과에 따른 무결성 저하가 감지되었습니다. 시스템 로그 기록 상, 세션 키의 유효 기간 만료로 인한 데이터 비일관성이 예측됩니다.",
                "OAuth 토큰 스코프 범위 재검토가 필요하며, 이는 접근 권한의 구조적 결함에 해당합니다."
            ],
            requiredAction: "Authentication"
        });

        deficiencies.push({
            defectId: "COMPLIANCE-RISK",
            displayTitle: "규제 준수 취약성 감지 (Regulatory Compliance Vulnerability)",
            severityLevel: "High",
            explanationTexts: [
                "처리 중인 데이터는 현행 GDPR의 데이터 거주지(Data Residency) 규정 기준을 충족하지 못할 위험이 있습니다.",
                "개인정보 수집 및 이용 동의 범위가 불명확하여, 법적 책임 소재 측면에서 구조적인 취약점이 발견되었습니다."
            ],
            requiredAction: "Compliance"
        });

        stabilityIndex = 35; // Critical 상태로 설정
    } else {
         // 안정적인 사용자 케이스 (테스트용)
         deficiencies.push({
            defectId: "NONE",
            displayTitle: "시스템 구조적 이상 없음",
            severityLevel: "Medium",
            explanationTexts: ["현재 시스템 환경은 최적의 상태로 판단됩니다."],
        });
    }

    // 4. 성공 응답 반환
    const reportData = {
        userId: userData.email,
        scanTimestamp: new Date().toISOString(),
        stabilityIndex: stabilityIndex,
        deficiencies: deficiencies
    };

    return {
        success: true,
        message: "진단 보고서가 성공적으로 생성되었습니다.",
        data: reportData
    }
}