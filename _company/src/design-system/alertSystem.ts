// 이 파일은 FlowController가 사용하는 Dependency Injection 역할을 수행합니다.
/**
 * @interface SystemAlertComponentPropsResolver
 * 경고 메시지를 받아서 실제 UI 컴포넌트(System Alert)를 렌더링하는 로직을 담당합니다.
 */
export interface SystemAlertComponentProps {
    severity: 'WARNING' | 'ERROR' | 'CRITICAL'; // [근거: Designer MVS]
    message: string;
    code: string; // 시스템 결함 코드 (e.g., AUTH-STRUC)
}

/**
 * 핵심 역할을 하는 Resolver 클래스. 실제 렌더링 대신, Props를 표준화하여 로직만 검증합니다.
 */
export class SystemAlertComponentPropsResolver {
    private currentAlert: SystemAlertComponentProps | null = null;

    public resolveAndDisplayAlert(props: SystemAlertComponentProps): void {
        this.currentAlert = props;
        console.warn(`[System Alert Triggered] Severity: ${props.severity} | Code: ${props.code}`);
        // 실제 환경에서는 여기에 <SystemAlertModal {...props} /> 를 호출하는 로직이 들어갑니다.
    }

    public getCurrentProps(): SystemAlertComponentProps | null {
        return this.currentAlert;
    }
}