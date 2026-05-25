// ====================================
// 🛠️ 코다리: 상태 전이 및 비즈니스 로직 구현 (State Machine)
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('defect-modal');
    const sections = document.querySelectorAll('.diagnosis-section');
    const t1Btn = document.getElementById('btn-t1-to-t2');
    const t2Btn = document.getElementById('btn-t2-to-t3');
    const purchaseBtn = document.getElementById('btn-purchase');

    // -------------------------------------
    // 1. 상태 전이 로직 (T1 -> T2 -> T3) 구현
    // -------------------------------------

    /**
     * 특정 섹션만 보이게 하고 나머지는 숨기는 함수.
     * @param {HTMLElement} activeSection - 보여줄 섹션 요소
     */
    function transitionState(activeSection, targetId) {
        sections.forEach(section => section.classList.add('hidden'));
        activeSection.classList.remove('hidden');

        // CSS 애니메이션 클래스 추가 (다음 단계로의 강제 전환 느낌 부여)
        if (targetId === 'T2') {
            document.getElementById('section-t2').style.animation = 'none';
            void document.getElementById('section-t2').offsetWidth; // Trigger reflow for animation reset
            document.getElementById('section-t2').style.animation = 'pop 0.5s ease forwards'; // Pop effect simulation (needs CSS definition)
        } else if (targetId === 'T3') {
             // T3에서는 더 강한 경고 애니메이션을 적용
            modal.style.boxShadow = '0 0 40px rgba(255, 0, 51, 1)';
        }

        console.log(`[SYSTEM STATE CHANGE] -> ${targetId} 섹션으로 전환 완료.`);
    }


    // T1 -> T2 Transition Handler (사용자 클릭)
    t1Btn.addEventListener('click', () => {
        transitionState(document.getElementById('section-t2'), 'T2');
    });

    // T2 -> T3 Transition Handler (사용자 클릭)
    t2Btn.addEventListener('click', () => {
        transitionState(document.getElementById('section-t3'), 'T3');
    });


    // -------------------------------------
    // 2. 결제 및 API 통합 로직 (Mocking & Testing)
    // -------------------------------------

    /**
     * Mock API 호출 함수: 백엔드와의 통신을 시뮬레이션합니다.
     * @param {string} tierId - 구매하려는 티어 ID (PRO, BASIC, ENTERPRISE)
     * @returns {Promise<object>} 가짜 응답 객체
     */
    async function mockPaymentProcessor(tierId) {
        console.log(`\n[API CALL] Initiating payment transaction for Tier: ${tierId}...`);

        // 1. 네트워크 지연 시뮬레이션 (불안감 조성 요소)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 2. 비즈니스 로직 검증: PRO 티어만 성공한다고 가정 (Anchor Effect 강화)
        if (tierId === 'PRO') {
            const successResponse = {
                success: true,
                transaction_id: `TX-${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
                message: "SYSTEM PATCH APPLIED SUCCESSFULLY. 시스템 안정성이 복구되었습니다.",
                user_status_update: true, // 상태 전이 강제 기록
            };
            console.log("[API SUCCESS] Payment confirmed. Status updated.");
            return successResponse;

        } else if (tierId === 'BASIC') {
             // 의도적으로 실패 경로를 만들어 구매 유도를 강제함.
            await new Promise(resolve => setTimeout(resolve, 1000));
            throw new Error("PAYMENT-FAIL: BASIC 티어는 현재 구조적 결함 레벨에 적합하지 않습니다. PRO 티어가 권장됩니다.");

        } else { // ENTERPRISE 또는 기타 실패 케이스
             await new Promise(resolve => setTimeout(resolve, 2000));
            throw new Error("CRITICAL-FAIL: 외부 인증 서버와 연결할 수 없습니다. 관리자에게 문의하십시오 (코드: AUTH-STRUC).");
        }
    }

    // 구매 버튼 이벤트 리스너
    purchaseBtn.addEventListener('click', async () => {
        const selectedTier = document.querySelector('.tier.pro').id; // PRO가 기본 선택된 상태 가정

        if (!selectedTier) {
            alert("오류: 구매할 패키지를 선택해주세요.");
            return;
        }

        // UI 잠금 및 로딩 시작 (사용자 행동 제어)
        purchaseBtn.disabled = true;
        purchaseBtn.textContent = '처리 중... 시스템 진단 대기';
        document.getElementById('section-t3').querySelector('.pricing-grid').style.opacity = 0.5;

        try {
            // Mock API 호출 실행
            const result = await mockPaymentProcessor(selectedTier);

            if (result.success) {
                alert(`✅ 구매 성공!\n[${result.message}]\nTX ID: ${result.transaction_id}`);
                modal.classList.add('hidden'); // 모달 닫기
            } else {
                 throw new Error("알 수 없는 결제 실패");
            }

        } catch (error) {
            // API 호출 실패 시, 정의된 Critical Error Tone을 사용하여 경고 출력
            const errorMessage = error.message || "시스템 연결 오류";
            alert(`🚨 [SYSTEM FAILURE] 거래가 완료되지 않았습니다.\n${errorMessage}\n(재시도하거나 다른 패키지를 확인하십시오.)`);

        } finally {
            // 로딩 종료 및 UI 복구
            purchaseBtn.disabled = false;
            purchaseBtn.textContent = '지금 바로 시스템 복구 패키지 구매';
            document.getElementById('section-t3').querySelector('.pricing-grid').style.opacity = 1;
        }
    });

    // 초기 로드 시 모달 활성화 (테스트 용이성)
    setTimeout(() => {
         modal.classList.remove('hidden');
         console.log("=============================================");
         console.log("✨ [DEV] Structural Defect Modal: Ready for testing.");
         console.log("=============================================");
    }, 100);

});
</script>