// apiService.js (Mock API Layer)
/** 
 * 실제 백엔드 호출을 시뮬레이션하는 레이어입니다. 
 * 모든 외부 통신은 이 모듈을 통해서만 이루어져야 합니다. [근거: 코다리 개인 메모리]
 */
export async function analyzeDataMockApi(formData) {
    console.log(`[API Call]: Starting diagnosis for ${formData.email} (Sector: ${formData.jobSector})`);

    // 1. API 호출 지연 시뮬레이션 (사용자 경험 증폭을 위한 의도적 Delay)
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기

    // 2. 에어갭 환경/네트워크 실패 시나리오 테스트
    if (!navigator.onLine) {
        throw new Error("NETWORK-FAILURE: 현재 시스템은 오프라인 상태입니다. 진단 데이터 전송에 실패했습니다.");
    }
    
    // 3. 성공적으로 데이터를 받았다고 가정하고, 가상의 분석 로직 실행 (T2의 최종 결과물을 Mock)
    const mockResult = {
        status: 'CRITICAL_DEFECT',
        title: "구조적 결함 발견: 시스템 로그 무결성 검증 실패",
        description: `진단된 데이터 구조에서 ${formData.jobSector} 분야에 특화된 Critical Defect(AUTH-STRUC)가 감지되었습니다. 즉각적인 패치가 필요합니다.`,
        recommendation: "PRO 또는 ENTERPRISE 티어로 시스템 로그를 업그레이드하여 결함을 수정하십시오.",
        defectCode: 'AUTH-STRUC', // 핵심 경고 코드
    };

    return mockResult;
}