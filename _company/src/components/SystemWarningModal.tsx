import React from 'react';
import './SystemWarningModal.css'; // 새로운 CSS 파일을 연결합니다

interface SystemWarningModalProps {
  message: string;
}

const SystemWarningModal: React.FC<SystemWarningModalProps> = ({ message }) => {
  return (
    <div className="system-warning-modal glitch-active">
      <div className="modal-content">
        <span className="alert-icon">[!]</span>
        <h2>SYSTEM ERROR DETECTED</h2>
        <p>{message}</p>
        <button className="close-btn" onClick={() => {}}>Dismiss</button>
        <small className="subtext">이 경고는 구조적 결함을 의미합니다. 진단이 필수입니다.</small>
      </div>
    </div>
  );
};

export default SystemWarningModal;