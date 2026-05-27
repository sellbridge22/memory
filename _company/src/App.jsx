import React, { useState } from 'react';
import PelsCounter from './components/PelsCounter';
import SystemModal from './components/SystemModal';
import { SystemProvider, SystemContext } from './context/SystemContext';

// Mock API 호출 함수 (실제 백엔드 연동을 시뮬레이션)
const mockProcessData = async (email, jobSector) => {
    console.log("--- [API] 데이터 처리 시작 ---");
    await new Promise(resolve => setTimeout(resolve, 1500)); // 네트워크 지연 시뮬레이션

    // 테스트 케이스 1: 성공적인 API 호출
    if (email === "success@test.com") {
        console.log("API Success: 정상 데이터 처리 완료.");
        return { status: 'SUCCESS', message: "진단 보고서 생성 완료." };
    } 
    // 테스트 케이스 2: 인증 구조적 결함 발생 시뮬레이션 (Warning/Modal 트리거)
    else if (email === "fail-auth@test.com") {
        console.error("API Failure: AUTH-STRUC 에러 발생.");
        return { status: 'ERROR', code: 'AUTH-STRUC', message: "인증 구조적 결함 발생." };
    } 
    // 테스트 케이스 3: 결제 실패 시뮬레이션 (Critical/Modal 트리거)
    else if (email === "fail-pay@test.com") {
        console.error("API Failure: PAYMENT-FAIL 에러 발생.");
        return { status: 'ERROR', code: 'PAYMENT-FAIL', message: "결제 시스템 연결 불가." };
    } 
    // 테스트 케이스 4: 일반적인 입력 실패 (경고 메시지만 출력)
    else {
        console.warn("API Warning: 단순 데이터 유효성 검사 실패.");
        return { status: 'WARNING', message: "정보가 부족합니다." };
    }
};

// 전역 상태를 사용해 API 호출을 트리거하는 메인 레이아웃 컴포넌트
const AppContent = () => {
    const [userEmail, setUserEmail] = useState("success@test.com");
    const { openCriticalModal } = useContext(SystemContext);

    // 사용자가 버튼을 누를 때마다 API 호출 및 모달 트리거 시도
    const handleDiagnosticRun = async (e) => {
        e.preventDefault();
        console.log("--- [UI] 진단 실행 시작 ---");

        // 1. API 호출 시뮬레이션
        const result = await mockProcessData(userEmail, "tech");

        if (result && result.status === 'ERROR' && ['AUTH-STRUC', 'PAYMENT-FAIL'].includes(result.code)) {
            // API가 실패하고 우리가 정의한 Critical Error 코드가 반환된 경우, 모달 강제 호출
            openCriticalModal(result.code, `API Call Failed: ${result.message}`);
        } else if (result) {
             alert(`진단 결과 수신: ${result.status}. 성공 시 PELS 카운터가 정상적으로 작동해야 합니다.`);
        }
    };

    return (
        <div className="p-10 bg-gray-950 min-h-screen text-white">
            <h1 className="text-4xl font-extrabold mb-8 text-red-500 tracking-widest">[SYSTEM DIAGNOSTIC PORTAL v2.0]</h1>
            <p className="mb-8 text-gray-300">진단 서비스를 실행하여 PELS 카운터 및 에러 모달의 E2E 흐름을 검증합니다.</p>

            {/* 1. PELS 컴포넌트 배치 (항상 최상단에 노출) */}
            <PelsCounter />
            
            <div className="mt-12 p-8 bg-gray-900 shadow-2xl">
                <h2 className="text-2xl font-mono mb-6 text-cyan-400">[TEST HARNESS] E2E 흐름 검증 영역</h2>
                <form onSubmit={handleDiagnosticRun} className="space-y-6 max-w-md">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">테스트 이메일 (API 트리거 선택):</label>
                        <select 
                            id="email" 
                            value={userEmail} 
                            onChange={(e) => setUserEmail(e.target.value)}
                            className="w-full p-3 bg-gray-800 border border-cyan-600 text-white focus:ring-2 focus:ring-red-500"
                        >
                            <option value="success@test.com">✅ 성공 (정상 흐름)</option>
                            <option value="fail-auth@test.com">⚠️ 인증 구조적 결함 (AUTH-STRUC 모달 트리거)</option>
                            <option value="fail-pay@test.com">🛑 결제 실패 (PAYMENT-FAIL Critical 모달 트리거)</option>
                            <option value="random@test.com">❓ 일반 오류 (경고만 출력)</option>
                        </select>
                    </div>
                    <button 
                        type="submit"
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold transition duration-200 shadow-lg">
                        진단 실행 (API 호출 및 State 변경)
                    </button>
                </form>
            </div>

            {/* 2. 시스템 모달 컴포넌트 배치 (상태에 따라 조건부 렌더링) */}
            <SystemModal />
        </div>
    );
};


// 최종 앱 구조: Context Provider로 감싸야 모든 컴포넌트가 State를 공유함
const App = () => (
    <SystemProvider>
        <AppContent />
    </SystemProvider>
);

export default App;