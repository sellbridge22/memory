import React, { useState, useEffect } from 'react';

// 48시간 제한 타이머 및 비활성화 경고 모달을 처리하는 컴포넌트
const CountdownTimer = ({ initialSeconds = 48 * 3600 }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsExpired(true);
      return;
    }

    // 타이머를 1초 간격으로 업데이트
    const timerId = setInterval(() => {
      setSecondsLeft(prevTime => prevTime - 1);
    }, 1000);

    // 클린업 함수
    return () => clearInterval(timerId);
  }, [secondsLeft]);

  // 시간 계산 및 포맷팅 로직
  const formatTime = (time) => {
    const h = String(Math.floor(time / 3600)).padStart(2, '0');
    const m = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const s = String(time % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  let displayTime;
  if (isExpired) {
    displayTime = "TIME EXPIRED";
  } else {
    displayTime = formatTime(secondsLeft);
  }

  return (
    <div className={`timer-module ${isExpired ? 'expired' : ''}`}>
      <h3>남은 시간 경고</h3>
      <div className="time-display">{displayTime}</div>
      {/* 비활성화 경고 모달 스타일링 */}
      {isExpired && (
        <div className="warning-modal">
          ⚠️ 시스템 접근 불가: 패치 기간 만료. 이 시점 이후로는 구조적 위험 완화가 불가능합니다.
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;