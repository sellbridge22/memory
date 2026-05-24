import React, { useState } from 'react';
import StateTransitionModal from './StateTransitionModal'; 
// 가정: API 통신 시뮬레이션을 위한 유틸리티 함수가 존재한다고 가정합니다.

const DiagnosticFlow = () => {
    const [step, setStep] = useState(1); // 1: T1 시작, 2: T2 불안감, 3: T3 결제
    const [isLoading, setIsLoading] = useState(false);
    const [errorModal, setErrorModal] = useState({ show: false, title: '', message: '', defectCode: '' });

    // API 호출을 모킹하는 함수 (시간 지연 및 강제 에러 시뮬레이션)
    const simulateApiCall = async (stage, inputData) => {
        console.log(`[API CALL] Simulating ${stage} analysis...`);
        await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5초 대기 시간으로 불안감 증폭

        if (stage === 'T1' && inputData.email.includes('fail')) {
            // T1에서 의도적으로 실패하는 경우 시뮬레이션
            return Promise.reject({ code: "INPUT-FAIL", message: "입력 데이터의 구조적 결함이 감지되었습니다." });
        }

        if (stage === 'T2' && inputData.score < 50) {
             // T2에서 낮은 점수가 나오면 Critical Error 발생 시뮬레이션
            return Promise.resolve({ status: "CRITICAL_DEFECT", score: Math.floor(Math.random() * 30) + 70, defectCode: "AUTH-STRUC" });
        }

        // 기본 성공 로직 (Mocking)
        return Promise.resolve({ status: "PASS", score: 95, defectCode: null });
    };


    const handleStepTransition = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setErrorModal({ show: false, title: '', message: '', defectCode: '' });

        try {
            let result;
            let nextStep = step + 1;
            
            // --- T1: 초기 진단 시작 (Input Collection) ---
            if (step === 1) {
                const initialData = { email: "user@example.com", jobSector: "tech" }; // 실제 입력값 사용 필요
                result = await simulateApiCall('T1', initialData);
                console.log("T1 Result:", result);

            } 
            // --- T2: 불안감 증폭 단계 (State Change Check) ---
            else if (step === 2) {
                const t1Result = { score: 60 }; // 이전 단계 결과 사용 가정
                result = await simulateApiCall('T2', { score: t1Result.score });

            } 
            // --- T3: 결제 및 최종 진단 (Payment Gateway Mocking) ---
            else if (step === 3) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // 장기 지연
                result = { success: true }; // 성공적으로 결제가 완료되었다고 가정
                setStep(4); // 다음 상태를 최종 성공으로 설정
            }

            // 다음 단계로의 로직 구현 (Success)
            if (step < 3 && result.status === "CRITICAL_DEFECT") {
                 setErrorModal({ show: true, title: "구조적 결함 경고", message: `시스템 로그 분석 결과 ${result.defectCode} 오류가 감지되었습니다. 즉각적인 패치가 필요합니다.`, defectCode: result.defectCode });
            } else if (step === 3 && result.success) {
                alert("🎉 E2E 테스트 통과! 결제 성공 및 상태 업데이트 완료.");
            }


        } catch (error) {
            // 에러 발생 시 모달 활성화
            setErrorModal({ show: true, title: "시스템 오류 감지", message: `[${error.code}] ${error.message}. 더 심각한 결함일 수 있습니다.`, defectCode: error.code });
        } finally {
            setIsLoading(false);
        }
    };

    // T1 진입 시 강제 모달 트리거 로직 (예시)
    const handleT1Complete = () => {
        if (!isLoading) {
             setStep(2); // 성공적으로 T2로 넘어감.
        } else {
            handleStepTransition();
        }
    };

    return (
        <div className="diagnostic-flow">
            <h1>진단 워크플로우 시뮬레이션 - Step {step}</h1>
            <p>현재 상태: {step === 1 ? "데이터 입력 단계" : step === 2 ? "위험도 분석 및 불안감 증폭" : step === 3 ? "필수 패치 구매 (T3)" : "완료됨"}</p>

            {/* T1 버튼 로직 */}
            <button 
                onClick={handleStepTransition} 
                disabled={isLoading || step > 1}
                className="btn-primary"
            >
                {step === 1 ? "진단 시작 (T1)" : "다음 단계 진행"}
            </button>

            {/* T2/T3 버튼 로직 */}
             <div className="controls">
                <button onClick={handleStepTransition} disabled={isLoading && step < 4}>
                    {step === 2 ? "불안감 증폭 분석 실행 (T2)" : step === 3 ? "패치 구매 및 완료 (T3)" : null}
                </button>
            </div>

            {/* 상태 전이 모달 */}
            <StateTransitionModal 
                title={errorModal.title}
                message={errorModal.message}
                defectCode={errorModal.defectCode}
                onAcknowledge={() => {
                    setErrorModal({ show: false, title: '', message: '', defectCode: '' });
                    // 모달을 닫고 다음 단계를 진행할 수 있도록 로직 호출 (예시)
                    if (step < 3 && !isLoading) handleStepTransition(); 
                }}
            />

            {/* 로딩 스피너 등 추가 UI 요소 */}
        </div>
    );
};

export default DiagnosticFlow;