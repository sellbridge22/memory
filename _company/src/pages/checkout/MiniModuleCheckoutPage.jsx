import React, { useState } from 'react';
import PelsCounter from '../../components/PelsCounter';
import CountdownTimer from '../../components/CountdownTimer';
// 가정: checkoutService는 이 경로에 있다고 가정합니다.
import { executeSystemPatch } from '../../services/checkoutService'; 

const MiniModuleCheckoutPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorSimulated, setErrorSimulated] = useState(false);

  // 핵심 CTA: '시스템 복구 명령 실행' 핸들러
  const handleSystemPatchExecution = async () => {
    if (errorSimulated) {
      // 에러 시뮬레이션 로직 발동
      alert("🚨 [CRITICAL ERROR] 시스템 인증 실패. 구조적 무결성이 훼손되었습니다. 잠시 후 재진단이 필요합니다.");
      setErrorSimulated(true);
      return;
    }

    if (!PelsCounter.default || !CountdownTimer.default) {
        console.error("Dependency missing. Check component paths.");
        return;
    }


    setIsProcessing(true);
    
    try {
      // 1. 백엔드 서비스 호출 (실제 결제 로직 시뮬레이션)
      const result = await executeSystemPatch('MINI_MODULE_PRO', 'user@example.com');

      if (result.success && result.status === 'SUCCESS') {
        alert("✅ 시스템 패치 성공! 구조적 안정성이 복구되었습니다. 이제 당신은 안전합니다.");
        // 성공 후 리다이렉트 또는 완료 상태 표시 로직 추가
      } else {
        // 2. 백엔드에서 명시적으로 에러를 반환하는 경우 (e.g., 라이선스 만료)
        alert(`🛑 시스템 오류 발생: ${result.message}. 재진단을 시도하십시오.`);
        setErrorSimulated(true); // 실패했으므로 다음 클릭은 강제로 실패하게 함
      }

    } catch (error) {
      // 3. 네트워크 에러 또는 기타 치명적 에러 처리
      console.error("Checkout failed:", error);
      alert("🚨 연결 오류: 외부 시스템과의 통신에 실패했습니다. 인터넷 연결을 확인하십시오.");
      setErrorSimulated(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1>[System Alert] 구조적 무결성 복구 패치 실행</h1>
      <p className="sub-warning">당신의 시스템은 현재 심각한 손실 상태에 있습니다. 즉시 대응하십시오.</p>

      {/* 1. PELS 카운터 (가장 위급함을 강조) */}
      <PelsCounter />

      <div style={{ display: 'flex', gap: '30px', margin: '40px 0' }}>
        {/* 2. 타이머와 경고 모달 통합 */}
        <CountdownTimer />
      </div>

      {/* 가격 정보 및 최종 CTA 섹션 */}
      <div className="purchase-summary">
        <h2>Mini-Module 패치 키트</h2>
        <p>단가: ₩99,000 (한정)</p>
        
        {/* 3. 인터랙티브 CTA 버튼 */}
        <button 
          className={`system-command-btn ${errorSimulated ? 'failed' : ''}`} 
          onClick={handleSystemPatchExecution}
          disabled={isProcessing || errorSimulated}
        >
          {isProcessing ? '... 시스템 패치 실행 중' : (errorSimulated ? 'SYSTEM FAILURE' : '시스템 복구 명령 실행')}
        </button>

        <p className="disclaimer">
            *본 서비스는 구조적 역량 마모(PELS)를 측정하고, 시스템 무결성을 강제적으로 회복시키는 유일한 수단입니다. 
        </p>
      </div>
    </div>
  );
};

export default MiniModuleCheckoutPage;