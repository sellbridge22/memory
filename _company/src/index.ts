import { diagnoseService } from './services/diagnosisService';

// ------------------------------------------------------
// TEST CASE 1: CRITICAL FAILURE (S0 -> S2)
// 구조적 결함(AUTH-STRUC)이 감지되어 PRO Kit 구매가 강제되는 경우.
// ------------------------------------------------------
const criticalRequest = {
    email: "user@critical.com",
    jobSector: "finance",
    scanResults: [{
        scanId: "C1",
        defectCode: "AUTH-STRUC", // 핵심 트리거
        severityLevel: 'HIGH',
        description: "인증 구조의 취약성 발견"
    }],
    timestamp: new Date().toISOString()
};

console.log("================================================");
console.log("🚀 [테스트 1] CRITICAL FAILURE 시나리오 (S0 -> S2 강제 전이)");
const result1 = diagnoseService.diagnose(criticalRequest);
console.log(">>> 결과:", JSON.stringify(result1, null, 2));


// ------------------------------------------------------
// TEST CASE 2: SAFE PASS (S0 -> S1)
// 결함이 없어 안전한 경우.
// ------------------------------------------------------
const safeRequest = {
    email: "user@safe.com",
    jobSector: "tech",
    scanResults: [{
        scanId: "A1",
        defectCode: "OK-CODE",
        severityLevel: 'LOW',
        description: "정상 작동 범위 내"
    }],
    timestamp: new Date().toISOString()
};

console.log("\n================================================");
console.log("✅ [테스트 2] SAFE PASS 시나리오 (S0 -> S1 안전 유지)");
const result2 = diagnoseService.diagnose(safeRequest);
console.log(">>> 결과:", JSON.stringify(result2, null, 2));


// ------------------------------------------------------
// TEST CASE 3: MEDIUM WARNING (S0 -> S1)
// 경미한 결함이 감지되어 주의가 필요한 경우.
// ------------------------------------------------------
const warningRequest = {
    email: "user@warning.com",
    jobSector: "marketing",
    scanResults: [{
        scanId: "B3",
        defectCode: "DATA-MISMATCH",
        severityLevel: 'MEDIUM', // HIGH가 아니지만 경고 수준인 경우
        description: "데이터 필드의 불일치"
    }],
    timestamp: new Date().toISOString()
};

console.log("\n================================================");
console.log("⚠️ [테스트 3] MEDIUM WARNING 시나리오 (S0 -> S1 경고 발생)");
const result3 = diagnoseService.diagnose(warningRequest);
console.log(">>> 결과:", JSON.stringify(result3, null, 2));
console.log("================================================");