import { useState, useEffect } from 'react';

// T+0:15 Critical Warning Threshold (초)
const CRITICAL_THRESHOLD = 15; 

/**
 * 페이지 체류 시간을 추적하고 임계치 도달 시 강제 상태 전이를 유도하는 커스텀 훅.
 * @param {Function} onCriticalTrigger - 경고가 발동될 때 호출되는 콜백 함수 (예: 다음 단계로 이동)
 * @returns {object} 현재 플로우 상태 및 트리거 여부
 */
export const useDiagnosticFlowHook = (onCriticalTrigger) => {
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isCriticallyWarning, setIsCriticallyWarning] = useState(false);

    useEffect(() => {
        let timer;
        setTimeElapsed(0); // 초기화

        // 1초마다 시간 경과 업데이트
        timer = setInterval(() => {
            setTimeElapsed(prevTime => prevTime + 1);
        }, 1000);

        // T+0:15 임계치 도달 시 경고 발동 로직 (강제 State Transition)
        const checkCriticality = () => {
            if (timeElapsed >= CRITICAL_THRESHOLD && !isCritCriticallyWarning) {
                setIsCriticallyWarning(true);
                // 비즈니스 로직에 따라 강제 콜백 실행 (예: 모달 띄우기, 특정 API 호출)
                onCriticalTrigger(); 
            }
        };

        // 시간 업데이트 시 매번 체크 (안정성 확보)
        const intervalCheck = setInterval(() => {
             checkCriticality();
        }, 500); // 500ms 간격으로 체크

        return () => {
            clearInterval(timer);
            clearInterval(intervalCheck);
        };
    }, [onCriticalTrigger, isCriticallyWarning]); // 의존성 배열에 포함하여 클린업 보장

    return { timeElapsed, isCriticallyWarning };
};