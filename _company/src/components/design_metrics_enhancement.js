// 이 JS 코드를 기존 script 태그 내에 통합하고, 초기화 함수를 호출합니다.
function initContextDrainBar() {
    const drainBar = document.getElementById('context-drain');
    let currentValue = 100;

    setInterval(() => {
        if (currentValue > 0) {
            // 매 50ms 마다 1~2의 값을 감소시키며 부드럽게 업데이트
            currentValue -= Math.floor(Math.random() * 3) + 1;
            drainBar.style.width = `${currentValue}%`;

            if (currentValue < 20) {
                // 임계점 도달 시, 주변 UI에 미세한 깜빡임 CSS 클래스 추가를 요청합니다.
                document.body.classList.add('critical-warning-flicker');
            }
        } else {
            clearInterval(this);
        }
    }, 50); // 느리고 꾸준하게 감소 (Slow Decay Rate)
}

function initializePfcMeter() {
    const pfcGauge = document.getElementById('pfc-index-meter');
    setInterval(() => {
        // Math.random을 사용하여 미세한 불안정성(Flicker) 구현
        let randomFluctuation = (Math.random() * 2 - 1).toFixed(1); // -1.0 ~ 1.0
        let currentVal = parseFloat(pfcGauge.dataset.value || '75');
        let newValue = Math.min(100, Math.max(30, currentVal + randomFluctuation));

        pfcGauge.textContent = `${newValue}%`;
        pfcGauge.dataset.value = newValue;
    }, 300); // 300ms 간격으로 떨림 애니메이션 발생
}