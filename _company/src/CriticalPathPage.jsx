import React, { useState, useCallback } from 'react';
import { ApiService } from './apiService';

/**
 * Critical Path Page Component: 진단 -> 경고 > 구매 유도 흐름을 구현합니다.
 */
const InitialState = "INITIAL"; // 시작 상태
const DiagnosisState = "DIAGNOSIS"; // 1. 자가진단 중 (Input)
const ResultState = "RESULT_DISPLAY"; // 2. 진단 결과 제시 및 경고 발생
const PurchaseGateState = "PURCHASE_GATE"; // 3. PRO Kit 구매 유도 및 시도
const CompleteState = "COMPLETE"; // 4. 최종 성공/실패 완료

function CriticalPathPage() {
    const [state, setState] = useState(InitialState);
    const [email, setEmail] = useState('');
    const [jobSector, setJobSector] = useState('tech');
    const [diagnosisResult, setDiagnosisResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // 1. 진단 시작 핸들러 (Initial -> Diagnosis)
    const handleStartDiagnosis = useCallback(async () => {
        setLoading(true);
        setState(DiagnosisState);
        try {
            // 실제 API 호출을 통해 상태 전이 및 데이터 수신
            const result = await ApiService.diagnose(email, jobSector);

            if (result.success) {
                setDiagnosisResult({ 
                    message: result.message, 
                    data: result.data 
                });
                // 결과가 나온 후 상태 전이 로직 실행
                setState(ResultState); 
            } else {
                 alert(`[Error] 진단 실패: ${result.error}`);
                 setState("ERROR"); // 에러 상태 정의 필요
            }
        } catch (e) {
            console.error("진단 중 시스템 오류 발생:", e);
            setDiagnosisResult({ message: "시스템 오류가 감지되었습니다." });
            setState("ERROR");
        } finally {
            setLoading(false);
        }
    }, [email, jobSector]);

    // 2. 구매 시도 핸들러 (PurchaseGate -> Complete/Failure)
    const handleAttemptPurchase = useCallback(async (tierId) => {
        if (!diagnosisResult || !diagnosisResult.data.defectsFound.includes("AUTH-STRUC")) {
            alert("⚠️ 경고: PRO Kit 구매를 시도하려면 필수 구조적 결함('AUTH-STRUC')이 진단되어야 합니다.");
            return;
        }

        setLoading(true);
        try {
             // 상태 전이를 유발하는 핵심 API 호출
            const purchaseResult = await ApiService.buy(email, tierId);

            if (purchaseResult.success) {
                setState(CompleteState);
            } else {
                alert(`[SYSTEM FAILURE] 구매 실패: ${purchaseResult.error}`);
                // 결제 실패 시에도 경고 메시지를 강제로 보여주는 로직이 필요함.
                setState("PURCHASE_FAIL"); 
            }

        } catch (e) {
            console.error("구매 중 시스템 오류 발생:", e);
            alert("치명적인 연결 에러가 발생했습니다.");
            setState("ERROR");
        } finally {
            setLoading(false);
        }
    }, [diagnosisResult]);


    // --- 렌더링 로직 (State Machine 기반) ---

    const renderContent = () => {
        switch (state) {
            case InitialState:
                return (
                    <section className="initial-step">
                        <h2>시스템 진단 시작</h2>
                        <p>귀하의 시스템 로그를 제출하여 잠재적 구조적 결함을 검사합니다.</p>
                        {/* 입력 필드 */}
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="이메일 주소 (필수)" 
                            disabled={loading}
                        />
                        {/* ... 기타 입력 필드 생략 ... */}
                        <button onClick={handleStartDiagnosis} disabled={!email || loading}>
                            진단 시작
                        </button>
                    </section>
            
            case DiagnosisState:
                return <div className="loading-screen">진단 중... 시스템 로그 분석 및 구조적 결함 탐색 중입니다. (잠시만 기다려 주세요.) ⚙️</div>

            case ResultState:
                // 핵심 로직 구현 지점: '정보 과부하 상태' 경고 강제 출력
                const defectDetected = diagnosisResult?.data?.defectsFound.includes("AUTH-STRUC");
                
                return (
                    <div className={`result-display ${defectDetected ? 'critical-alert' : ''}`}>
                        <h3>진단 결과 보고서</h3>
                        {/* 1. 결함 인지 모달 강제 출력 */}
                        {defectDetected ? (
                            <div role="alert" style={{ border: '3px solid red', padding: '20px', background: '#fee' }}>
                                <h2 style={{ color: 'red' }}>🚨 CRITICAL ERROR DETECTED 🚨</h2>
                                <p>진단 과정에서 **시스템의 근본적인 구조적 결함**이 확인되었습니다. 이는 단순한 문제가 아닌, 시스템 설계 단계부터 존재했던 취약점입니다.</p>
                                <p>결함 코드: {diagnosisResult.data.defectsFound.join(', ')}</p>
                            </div>
                        ) : (
                            <div style={{ background: '#eef' }}>
                                <h4>✅ 진단 완료</h4>
                                <p>{diagnosisResult?.message}</p>
                            </div>
                        )}

                        {/* 2. 강제 구매 게이트 노출 */}
                        {defectDetected && (
                            <div className="purchase-gate">
                                <h3>필수 패치 권고: PRO Kit</h3>
                                <p>이 결함은 자체적인 방법으로는 해결할 수 없습니다. 전문가의 진단 및 **PRO Kit**를 통해 시스템을 강제 복구해야 합니다.</p>
                                {/* 구매 버튼 */}
                                <button onClick={() => handleAttemptPurchase('PRO')}>
                                    ▶ PRO Kit (19,900원)로 즉시 패치 적용하기
                                </button>
                            </div>
                        )}

                    </div>
                );

            case PurchaseGateState:
                 return <div className="loading-screen">결제 모듈과 상태 전이 로직을 실행 중입니다... (최종 검증 중...) 💻</div>

            case CompleteState:
                return <h1 style={{ color: 'green' }}>✅ 성공! 시스템 권한 패치 완료.</h1>;

            case "ERROR":
            case "PURCHASE_FAIL":
                return <div className="error-state">처리 중 치명적인 오류가 발생했습니다. 재시도 또는 관리자에게 문의하세요.</div>;

            default:
                return null;
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: 'auto' }}>
            <h1>셀브릿지 시스템 진단 인터페이스</h1>
            <div className="content-area" style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                {renderContent()}
            </div>
        </div>
    );
}

export default CriticalPathPage;