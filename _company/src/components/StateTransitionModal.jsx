import React, { useState, useEffect } from 'react';
import './StateTransitionModal.css'; // CSS 파일 필요

const StateTransitionModal = ({ title, message, defectCode, onAcknowledge }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    // 모달 진입 시 애니메이션 트리거 (핵심)
    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            // 일정 시간 후 사용자에게 강제적인 인지 부하를 줌
            if (message.includes("CRITICAL")) {
                 console.error(`[SYSTEM ALERT] ${defectCode}: 구조적 결함 감지!`);
            }
        }, 500); // 0.5초 디레이로 긴장감 조성
        return () => clearTimeout(timer);
    }, [message]);

    if (!isVisible) return null;

    return (
        <div className={`modal-overlay ${defectCode ? 'glitch-active' : ''}`} onClick={onAcknowledge}>
            <div 
                className="modal-content" 
                onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 막기
            >
                {/* 경고 코드 및 권위적 시각화 */}
                <h2 className={`alert-code ${defectCode}`}>{defectCode}</h2>
                <h3>{title}</h3>
                <p className="modal-message">{message}</p>
                
                <button 
                    className="btn-primary" 
                    onClick={onAcknowledge} 
                    disabled={false} // 강제 진행 느낌 부여
                >
                    [PATCH REQUIRED] 진단 결과 확인 및 계속하기
                </button>
            </div>
        </div>
    );
};

export default StateTransitionModal;