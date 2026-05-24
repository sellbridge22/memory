// 코다리 검증: State Transition Logic 및 결제 모듈 테스트 환경 구축
document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('hero-section');
    const diagnosisResultSection = document.getElementById('diagnosis-result-section');
    const pricingSection = document.getElementById('pricing-section');

    // --- 1. 진단 시작 버튼 (Hero) 로직 ---
    const startDiagnosisBtn = document.getElementById('start-diagnosis-btn');
    const upgradeBtn = document.getElementById('upgrade-btn');
    const purchaseBtn = document.getElementById('purchase-btn');
    let diagnosisComplete = false;

    // 1단계: 진단 시작 클릭 이벤트 (Hidden -> Diagnosis Result)
    startDiagnosisBtn.addEventListener('click', () => {
        console.log("SYSTEM LOG: Starting diagnostic process...");
        heroSection.classList.add('hidden'); // 히어로 섹션 숨김
        diagnosisResultSection.classList.remove('hidden'); // 진단 결과 표시
        upgradeBtn.disabled = false; // 버튼 활성화
    });

    // 2단계: 보고서 받기 버튼 (Diagnosis Result -> Pricing) 로직 구현
    upgradeBtn.addEventListener('click', () => {
        if (!diagnosisComplete) {
            console.log("SYSTEM LOG: Attempting to generate report...");
            purchaseBtn.disabled = false; // 구매 버튼 활성화 (다음 단계 유도)
            diagnosisResultSection.classList.add('hidden');
            pricingSection.classList.remove('hidden'); // 가격 섹션 표시
        } else {
             console.warn("LOGIC ERROR: 이미 패치가 적용되었습니다.");
        }
    });

    // 3단계: 구매 버튼 (State Transition Logic 핵심)
    purchaseBtn.addEventListener('click', () => {
        if (!purchaseBtn.hasAttribute('data-processed')) {
            console.log("SYSTEM LOG: Initiating PRO Patch Purchase Flow...");
            
            // 1. 상태 변화 로직 적용 (버튼 비활성화 및 메시지 표시)
            purchaseBtn.disabled = true;
            purchaseBtn.textContent = "✅ 결제 처리 중... 시스템 로그 전송 대기...";

            // 2. Mock 결제 모듈 호출 (실제 API 연동 대체)
            setTimeout(() => {
                // 실제로는 mock_payment_processor.js를 통해 비동기로 통신해야 함
                const success = processMockPayment($19900); // 가상의 $19,900 결제 시도
                displayPaymentResult(success);

            }, 2000); // 2초 지연 후 결과 표시 (사용자 경험 유도)
        } else {
             alert("이미 처리된 거래입니다.");
        }
    });


    // =========================================================
    // [테스트 모듈] Mock 결제 로직 및 UI 업데이트 함수
    // =========================================================

    /** 가짜 결제 프로세서 실행 (실제 API 연동 전 단계) */
    function processMockPayment(amount) {
        console.log(`[MOCK PAYMENT]: ${amount}를 처리합니다.`);
        // 실제 로직에서는 외부 서버 호출이 이루어짐
        return Math.random() > 0.1; // 90% 성공, 10% 실패 모의 테스트
    }

    /** 결제 결과 UI에 반영 */
    function displayPaymentResult(success) {
        const priceCard = document.getElementById('pro-upgrade-card');
        let messageDiv = document.querySelector('#pricing-section .payment-message');
        
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.className = 'payment-message';
            priceCard.appendChild(messageDiv);
        }

        // 버튼 상태 복구 및 최종 결과 표시
        purchaseBtn.disabled = true; // 구매는 성공하든 실패하든 재시도 불가
        purchaseBtn.setAttribute('data-processed', 'true'); 

        if (success) {
            messageDiv.className = 'payment-message success';
            messageDiv.innerHTML = `🎉 SUCCESS: ${$19900} 결제 완료! 시스템 패치가 정상 적용되었습니다. (로그 ID: 837A)`;
            alert("✅ [SYSTEM]: PRO Patch가 성공적으로 적용되었습니다. 다음 단계로 이동해주세요.");
        } else {
            messageDiv.className = 'payment-message failure';
            messageDiv.innerHTML = `❌ FAILURE: 결제 실패! 카드 정보 또는 시스템 로그에 오류가 있습니다. 다시 시도하거나 문의하세요.`;
            alert("⚠️ [SYSTEM]: 결제 오류가 발생했습니다. 재시도를 해보세요.");
        }
    }

});

</script>