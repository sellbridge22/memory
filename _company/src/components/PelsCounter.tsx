import React, { useState, useEffect } from 'react';
import { mockApiCall, PELS_THRESHOLDS, PelsState } from '../services/pelsService';
import './PelsCounter.css'; // CSS 파일 필요

interface PelsProps {
    initialData: Record<string, any>;
}

const PelsCounter: React.FC<PelsProps> = ({ initialData }) => {
    const [pelsResult, setPelsResult] = useState<{ score: number; state: PelsState; message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 컴포넌트 마운트 시 API 호출 (모킹)
        setIsLoading(true);
        mockApiCall(initialData).then((result) => {
            setPelsResult(result);
            setIsLoading(false);
        });
    }, [initialData]);

    if (isLoading) {
        return <div className="pels-container loading">🚨 시스템 진단 중... 데이터를 로드하고 있습니다.</div>;
    }

    if (!pelsResult) {
        return <div className="pels-container error">데이터를 가져올 수 없습니다. 코드를 검토해주세요.</div>;
    }

    const { score, state, message } = pelsResult;
    
    // 상태별 CSS 클래스 동적 할당 로직 (핵심)
    const getStatusClass = (state: PelsState): string => {
        switch(state) {
            case 'NORMAL': return 'status-normal';
            case 'WARNING': return 'status-warning';
            case 'CRITICAL': return 'status-critical';
            default: return '';
        }
    };

    // $ 형식 포매팅 함수 (가독성 확보)
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
    };


    return (
        <div className={`pels-container ${getStatusClass(state)}`}>
            <div className="pels-core">
                <span className="label">PELS</span>
                {/* 금액 포맷팅을 통해 높은 가치를 강조 */}
                <h1 aria-live="polite">{formatCurrency(score)}</h1> 
                <span className="unit">/ {formatCurrency(Math.round(score / 1000) * 1000)}</span>
            </div>
            <div className="pels-status">
                <p>{message}</p>
            </div>
        </div>
    );
};

export default PelsCounter;