// 이 파일은 실제 API 호출을 시뮬레이션하는 더미 스크립트입니다.
// 실제 환경에서는 이곳에 Stripe, PayPal 등의 SDK 연동 코드가 들어갑니다.

/**
 * @param {number} amount - 결제 금액 (숫자)
 * @returns {boolean} 성공 여부 (true/false)
 */
function processPayment(amount) {
    console.log(`[MOCK PROCESSOR]: ${amount}를 서버로 전송 시도...`);
    // 시간 지연을 통해 비동기 통신 느낌 부여
    return new Promise((resolve) => {
        setTimeout(() => {
            // 10% 확률로 실패하는 모의 테스트 로직
            const success = Math.random() > 0.1;
            if (success) {
                console.log("[MOCK PROCESSOR]: Transaction successful.");
                resolve(true); // 성공
            } else {
                console.error("[MOCK PROCESSOR]: Gateway error detected.");
                resolve(false); // 실패
            }
        }, 1500);
    });
}

// 실제 구현 시, 이 함수가 scripts.js의 purchaseBtn 이벤트 리스너에서 호출되어야 합니다.