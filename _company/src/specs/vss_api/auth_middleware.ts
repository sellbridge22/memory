/**
 * Middleware: VSS API 호출 전 필수 인증 및 권한 확인 (Authentication & Authorization)
 * @param req - Request object
 * @returns {Promise<void>}
 */
export const vssAuthMiddleware = async (req, res, next) => {
    // 1. JWT 토큰 추출 및 유효성 검사 (Authorization Check) [근거: 코다리 개인 메모리]
    const token = req.headers['authorization'];
    if (!token || !validateJwt(token)) {
        return res.status(401).json({ message: "Authentication Failed: Invalid or missing access token." });
    }

    // 2. 사용자 ID 추출 및 기본 검증 (User Identity Check) [근거: 코다리 검증된 지식]
    const userId = extractUserIdFromToken(token);
    if (!userId) {
        return res.status(403).json({ message: "Authorization Failed: User identity cannot be determined." });
    }

    // 3. 비즈니스 로직 기반 인가 검사 (Permission Check): 유료 서비스 이용 권한 확인
    try {
        const userSubscription = await UserService.fetchUserSubscription(userId);
        if (!userSubscription || userSubscription.level < "BASIC_AUTH") {
            // Critical Error Tone 적용: 사용자가 기능을 사용할 수 없음을 경고함
            return res.status(429).json({ 
                errorCode: "PAYMENT-RESTRICTION", 
                message: "Access Denied: 이 기능은 프리미엄 구독이 필요합니다. [상위 상품 구매 유도]" 
            });
        }
    } catch (error) {
        console.error("Subscription check failed:", error);
        return res.status(500).json({ errorCode: "AUTH-STRUC", message: "시스템 오류로 인해 서비스 이용이 불가합니다." });
    }

    // 모든 검증 통과 시 다음 로직으로 진행
    next(); 
};