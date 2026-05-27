// VssCoreModule.tsx: 구조적 취약점 인지 시퀀스를 보여주는 메인 모듈 컴포넌트 (React)
import React, { useState } from 'react';
import { VssStateTransitionEngine, DiagnosisPayload, UserStatus } from '../services/VssStateTransitionEngine';

// 가상 데이터 및 상태 정의
const INITIAL_PAYLOAD: DiagnosisPayload = { 
    email: "user@example.com", 
    scanResults: ["A1-PASS", "B3-CRITICAL"] // 초기 테스트 시나리오 설정 (Critical)
};


/**
 * @description VSS의 핵심 로직을 구현하는 컴포넌트입니다.
 * 상태 전이(State Transition)에 따라 UI를 동적으로 변화시키며, 구조적 결함을 사용자에게 강제 인지시킵니다.
 */
const VssCoreModule: React.FC = () => {
    // (S0) 초기 진단 대기 상태
    const [currentState, setCurrentState] = useState<UserStatus>('PENDING_DIAGNOSIS');
    const [lastErrorPayload, setLastErrorPayload] = useState<{ code: string; message: string } | undefined>(undefined);

    // 시나리오 1: 진단 결과 제출 버튼 핸들러 (핵심 로직 호출 지점)
    const handleDiagnosisSubmit = async () => {
        setLastErrorPayload(undefined);
        try {
            // 핵심 비즈니스 로직 엔진 실행 및 상태 전이 강제
            const result = await VssStateTransitionEngine(INITIAL_PAYLOAD, 'PENDING_DIAGNOSIS');

            setCurrentState(result.newState);
            if (result.structuralError) {
                setLastErrorPayload(result.structuralError);
            }
        } catch (e) {
            console.error("VSS Engine failed:", e);
            setCurrentState('STATE_ERROR');
            setLastErrorPayload({ code: 'RUNTIME-FAILURE', message: "시스템 처리 중 예상치 못한 오류가 발생했습니다." });
        }
    };

    // 상태에 따른 UI 렌더링 로직 (Information Overload State 강제)
    const renderContent = () => {
        switch (currentState) {
            case 'PENDING_DIAGNOSIS':
                return <button onClick={handleDiagnosisSubmit}>진단 결과 제출 및 시스템 분석 요청</button>;

            case 'STATE_ALERT':
            case 'STATE_ERROR':
                // 구조적 취약점 인지 시퀀스 발생! (핵심 목표 달성)
                const error = lastErrorPayload;
                return (
                    <div style={{ border: '2px solid red', padding: '20px', background: '#ffe6e6' }}>
                        <h3>🚨 시스템 경고 코드: {error?.code}</h3>
                        <p><strong>{error?.message}</strong></p>
                        <p className="info-overload">이 구조적 결함은 단순한 불편함을 넘어선, **시스템의 치명적인 취약점**입니다. 즉각적인 패치가 필요합니다.</p>
                        <button onClick={() => alert("PRO Kit 구매 플로우로 강제 이동")}>즉시 응급 처방 (PRO Kit)</button>
                    </div>
                );

            case 'STATE_RECOMMENDATION':
                // 구조적 결함은 없지만, 불안감을 조성하며 상위 단계로 유도하는 흐름
                return (
                     <div style={{ border: '1px solid orange', padding: '20px' }}>
                        <h3>⚠️ 분석 보고서 - [경고]</h3>
                        <p>시스템은 안정화되었으나, **최적의 상태**에 도달하지 못했습니다. 추가 검증이 필요합니다.</p>
                        <button onClick={() => alert("PRO Kit 구매 플로우로 강제 이동")}>패치 진행하기 (PRO Kit)</button>
                    </div>
                );

            case 'STATE_SUCCESS':
                return <h2 style={{ color: 'green' }}>✅ 시스템 정상화 완료. 모든 구조적 결함이 제거되었습니다.</h2>;

            default:
                return "진단 결과를 기다리는 중입니다...";
        }
    };

    return (
        <div className="vss-module">
            <h2>VSS Core Module - System Integrity Check</h2>
            <p>현재 상태: {currentState}</p>
            <div className="content-area">{renderContent()}</div>
        </div>
    );
};

export default VssCoreModule;