/**
 * @typedef {object} ScanResult
 * @property {string} scanId - 스캔된 데이터의 고유 ID (e.g., A1, B3)
 * @property {number} confidenceScore - 시스템이 판단한 신뢰도 점수 (0-100)
 */

/**
 * @typedef {object} UserInputPayload
 * @property {string} email - 사용자 이메일 주소 (필수)
 * @property {string} jobSector - 직업군 (Operational Sector, 필수)
 * @property {ScanResult[]} scanResults - 스캔된 데이터 배열 (최소 1개 필요)
 * @property {number} timestamp - 요청 시간 (Epoch time)
 */

/**
 * @typedef {object} DefectResponsePayload
 * @property {boolean} success - API 호출 성공 여부. 실패 시 false여야 함.
 * @property {string} api_status - HTTP 상태 코드와 연관된 내부 상태 ('SUCCESS', 'FAILURE').
 * @property {string} defectCode - 핵심 오류 코드 (e.g., AUTH-STRUC, PAYMENT-FAIL). 반드시 시스템 정의 코드를 사용해야 합니다.
 * @property {string} message - 사용자에게 보여줄 구조화된 에러 메시지.
 * @property {Object} [details] - 추가적인 디버깅/개발용 상세 정보 (선택 사항).
 */

/**
 * 📌 예시: 실패 시 페이로드 구조 (Frontend에서 이 형태를 예상해야 함)
 * const failurePayload = {
 *     success: false,
 *     api_status: 'FAILURE',
 *     defectCode: "AUTH-STRUC", // 시스템적 결함 코드
 *     message: "시스템 구조적 결함 감지: 필수 컴플라이언스 프로토콜 위반.",
 *     details: {
 *         requiredModule: "LegalValidationService",
 *         suggestedAction: "PRO 플랜 업그레이드 필요"
 *     }
 * };
 */