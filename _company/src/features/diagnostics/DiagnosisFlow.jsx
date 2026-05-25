// DiagnosisFlow.jsx (State Machine Controller)
import React, { useReducer, useEffect } from 'react';
import { analyzeDataMockApi } from '../../services/apiService'; // T2 로직 호출
import { GlitchEffectWrapper } from './GlitchEffectWrapper'; // Designer 컴포넌트 연결

/**
 * State Machine Type Definition
 * -------------------------
 * INITIAL (진입 전) -> INPUT_DATA_COLLECTION (T1: 데이터 입력) 
 * -> SCANNING_PROCESSING (T2: 시스템 분석 중/글리치 발생 지점) 
 * -> RESULT_DISPLAY (T3: 결과 제시 및 구매 유도)
 * -> ERROR (예외 처리 상태, 에어갭/API 실패 등)
 */
const initialState = {
    state: 'INITIAL', // 현재 상태 추적
    formData: { email: '', jobSector: '', scanResults: [] },
    scanProgress: 0, // T2 진행률 (0~100%)
    diagnosisResult: null,
    isLoading: false,
    errorMessage: null,
};

// State Reducer 정의 (가장 중요한 부분. 상태 전이 로직을 중앙 집중화)
function diagnosisReducer(state, action) {
    switch (action.type) {
        case 'START_FLOW':
            return { ...state, state: 'INPUT_DATA_COLLECTION', isLoading: false };

        case 'SET_FORM_DATA':
            // T1에서 입력된 데이터를 저장하고 다음 상태로 넘어갈 준비를 합니다.
            return { ...state, formData: action.payload };

        case 'START_SCANNING':
            // T2 시작 시, 로딩 및 글리치 효과가 활성화될 지점입니다.
            return { 
                ...state, 
                state: 'SCANNING_PROCESSING', 
                isLoading: true, 
                scanProgress: 0, 
                errorMessage: null 
            };

        case 'PROGRESS':
            // T2에서 애니메이션/진행률 업데이트 (예: setInterval 등으로 주기적 호출)
            return { ...state, scanProgress: action.payload };

        case 'SCAN_COMPLETE':
            // API 호출 후 데이터가 완전히 분석되어 결과를 받을 때
            return { ...state, state: 'RESULT_DISPLAY', isLoading: false, diagnosisResult: action.payload };

        case 'FAILURE':
            // 시스템 에러 발생 시 (에어갭, API 400/500 등)
            return { 
                ...state, 
                state: 'ERROR', 
                isLoading: false, 
                errorMessage: action.payload 
            };

        default:
            return state;
    }
}


const DiagnosisFlow = () => {
    // useReducer를 사용하여 상태 전이를 예측 가능하게 만듭니다. [근거: 코다리 개인 메모리]
    const [state, dispatch] = useReducer(diagnosisReducer, initialState);

    useEffect(() => {
        if (state.state === 'INITIAL') {
            dispatch({ type: 'START_FLOW' }); // 컴포넌트 마운트 시 초기 상태로 진입
        }
    }, []);

    // T1 -> T2 Transition Handler
    const handleAnalyzeClick = async () => {
        if (!state.formData || !state.formData.email) {
            dispatch({ type: 'FAILURE', payload: '이메일 주소를 입력해야 진단을 시작할 수 있습니다.' });
            return;
        }

        dispatch({ type: 'START_SCANNING' }); // T2 상태로 전환 (글리치 효과 활성화 지점)
        
        try {
            // Mock API를 통해 데이터를 처리하는 시뮬레이션. 
            // 실제로는 여기서 T2 로직을 순차적으로 호출하며 progress를 업데이트해야 함.
            await analyzeDataMockApi(state.formData);

            dispatch({ type: 'SCAN_COMPLETE', payload: { /* 가상의 진단 결과 데이터 */ } }); // T3로 성공 전환
        } catch (error) {
            // API 실패, 에어갭 등 모든 예외 처리를 여기서 담당합니다. [근거: 지난 의사결정 로그]
            dispatch({ type: 'FAILURE', payload: error.message || '알 수 없는 시스템 오류가 발생했습니다.' });
        }
    };

    // 렌더링 로직은 현재 state에 따라 완전히 달라져야 합니다 (State-Driven UI).
    const renderContent = () => {
        switch (state.state) {
            case 'INITIAL':
                return <InputForm onDataChange={(data) => dispatch({ type: 'SET_FORM_DATA', payload: data })} onAnalyzeClick={handleAnalyzeClick} />; // T1 폼 컴포넌트
            case 'INPUT_DATA_COLLECTION':
                return <InputForm onDataChange={(data) => dispatch({ type: 'SET_FORM_DATA', payload: data })} onAnalyzeClick={handleAnalyzeClick} />;
            case 'SCANNING_PROCESSING':
                // T2는 글리치 효과와 함께 진행률 바(Progress Bar)가 핵심입니다. [근거: Designer 산출물]
                return <GlitchEffectWrapper progress={state.scanProgress} message="시스템 구조 분석 중... 임시 데이터 무결성 검사 중..." />;
            case 'RESULT_DISPLAY':
                // T3는 진단 결과와 함께 강제적인 유료 전환(PRO/ENTERPRISE) CTA가 포함됩니다.
                return <ResultDisplay result={state.diagnosisResult} onBuyClick={() => { /* 결제 로직 호출 */ }} />;
            case 'ERROR':
                // 시스템 에러 발생 시, 권위적이고 위협적인 경고 모달이 뜹니다. [근거: 지난 의사결정 로그]
                return <ErrorModal code={`ERR-${Math.random().toString(36).substring(2)}`} message={state.errorMessage} />;
            default:
                return null;
        }
    };

    return (
        <div className="diagnosis-container">
            {renderContent()}
        </div>
    );
};

export default DiagnosisFlow;