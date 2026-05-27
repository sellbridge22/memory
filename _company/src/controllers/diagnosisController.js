/**
 * @fileoverview Diagnosis API Controller: 요청 처리 및 상태 전이 강제 
 * 이 모듈은 비즈니스 트랜잭션의 진입점(Entry Point)입니다.
 */

const { calculatePELSScore } = require('../services/DiagnosisService');
// 가상의 외부 서비스 (실제로는 DB 또는 별도 State Service 호출)
const mockUserService = require('./mockUserService'); 

/**
 * @typedef {Object} DiagnosisRequest
 * @property {string} email - 사용자 이메일.
 * @property {string} jobSector - 직무 분야.
 * @property {Array<string>} scanResults - 진단 스캔 결과 배열 (A1, B3 등).
 */

/**
 * 🚀 POST /api/v1/diagnosis
 * 사용자의 데이터를 받아 PELS 점수를 산출하고, 다음 단계(CTA)를 결정하며, 사용자 상태를 업데이트합니다.
 * @param {DiagnosisRequest} req - 요청 본문 데이터
 * @returns {Promise<{success: boolean, data: Object, nextAction: string}>}
 */
const getDiagnosisReport = async (req) => {
    const { email, jobSector, scanResults } = req;

    if (!email || !jobSector || !scanResults || scanResults.length === 0) {
        // [근거: 코다리 검증된 지식] - 필수 입력값 유효성 검사 강화
        return { success: false, message: "필수 진단 데이터를 모두 제공해야 합니다.", nextAction: 'INPUT_REQUIRED' };
    }

    try {
        // 1. PELS 점수 산출 (핵심 로직 호출)
        const result = calculatePELSScore(jobSector, scanResults);
        const pelsScore = result.score;
        const riskLevel = result.riskLevel;

        let nextAction = 'VIEW_REPORT'; // 기본 다음 액션 설정

        // 2. 상태 전이 및 다음 CTA 강제 (State Transition Logic)
        if (pelsScore < 50 && riskLevel === 'LOW') {
            // 점수가 너무 낮으면 경고 메시지 없이 그냥 끝내면 안됨.
            nextAction = 'INSUFFICIENT_DATA'; // 데이터가 부족해 추가 진단 필요 유도
            await mockUserService.updateUserStatus(email, 'UNDIAGNOSED_LOW');
        } else if (pelsScore >= 80 && riskLevel === 'CRITICAL') {
             // Critical Error: 가장 강한 공포 자극 -> Pro 솔루션 구매 유도
            nextAction = 'PRO_PURCHASE'; 
            await mockUserService.updateUserStatus(email, 'POTENTIAL_LOSS_DETECTED'); // 상태 변경 기록
        } else {
            // 중간 단계: 보고서 열람 후 추가 진단 권장
             nextAction = 'VIEW_REPORT_CTA';
             await mockUserService.updateUserStatus(email, 'DIAGNOSED_PENDING_REVIEW');
        }

        return { 
            success: true, 
            data: result, 
            message: `진단 완료. 위험 레벨: ${riskLevel}. 다음 조치: ${nextAction}`,
            nextAction: nextAction // 프론트엔드가 이 값을 보고 어떤 UI를 보여줄지 결정
        };

    } catch (error) {
        console.error("Diagnosis API Error:", error);
        // 시스템 오류 발생 시, 가장 강한 공포 메시지를 반환하도록 설계
        return { 
            success: false, 
            message: "시스템 아키텍처에 치명적인 결함이 감지되었습니다. (ERROR_CODE: SYS-900)", 
            nextAction: 'SYSTEM_CRITICAL_FAILURE' // 경고 모달 트리거
        };
    }
};

module.exports = { getDiagnosisReport };