/**
 * @fileoverview E2E State Engine for Mini-Module Funnel Prototype.
 * 이 스크립트는 진단 모달의 모든 상태 변화와 인터랙션 지점을 제어합니다.
 */

// ----------------------------------------
// [MOCK API LAYER] - 실제 백엔드 호출을 시뮬레이션합니다.
// ----------------------------------------

/**
 * @description 사용자 입력 데이터를 서버로 전송하고 '진단 점수'를 받아옵니다.
 * @param {object} userData - 사용자의 입력 데이터 (email, jobSector, scanResults)
 * @returns {Promise<{score: number, status: string}>} 가상의 진단 결과 객체
 */
const mockApiDiagnosisScore = async (userData) => {
    console.log(`[API CALL] Sending data to /api/diagnosis_score...`, userData);

    // 0.5초의 로딩 지연을 시뮬레이션하여 '시스템 처리 중' 불안감을 조성합니다.
    await new Promise(resolve => setTimeout(resolve, 500)); 

    // Mock Logic: 데이터 유무에 따라 점수를 강제 결정하여 테스트 가능하게 만듭니다.
    const score = userData.scanResults && userData.scanResults.length > 1 ? Math.floor(Math.random() * 30) + 75 : 40;

    let status = 'NORMAL';
    if (score < 60) {
        status = 'CRITICAL_DEFECT'; // 시스템 오류 조건 발생
    } else if (score >= 90) {
        status = 'OPTIMAL';
    }
    
    console.log(`[API SUCCESS] Diagnosis Score Received: ${score}, Status: ${status}`);
    return { score: score, status: status };
};

/**
 * @description 결제 게이트웨이 연결을 시뮬레이션합니다.
 * 실제로는 Stripe/PayPal SDK 호출이 들어갑니다.
 */
const mockPaymentProcessor = async (email, tierId) => {
    console.log(`[API CALL] Initiating payment for ${tierId} on ${email}...`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 결제 처리 시간 시뮬레이션

    if (tierId === 'PRO' || tierId === 'ENTERPRISE') {
        console.log('[PAYMENT SUCCESS] Transaction Complete.');
        return true;
    } else {
        console.error('[PAYMENT FAILURE] Invalid Tier ID or Payment Issue.');
        return false;
    }
};

// ----------------------------------------
// [CORE STATE MANAGEMENT & FLOW CONTROL]
// ----------------------------------------

let currentState = 'INPUT_STAGE'; // 초기 상태: 사용자 입력
const $diagnosisModal = document.getElementById('mini-module-diagnosis-modal');

/**
 * @description 전체 플로우를 관리하는 메인 핸들러 함수입니다.
 * @param {object} inputData - 사용자가 수집한 모든 데이터
 */
const processDiagnosisFlow = async (inputData) => {
    console.clear();
    $diagnosisModal.innerHTML = '<div id="processing-state">⚙️ 시스템 분석 중... 잠시만 기다려주세요.</div>';

    // 1. [STATE: PROCESSING] - 데이터 전송 및 점수 계산
    try {
        const result = await mockApiDiagnosisScore(inputData);
        let score = result.score;
        let status = result.status;

        currentState = 'WARNING_STAGE';
        console.log(`[FLOW TRANSITION] -> WARNING_STAGE (Score: ${score})`);
        
        // 2. [STATE: WARNING] - 결과 보고 및 경고 메시지 표시
        displayWarningState(score, status);

    } catch (error) {
        currentState = 'ERROR_STAGE';
        console.error("Fatal Error during diagnosis:", error);
        $diagnosisModal.innerHTML = '<div id="error-state">⚠️ CRITICAL SYSTEM FAILURE: 내부 오류가 발생했습니다.</div>';
    }
};

/**
 * @description 경고 상태의 UI를 업데이트하고, 다음 행동(구매)을 유도합니다.
 */
const displayWarningState = (score, status) => {
    // 1. Fixed-Grid 레이아웃에 '진단 점수'와 '위험 요소'를 시각화합니다.
    document.getElementById('diagnosis-result').innerHTML = `<h2>🚨 진단 결과: ${status}</h2><p>현재 시스템 안정성 지수는 ${score}/100 입니다.</p>`;

    // 2. 임계치 검사 및 경고 애니메이션 강제 실행 (가장 중요한 디버깅 포인트)
    const warningDiv = document.getElementById('risk-alert');
    if (status === 'CRITICAL_DEFECT') {
        warningDiv.style.backgroundColor = '#ff4d4d'; // Red Flash
        console.warn("🚨 [ALERT TRIGGERED] Critical Defect Detected! Warning animation started.");
        // 실제 구현 시, 여기에 setInterval을 사용한 글리치/깜빡임 애니메이션 클래스 추가 필요
    } else {
         warningDiv.style.backgroundColor = '#4CAF50'; // Green Light
    }

    // 3. CTA 활성화 및 다음 단계 구매 유도 (강제 전환)
    const ctaSection = document.getElementById('pro-cta');
    if (score < 70) {
        ctaSection.innerHTML = `<h3>[필수 조치] 시스템 결함 패치가 필요합니다.</h3><p>현재 구조적 결함(AUTH-STRUC 코드 유사 패턴)이 감지되었습니다.</p>`;
        // 버튼 활성화 및 이벤트 리스너 부착
        document.getElementById('buy-pro-button').disabled = false; 

    } else {
         ctaSection.innerHTML = `<h3>[최적 상태] 시스템 안정성이 높습니다.</h3><p>추가 진단이 필요할 수 있습니다.</p>`;
         document.getElementById('buy-pro-button').disabled = true; // 구매 버튼 비활성화
    }

    // 4. 결제 로직 연결 (구매 버튼 클릭 시)
    document.getElementById('buy-pro-button').onclick = async () => {
        const tierId = document.querySelector('input[name="tier"]:checked')?.value || 'PRO';
        if (!tierId) return;

        // [STATE: PAYMENT] - 결제 프로세스 시작
        $diagnosisModal.innerHTML = '<div id="payment-state">💳 안전하게 결제 처리 중...</div>';
        await mockPaymentProcessor(inputData.email, tierId); 
    };
};

// 초기화 및 이벤트 리스너 설정 (실제 HTML에 연결될 부분)
window.initDiagnosisFlow = () => {
    const emailInput = document.getElementById('email');
    const jobSectorInput = document.getElementById('job-sector');
    const scanResults = Array.from(document.querySelectorAll('.scan-result-checkbox:checked')).map(el => el.value);

    // 폼 제출 이벤트 리스너 연결 (실제 HTML 구조에 따라 수정 필요)
    const submitBtn = document.getElementById('submit-diagnosis');
    if (submitBtn) {
        submitBtn.onclick = async () => {
            const inputData = {
                email: emailInput ? emailInput.value : null,
                jobSector: jobSectorInput ? jobSectorInput.value : null,
                scanResults: scanResults
            };
            if (!inputData.email) {
                 alert("이메일 주소를 반드시 입력해주세요.");
                 return;
            }
            await processDiagnosisFlow(inputData);
        };
    }
};

// 초기화 실행 (브라우저 로드 시)
document.addEventListener('DOMContentLoaded', window.initDiagnosisFlow);