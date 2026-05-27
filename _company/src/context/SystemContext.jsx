import React, { createContext, useState, useEffect, useCallback } from 'react';

export const SystemContext = createContext();

// 상수 정의 (Designer 사양 기반)
const THRESHOLD_WARNING = 100; // $100에 도달 시 Warning 시작
const THRESHOLD_CRITICAL = 500; // $500에 도달 시 Critical 진입

export const SystemProvider = ({ children }) => {
    // 상태: { value: 현재 PELS 값, level: 'normal' | 'warning' | 'critical', isOpen: 모달 열림 여부 }
    const [state, setState] = useState({ 
        pelsValue: 0.00, 
        level: 'normal', 
        isModalOpen: false, 
        modalErrorCode: null 
    });

    // PELS 값 증가 및 상태 전이 로직 (핵심 State Machine)
    const updatePELS = useCallback((incrementAmount = 1.50) => {
        setState(prevState => {
            let newValue = prevState.pelsValue + incrementAmount;
            let newLevel = 'normal';

            if (newValue >= THRESHOLD_CRITICAL) {
                newLevel = 'critical';
            } else if (newValue >= THRESHOLD_WARNING) {
                newLevel = 'warning';
            }

            // PELS 값은 2자리 소수점으로 고정
            const roundedValue = parseFloat(newValue.toFixed(2));
            return { 
                pelsValue: roundedValue, 
                level: newLevel,
                isModalOpen: prevState.isModalOpen,
                modalErrorCode: prevState.modalErrorCode
            };
        });
    }, []);

    // PELS 타이머 효과 (매 초마다 실행)
    useEffect(() => {
        const interval = setInterval(() => {
            updatePELS(); // 1초마다 PELS 값 증가 및 레벨 체크
        }, 1000);
        return () => clearInterval(interval);
    }, [updatePELS]);

    // 외부 API 호출 실패 시 모달 강제 열기 (외부 트리거)
    const openCriticalModal = useCallback((errorCode, message) => {
        setState(prev => ({
            ...prev, 
            isModalOpen: true, 
            modalErrorCode: errorCode,
            pelsValue: prev.pelsValue // PELS 값은 유지
        }));
    }, []);

    // 모달 닫기 (사용자 액션 또는 시간 경과 후)
    const closeModal = useCallback(() => {
        setState(prev => ({ ...prev, isModalOpen: false, modalErrorCode: null }));
    }, []);


    return (
        <SystemContext.Provider value={{ state, updatePELS, openCriticalModal, closeModal }}>
            {children}
        </SystemContext.Provider>
    );
};

export { SystemProvider };