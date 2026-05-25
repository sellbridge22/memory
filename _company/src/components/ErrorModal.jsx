// ErrorModal.jsx (에러 발생 시의 권위적 UI)
const ErrorModal = ({ code, message }) => {
    // 글리치 CSS 클래스를 적용하여 시스템 경고 느낌을 극대화합니다. [근거: Designer 산출물]
    return (
        <div className="modal glitch-error-overlay">
            <h2 style={{ color: '#FF0033' }}>🚨 SYSTEM WARNING ({code})</h2>
            <p>진단 과정 중 치명적인 시스템 오류가 감지되었습니다. 원인을 파악하려면 전문가의 개입이 필요합니다.</p>
            <p className="error-message">{message}</p>
        </div>
    );
};

export default ErrorModal;