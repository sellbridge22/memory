import React, { useContext } from 'react';
import { SystemContext } from '../context/SystemContext';

// Tailwind와 같은 유틸리티 클래스 기반으로 구현했다고 가정하고 작성합니다.
const PelsCounter = () => {
    const { state } = useContext(SystemContext);
    const { pelsType, level } = state; // Assume pelsType is the component name prefix

    // CSS 애니메이션을 강제하기 위해 상태 레벨에 따라 클래스 적용
    const getLevelClasses = (level) => {
        switch (level) {
            case 'warning':
                return 'bg-yellow-800/20 border-yellow-500 animate-flicker'; // CSS 애니메이션 필요
            case 'critical':
                return 'bg-red-900/40 border-red-600 animate-glitch'; // CSS 애니메이션 필요
            case 'normal':
            default:
                return 'border-gray-700 bg-gray-800/50';
        }
    };

    return (
        <div className={`p-4 rounded-lg shadow-xl border-l-4 ${getLevelClasses(state.level)} w-full`}>
            <h3 className="text-sm font-mono uppercase tracking-widest text-gray-400 mb-1">
                [SYSTEM WARNING] Potential Economic Loss Counter
            </h3>
            <div className="flex items-baseline space-x-2">
                {/* PELS 값 자체에 애니메이션 클래스를 적용하여 불안정함을 표현 */}
                <span 
                    className={`text-5xl font-extrabold transition-all duration-100 ${state.level === 'critical' ? 'animate-shake text-red-400' : 'text-cyan-300'} flex items-center`}>
                    ${state.pelsValue.toFixed(2)} 
                    <span className="ml-2 text-xl font-semibold text-gray-300">USD</span>
                </span>
                {/* 현재 경고 레벨을 강력하게 표시 */}
                <div className={`text-sm px-3 py-1 rounded-full font-bold ${state.level === 'critical' ? 'bg-red-700 text-white animate-pulse' : state.level === 'warning' ? 'bg-yellow-600 text-gray-900' : 'bg-green-600/50 text-green-300'}`}>
                    {state.level.toUpperCase()}
                </div>
            </div>
        </div>
    );
};

export default PelsCounter;