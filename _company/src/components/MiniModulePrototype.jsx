import React, { useState, useEffect, useCallback } from 'react';
import './MiniModulePrototype.css'; // CSS는 별도로 생성한다고 가정합니다.

// --- 🛠️ MOCK API / CORE LOGIC FUNCTIONS ---
// 실제 백엔드 호출을 시뮬레이션하는 함수입니다.
const calculatePels = (elapsedTimeSeconds) => {
    // PELS: Potential Economic Loss Score. 시간이 지날수록 가속도가 붙는 구조.
    const baseRate = 0.1; // 초기 손실률
    const accelerationFactor = Math.pow(elapsedTimeSeconds / 3600, 2); // 시간 경과에 따른 가중치 적용
    return parseFloat((baseRate + (elapsedTimeSeconds * 0.05) + (accelerationFactor * 0.01)).toFixed(2));
};

const handlePurchase = async (selectedTierId) => {
    console.log(`[API Call] Initiating purchase for Tier: ${selectedTierId}...`);
    // 실제로는 백엔드의 결제 게이트웨이와 통신합니다.
    await new Promise(resolve => setTimeout(resolve, 1500)); // 네트워크 지연 시뮬레이션
    if (Math.random() > 0.1) { // 성공률 90% 가정
        console.log("[SUCCESS] Payment processed. User status updated.");
        alert(`✅ [SYSTEM SUCCESS] ${selectedTierId} 티어 구매가 완료되었습니다. 시스템 안정화가 시작됩니다.`);
        return true;
    } else {
        console.error("[FAILURE] Critical payment gateway error detected (AUTH-STRUC).");
        alert("🚨 [SYSTEM ERROR] 결제 게이트웨이 오류 발생! 잠재적 손실액(PELS)이 증가하고 있습니다.");
        return false;
    }
};

// --- 🕰️ MAIN COMPONENT ---
const MiniModulePrototype = () => {
    // State Management: PELS와 타이머 상태를 관리합니다.
    const [pelsScore, setPelsScore] = useState(0.0);
    const [timeLeft, setTimeLeft] = useState(48 * 60 * 60); // 초기값: 48시간
    const [isSystemCritical, setIsSystemCritical] = useState(false);
    const [selectedTier, setSelectedTier] = useState('PRO');

    // PELS 및 타이머 로직을 관리하는 useEffect Hook입니다. (핵심 디버깅 영역)
    useEffect(() => {
        console.log("--- ⚙️ Prototype: System Logic Start ---");
        let intervalId;

        intervalId = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 0) {
                    clearInterval(intervalId);
                    return 0;
                }
                const newTime = prevTime - 60; // 1분 간격으로 시간 감소 시뮬레이션
                setPelsScore(prevPels => {
                    // PELS는 시간이 지남에 따라 실시간 계산됩니다.
                    const totalElapsedSeconds = (48 * 3600) - newTime;
                    return calculatePels(totalElapsedSeconds);
                });
                return newTime;
            });

            // [🔥 Critical Interlock Check] PELS와 타이머를 연동하는 로직입니다.
            if (timeLeft < 12 * 60 * 60 && !isSystemCritical) { // 남은 시간이 12시간 이하로 떨어지면 경고 발동
                setIsSystemCritical(true);
                console.warn("🚨 SYSTEM ALERT: Critical Time Threshold Reached!");
            }

        }, 1000); // 실제로는 1초 간격으로 실행되어야 하지만, UI 가독성을 위해 1분 단위로만 상태 업데이트를 시뮬레이션합니다.

        // Cleanup function (매우 중요!)
        return () => {
            clearInterval(intervalId);
            console.log("--- 🗑️ Prototype: System Logic Cleaned Up ---");
        };
    }, [timeLeft, isSystemCritical]); // 의존성 배열에 상태 변수를 넣어 로직 재실행 방지

    // 타이머 포맷팅 함수
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // UI 렌더링 로직 (System Warning 강조)
    const renderWarningMessage = () => {
        if (isSystemCritical && timeLeft > 0) {
            return <p className="warning-message">🚨 시스템 경고: 현재 PELS 점수({pelsScore.toFixed(2)})가 임계치에 근접했습니다. 즉각적인 구조적 패치가 필요합니다.</p>;
        } else if (timeLeft <= 0) {
             return <h1 className="system-failure">[SYSTEM FAILURE] 시간 초과! 서비스 이용이 불가능합니다.</h1>;
        }
        return null;
    };

    // 결제 처리 핸들러
    const handlePurchaseClick = async () => {
        if (pelsScore === 0) return; // PELS가 없으면 구매 불가 상태 시뮬레이션

        const success = await handlePurchase(selectedTier);
        if (!success) {
            // 결제 실패 시, PELS를 추가로 증가시키고 경고를 강화하는 로직을 여기에 넣습니다.
            setPelsScore(prev => prev + 5.0);
        }
    };

    return (
        <div className={`container ${isSystemCritical ? 'critical-mode' : ''}`}>
            <h1>Mini-Module 진단 및 패치 플로우</h1>

            {/* 1. 타이머 및 경고 모듈 */}
            <div className="system-header">
                <p>남은 시간: <span className={`timer ${isSystemCritical ? 'flashing' : ''}`}>{formatTime(timeLeft)}</span></p>
                {renderWarningMessage()}
            </div>

            {/* 2. PELS 표시 모듈 */}
            <div className="pels-display">
                <h3>🚨 잠재적 손실액 (PELS)</h3>
                <p className={`score ${isSystemCritical ? 'high' : ''}`}>현재 누적 점수: {pelsScore.toFixed(2)}</p>
                <small>(시간 경과 및 미패치로 인해 실시간 증가 중입니다.)</small>
            </div>

            {/* 3. 티어 선택 및 CTA */}
            <div className="pricing-grid">
                {[ 'FREE', 'PRO', 'ENTERPRISE' ].map(tier => (
                    <div key={tier} className={`card ${selectedTier === tier ? 'active' : ''}`} onClick={() => setSelectedTier(tier)}>
                        <h4>{tier}</h4>
                        <p>${tier === 'PRO' ? '49,000원' : 'Free'} / 월</p>
                    </div>
                ))}
            </div>

            {/* 4. 최종 액션 버튼 */}
            <button 
                className={`cta-button ${isSystemCritical ? 'critical-glow' : ''}`} 
                onClick={handlePurchaseClick} 
                disabled={timeLeft <= 0 || pelsScore === 0}
            >
                {timeLeft > 0 && pelsScore > 0 ? `시스템 무결성 패치 (선택: ${selectedTier})` : '진단 불가'}
            </button>

        </div>
    );
};

export default MiniModulePrototype;