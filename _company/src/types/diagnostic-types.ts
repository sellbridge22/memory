/**
 * @description 셀브릿지 진단 보고서 API의 핵심 데이터 계약(Data Contract) 정의
 * 이 스펙은 모든 클라이언트와 서버 간에 공유되어야 하는 단일 진실 공급원입니다.
 */

// 1. 개별 결함 변수 (Structural Deficiency) 스펙
export interface StructuralDeficiency {
    /** 오류 고유 ID (예: AUTH-STRUC, COMPLIANCE-RISK). 이는 리포팅 및 로직 처리에 사용됨. [근거: Researcher 산출물] */
    defectId: string; 
    /** 사용자에게 보여질 전문적인 제목 (User Facing Title) */
    displayTitle: string; 
    /** 심각도 레벨 (Critical, High, Medium). 이 값에 따라 UI의 경고 강도가 결정됨. [근거: Researcher 산출물] */
    severityLevel: 'Critical' | 'High' | 'Medium'; 
    /** 사용자에게 보여줄 구체적인 설명/원인 분석 문구 배열 (최소 2개 이상 제공 필요) */
    explanationTexts: string[]; 
    /** 해당 결함을 해결하기 위한 필수 조치(패치)의 종류. */
    requiredAction?: 'Authentication' | 'Compliance' | 'DataStructure';
}

// 2. 전체 진단 보고서 구조 (Root Response Object)
export interface DiagnosticReport {
    /** API 호출 시 사용된 사용자 식별자 (Email 또는 Session ID). */
    userId: string;
    /** 진단이 수행된 타임스탬프 (UTC 기준). */
    scanTimestamp: Date;
    /** 전반적인 시스템 안정성 지수. 100점 만점으로, 낮은 점수는 구조적 결함을 의미함. [근거: Designer 산출물] */
    stabilityIndex: number; 
    /** 감지된 모든 핵심 오류 목록. 이 배열의 길이가 길수록 위험도가 높다고 판단됨. */
    deficiencies: StructuralDeficiency[];
}

// 3. API 응답 타입 정의
export interface DiagnosticApiResponse {
    success: boolean;
    message: string;
    data?: DiagnosticReport | null; // 성공 시 진단 보고서 데이터 포함
    error?: {
        code: string;          // 시스템 에러 코드 (예: INVALID-INPUT, SERVER-ERROR)
        userMessage: string;   // 사용자 친화적인 오류 메시지
        suggestedAction: string;// 다음 행동 가이드라인 (예: "이메일 주소를 확인해주세요.")
    }
}