import React, { useState, useEffect } from 'react';
// 로직 시뮬레이션을 위해 defectService를 import 합니다.
import * as DefectService from '../services/defectService'; 
import './styles/GlitchEffect.css';

const StructuralDefectModal = ({ isOpen, onClose }) => {
    // State Management: 0=대기, 1=로딩(Loading), 2=진단 결과 표시(Diagnosis), 3=해결책 제시(Solution)
    const [step, setStep] = useState(0); 
    const [diagnosisData, setDiagnosisData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        // Modal이 열릴 때 로직 시작
        setStep(1); // Loading 단계로 전환
        fetchDiagnosis();
    }, [isOpen]);

    // 1. 비동기 진단 데이터 조회 시뮬레이션 (Mock API Call)
    const fetchDiagnosis = async () => {
        setIsLoading(true);
        try {
            // 2초 간의 로딩 시간 시뮬레이션 + 백엔드 서비스 호출
            await new Promise(resolve => setTimeout(resolve, 2000)); 
            
            // 실제 defectService를 사용한다고 가정하고 API 호출
            const result = await DefectService.runDiagnosis();
            setDiagnosisData(result);
            
            // 데이터 조회 성공 후 다음 단계 (진단 결과)로 강제 전환
            setTimeout(() => {
                setStep(2); 
                setIsLoading(false);
            }, 1000); // 로딩 애니메이션 끝난 직후 결과 표시
        } catch (error) {
            console.error("Diagnosis failed:", error);
            // 에러 발생 시 강제 경고 단계로 전환
            setStep(2); // 임시로 2단계에 머무르되, 내용을 오류 코드로 오버라이드 할 수 있음
            setIsLoading(false);
        }
    };

    // 3. Solution Path (유료 서비스 유도) 핸들러
    const handleSolutionPath = () => {
        // TODO: 실제 결제 페이지로 리다이렉트 로직 구현
        alert("🚨 경고: 시스템적 구조 결함 진단 보고서 접근을 위해 PRO 티어 가입이 필요합니다. (AUTH-STRUC)");
        setStep(3); // 최종 단계 전환 (구매 유도)
    };

    // -------------------- RENDER LOGIC --------------------

    if (!isOpen) return null;

    let content;
    switch (step) {
        case 1: // Loading State
            content = (
                <div className="loading-container">
                    <div className="loader-spinner"></div>
                    <p className="neon-glow" style={{ marginTop: '20px' }}>[SYSTEM SCANNING... DETECTING ANOMALIES]</p>
                    <p>데이터를 조회 중입니다. 잠시만 기다려주세요.</p>
                </div>
            );
            break;

        case 2: // Diagnosis Result State (The Scare)
            content = (
                <div className="diagnosis-result">
                    <h2>⚠️ [CRITICAL ERROR DETECTED]</h2>
                    <p className="neon-glow">[AUTH-STRUC]</p> {/* 강제 코드 표시 */}
                    <h3>분석 결과: 구조적 결함이 감지되었습니다.</h3>
                    {/* 실제 데이터가 들어갈 자리 (여기에 진단 점수, 위험 요소 목록 등이 나옴) */}
                    <p style={{ color: 'var(--neon-red)' }}>
                        진단된 오류 유형: {diagnosisData?.defectType || "Unknown Structural Anomaly"} 
                        <span className="alert-code">CODE:{Math.random().toString(16).slice(2, 6).toUpperCase()}</span>
                    </p>
                    <p>이러한 결함은 일반적인 자가 진단만으로는 해결할 수 없습니다.</p>
                </div>
            );
            break;

        case 3: // Solution Path State (The Hook)
            content = (
                <div className="solution-path">
                    <h2>🛡️ [SOLUTION PATH REQUIRED]</h2>
                    <p className="neon-glow">[SECURE ACCESS PROTOCOL ACTIVE]</p>
                    <p>이 구조적 결함을 해결하기 위해서는 **전문적인 진단 및 패치(Patch)**가 필수입니다.</p>
                    <button 
                        className="solution-button" 
                        onClick={handleSolutionPath}
                    >
                        PRO 티어 진단 보고서 구매 (₩19,900)
                    </button>
                </div>;
            break;

        default:
            content = <p>시스템 초기화 중...</p>;
    }


    return (
        <div className="structural-modal-overlay" style={{ 
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' 
        }}>
            <div className="modal-content" style={{ maxWidth: '600px', padding: '40px', background: '#1a0520', border: '1px solid var(--neon-red)' }}>
                <h1 className="neon-glow" style={{ fontSize: '1.8em' }}>시스템 진단 모듈 V3.1</h1>
                {content}
            </div>
        </div>
    );
};

export default StructuralDefectModal;