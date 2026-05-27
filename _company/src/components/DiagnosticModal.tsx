import React, { useState } from 'react';
// 1단계에서 만든 Mock API 임포트
import { runDiagnosis } from '../services/mockDiagnosisService'; 

// TypeScript 인터페이스 정의 (Props Contract 명문화)
interface DiagnosticData {
    email: string;
    jobSector: string;
    scanResults: string[];
}

interface DiagnosisResult {
    success: boolean;
    statusCode: string;
    severityLevel: "Warning" | "Error" | "Critical Fail" | "Normal";
    message: string;
    statusUpdateRequired: boolean;
    diagnosisScore: number;
}

// 컴포넌트 정의 시작
const DiagnosticModal: React.FC = () => {
    const [formData, setFormData] = useState<DiagnosticData>({ 
        email: '', jobSector: '', scanResults: [] 
    });
    const [result, setResult] = useState<DiagnosisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // 입력 핸들러 (UX 상호작용 강제)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 진단 실행 로직 (State Machine Trigger)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null); 

        try {
            // Mock API 호출 및 비동기 대기 [근거: 코다리 검증된 지식]
            const diagnosis = await runDiagnosis(formData);
            setResult(diagnosis);

        } catch (error) {
            console.error("Diagnosis failed:", error);
            setResult({ 
                success: false, statusCode: "TECH-FAIL", severityLevel: "Critical Fail", 
                message: "시스템 연결 오류 발생. 잠시 후 다시 시도해주세요.", statusUpdateRequired: true, diagnosisScore: 0 
            });
        } finally {
            setIsLoading(false);
        }
    };

    // UI 출력 로직 (Severity Level에 따른 동적 스타일링)
    const getSeverityStyle = (level: DiagnosisResult['severityLevel']) => {
        switch (level) {
            case 'Warning': return 'text-yellow-400 border-yellow-500 bg-yellow-900/30';
            case 'Error': return 'text-red-600 border-red-700 bg-red-900/30';
            case 'Critical Fail': 
                // 네온 레드-사이언 블루 조합의 경고 UI 강제 적용 [근거: 지난 의사결정 로그]
                return 'text-neon-red border-cyan-400 shadow-[0_0_15px_rgba(255,0,0,0.8)] bg-black/70'; 
            default: return 'text-green-400 border-green-500 bg-green-900/30';
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto border rounded-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">// SYSTEM DIAGNOSTIC INTERFACE V1.0</h2>
            <p className="mb-6 text-sm text-gray-400">진단 분석을 위해 시스템 로그(전문 용어)를 입력해주세요.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                    <label htmlFor="email" className="block mb-1 text-sm font-medium">사용자 식별 이메일 (Email)</label>
                    <input 
                        type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} 
                        className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-cyan-400 outline-none" required />
                </div>

                {/* Job Sector Input */}
                <div>
                    <label htmlFor="jobSector" className="block mb-1 text-sm font-medium">운영 분야 (Operational Sector)</label>
                    <input 
                        type="text" id="jobSector" name="jobSector" value={formData.jobSector} onChange={handleInputChange} 
                        className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-cyan-400 outline-none" required />
                </div>

                {/* Scan Results Input (전문 용어 입력) */}
                <div>
                    <label htmlFor="scanResults" className="block mb-1 text-sm font-medium">시스템 스캔 결과 (Scan Results, 콤마 구분)</label>
                    <input 
                        type="text" id="scanResults" name="scanResults" value={formData.scanResults.join(', ')} onChange={(e) => {
                            const values = e.target.value.split(',').map(s => s.trim());
                            setFormData({...formData, scanResults: values});
                        }} 
                        className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-cyan-400 outline-none" placeholder="예: A1, B3, C5 (전문 용어)" required />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full p-3 font-bold rounded transition duration-200 ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400'} text-black`}
                >
                    {isLoading ? '진단 분석 중... ⚙️' : '시스템 진단 시작 (Run Diagnosis)'}
                </button>
            </form>

            {/* 결과 출력 영역 */}
            {result && (
                <div className={`mt-8 p-5 border-l-4 rounded-lg ${getSeverityStyle(result.severityLevel)}`}>
                    <h3 className="text-xl font-bold mb-2">⚡ [SYSTEM REPORT]</h3>
                    <p className="mb-3 text-sm uppercase tracking-widest">{result.statusCode} | {result.severityLevel}</p>
                    {/* 핵심 오류 메시지 출력 */}
                    <p className={`font-semibold ${result.severityLevel === 'Critical Fail' ? 'text-red-400 animate-pulse' : ''}`}>
                        {result.message}
                    </p>
                    
                    {/* 다음 단계 강제 유도 로직 (Mini-Module Funnel) */}
                    {result.statusUpdateRequired && (
                        <div className="mt-4 p-3 border-t border-red-600/50">
                            <p className="text-sm text-cyan-200 font-mono">[ACTION REQUIRED] 진단 리포트의 완전한 해석을 위해서는 상위 레벨의 데이터 구조 분석이 필요합니다. (진단 점수: {result.diagnosisScore})</p>
                        </div>
                    )}

                    {/* CTA 버튼 */}
                    <button 
                        className={`mt-4 w-full p-2 font-bold rounded ${result.severityLevel === 'Critical Fail' ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-500'} text-white`}
                        disabled={isLoading}
                    >
                        {result.statusUpdateRequired ? "Premium 진단 모듈 구매하기 (다음 단계 진행)" : "진단 리포트 다운로드"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default DiagnosticModal;