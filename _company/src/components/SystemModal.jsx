import React, { useContext } from 'react';
import { SystemContext } from '../context/SystemContext';

const SystemModal = () => {
    const { state, closeModal } = useContext(SystemContext);

    if (!state.isModalOpen) return null;

    // 모달 내용 생성 (에러 코드 기반으로 메시지 동적 변경)
    let title = "CRITICAL SYSTEM FAILURE";
    let messageBody = `[Error Code: ${state.modalErrorCode}] 시스템 처리 과정에서 필수적인 구조적 결함이 감지되었습니다. 데이터 무결성이 보장되지 않아 서비스 이용이 불가능합니다.`;

    if (state.modalErrorCode === 'AUTH-STRUC') {
        title = "AUTHENTICATION FAILURE";
        messageBody = `[Error Code: AUTH-STRUC] 인증 구조적 결함. 현재 로그 제출 과정에 사용자의 필수 정보가 누락되거나 변조된 것으로 의심됩니다. 전문가의 진단이 필요합니다.`;
    } else if (state.modalErrorCode === 'PAYMENT-FAIL') {
        title = "TRANSACTION FAILURE";
        messageBody = `[Error Code: PAYMENT-FAIL] 결제 게이트웨이 연결 실패. 이는 단순 오류가 아닌, 현재 시스템 환경의 구조적 불안정성을 의미합니다.`;
    }

    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className={`w-full max-w-xl p-8 border-4 ${state.level === 'critical' ? 'border-red-700 shadow-[0_0_30px_rgba(255,0,51,0.8)] animate-pulse' : 'border-yellow-600'} bg-gray-900/95`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-3xl font-mono tracking-widest ${state.level === 'critical' ? 'text-red-400 animate-glitch' : 'text-yellow-400'}`}>{title}</h2>
                    <button onClick={closeModal} className="text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
                </div>
                <p className="text-lg text-red-200 mb-6">{messageBody}</p>
                
                <div className="bg-black p-3 rounded border border-red-800/50 text-sm font-mono">
                    <strong>ACTION REQUIRED:</strong> 이 경고는 임시 오류가 아닙니다. 시스템 구조 진단 및 재설정이 필수적입니다.
                </div>

                <button 
                    onClick={closeModal} // 실제로는 '진단 페이지'로 리다이렉트해야 함
                    className="mt-8 w-full py-3 text-lg bg-red-600 hover:bg-red-700 transition duration-200 font-bold shadow-lg">
                    필수 시스템 진단 요청 (무료) ➡️
                </button>
            </div>
        </div>
    );
};

export default SystemModal;