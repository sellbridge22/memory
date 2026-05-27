import React, { useState, useEffect } from 'react';
import { calculateLossAndScore, LEGAL_BASES } from '../api/mockApi';

/**
 * @component CriticalDefectModal
 * 시스템 오류 발생 시 나타나는 권위적이고 공포감을 유발하는 진단 모달입니다.
 */
const CriticalDefectModal = ({ onDiagnose }) => {
    // 1. 상태 정의
    const [scope, setScope] = useState('Global');
    const [regulatoryArea, setRegulatoryArea] = useState('GDPR');
    const [severityLevel, setSeverityLevel] = useState('High');
    const [lossData, setLossData] = useState(null); // 진단 결과 저장
    const [isLoading, setIsLoading] = useState(false);

    // 2. 손실액 계산 로직 (Lifecycle Hook)
    const handleDiagnosis = async () => {
        setIsLoading(true);
        try {
            // API 호출을 통해 손실액과 점수를 산출합니다.
            const response = await calculateLossAndScore({ scope, regulatoryArea, severityLevel });

            if (response.success) {
                setLossData(response.data); // 진단 결과를 상태에 저장
                onDiagnose(response.data);  // 상위 컴포넌트에 데이터 전달하여 다음 플로우 시작 유도
            } else {
                alert(`[ERROR] 진단 실패: ${response.message}`);
            }
        } catch (e) {
            console.error("진단 API 호출 중 오류 발생:", e);
            alert("시스템 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                {/* 🚨 핵심 헤더: 전문적 공포 유발 */}
                <h2 style={styles.header}>⚠️ CRITICAL SYSTEM DEFECT DETECTED</h2>
                <p style={styles.subHeader}>(구조적 무결성 실패 코드: AUTH-STRUC)</p>

                {/* 1. 입력 위젯 섹션 (데이터 수집) */}
                <div style={styles.inputContainer}>
                    <h3>손실 원인 분석 파라미터 정의</h3>
                    <select value={scope} onChange={(e) => setScope(e.target.value)}>
                        <option value="Local">Local Scope</option>
                        <option value="Regional">Regional Scope</option>
                        <option value="Global">Global Scope (High Risk)</option>
                    </select>

                    <select value={regulatoryArea} onChange={(e) => setRegulatoryArea(e.target.value)}>
                        <option value="GDPR">GDPR Compliance</option>
                        <option value="CCPA">CCPA Privacy Act</option>
                        <option value="SEC">Securities Law Violation</option>
                    </select>

                     <select value={severityLevel} onChange={(e) => setSeverityLevel(e.target.value)}>
                        <option value="Low">Low Risk</option>
                        <option value="Medium">Medium Risk</option>
                        <option value="High">High Risk (Mandatory)</option>
                    </select>

                    <button onClick={handleDiagnosis} disabled={isLoading} style={styles.diagnosisButton}>
                        {isLoading ? '진단 중...' : '즉시 구조적 결함 진단 시작'}
                    </button>
                </div>

                {/* 2. 법적 근거 시각화 섹션 (권위 확보) */}
                <div style={styles.legalBasisContainer}>
                    <h3>🔍 관련법규 기반 위험 분석 보고서</h3>
                    <p>현재 시스템 오류는 단순한 기능 버그가 아닙니다. 이는 **[근거: 지난 의사결정 로그]** 특정 법적 조항 위반으로 인한 구조적 결함입니다.</p>

                    {/* Legal Basis Cards 렌더링 */}
                    {LEGAL_BASES.map((basis, index) => (
                        <div key={index} style={styles.legalCard}>
                            <h4>{basis.code}: {basis.title}</h4>
                            <p>{basis.description}</p>
                            <small>[적용 법률: {/* 여기에 추가 데이터 연결 필요 */}]</small>
                        </div>
                    ))}
                </div>

                {/* 3. 결과 및 CTA 섹션 (결과 제시) */}
                {lossData && (
                    <div style={styles.resultSection}>
                        <h3>✅ 진단 보고서: 구조적 손실 예측</h3>
                        <p>당신의 시스템은 현재 다음과 같은 규모의 잠재적 경제적 손실에 직면해 있습니다.</p>

                        {/* 동적 손실액 위젯 (가장 크게 강조) */}
                        <div style={styles.lossWidget}>
                            <h1>₩ {lossData.calculatedLossAmount.toLocaleString('ko-KR')}</h1>
                            <p style={{fontSize: '1.2em', color: '#CC0000'}}>예상 최소 손실액 (Minimum Potential Loss)</p>
                        </div>

                        <div style={styles.ctaBlock}>
                             <h4>[경고] 진단 점수 ({lossData.diagnosticScore} / 100)가 임계치 초과!</h4>
                            <p>이 결함은 내부 패치만으로는 해결할 수 없습니다. 전문적인 '진단 보고서'를 통한 시스템 아키텍처 재정립이 필수입니다.</p>
                             {/* 다음 단계로의 전환 유도 */}
                            <button onClick={() => console.log("Initiating Pro Funnel")} style={styles.proButton}>
                                PRO 진단 리포트 구매 및 시스템 안정화 시작 (월 ₩19,900)
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CriticalDefectModal;

// [스타일링은 가독성을 위해 인라인으로 처리합니다.]
const styles = {
    modalOverlay: { 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: 'rgba(15, 20, 30, 0.95)', color: '#E0E0FF', zIndex: 1000, padding: '40px' 
    },
    modalContent: { 
        maxWidth: '1000px', margin: 'auto', background: 'rgba(20, 30, 50, 0.9)', padding: '40px', borderRadius: '10px', boxShadow: '0 0 30px rgba(255, 0, 0, 0.3)' 
    },
    header: { fontSize: '2.5em', color: '#FF6B6B', borderBottom: '2px solid #4A90E2', paddingBottom: '10px' },
    subHeader: { color: '#AAAAAA', marginBottom: '30px' },
    inputContainer: { border: '1px dashed #4A90E2', padding: '25px', borderRadius: '8px', marginBottom: '30px' },
    legalBasisContainer: { border: '1px solid #6C7B9D', padding: '25px', borderRadius: '8px', marginBottom: '30px' },
    legalCard: { backgroundColor: '#2A3E54', padding: '15px', margin: '10px 0', borderRadius: '5px', borderLeft: '4px solid #FFD700' },
    resultSection: { marginTop: '40px', textAlign: 'center', borderTop: '2px dashed #3A506B', paddingTop: '30px' },
    lossWidget: { 
        background: '#1C0000', padding: '30px', borderRadius: '10px', margin: '20px auto', maxWidth: '80%' 
    },
    ctaBlock: { marginTop: '30px', border: '2px solid #FF6B6B', padding: '25px', borderRadius: '10px' },
    diagnosisButton: { 
        padding: '12px 30px', fontSize: '1.1em', backgroundColor: '#4A90E2', color: 'white', 
        border: 'none', cursor: 'pointer', marginRight: '15px' 
    },
    proButton: { 
        padding: '15px 40px', fontSize: '1.3em', backgroundColor: '#FF6B6B', color: 'white', 
        border: 'none', cursor: 'pointer', transition: 'background-color 0.3s' 
    }
};