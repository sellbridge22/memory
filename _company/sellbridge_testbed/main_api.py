from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import time
from typing import List, Dict
from version_manager import version_manager # 위에서 만든 버전 관리 모듈 임포트

app = FastAPI(title="Selbridge Agent Test Bed API")

# ----------------------
# 데이터 스키마 정의 (사용자 요청/응답 형식)
# ----------------------
class TestCase(BaseModel):
    test_id: str
    input_prompt: str # 테스트할 입력 프롬프트
    expected_output_keywords: List[str]

class TestRunRequest(BaseModel):
    test_set: List[TestCase]
    active_version: str = "v1.0"  # 테스트에 사용할 버전 지정

class TestResult(BaseModel):
    test_id: str
    status: str # SUCCESS, FAILURE, INCOMPLETE
    actual_output: str
    metrics: Dict[str, float]

# ----------------------
# 전역 상태 저장소 (DB 대신 사용)
# ----------------------
def load_state() -> Dict:
    try:
        with open("state_store.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print("[System] state_store.json 파일을 찾을 수 없습니다. 초기화합니다.")
        return {"runs": [], "metrics": {}}

def save_state(data: Dict):
    with open("state_store.json", "w") as f:
        json.dump(data, f)

# ----------------------
# API 엔드포인트 구현
# ----------------------

@app.get("/status")
async def get_system_status():
    """시스템의 현재 활성 버전과 상태를 확인합니다."""
    return {
        "status": "✅ Operational",
        "active_version": version_manager.current_config['prompt_hash'],
        "last_run_time": time.strftime("%Y-%m-%d %H:%M:%S")
    }

@app.post("/test/run-suite", response_model=List[TestResult])
async def run_test_suite(request: TestRunRequest):
    """A/B 테스트 또는 회귀 테스트를 실행합니다."""
    print(f"\n--- [API] {request.active_version} 버전으로 {len(request.test_set)}개 케이스 테스트 시작 ---")
    
    # 1. Version Checkout (로직 격리)
    try:
        version_manager.set_active_version(request.active_version)
        system_prompt = version_manager.get_prompt_for_version(request.active_version)
        print(f"[TestEngine] ✅ Loaded Prompt for {request.active_version}.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    test_results = []
    total_success = 0
    
    # 2. Test Execution Loop (시뮬레이션)
    for i, test_case in enumerate(request.test_set):
        print(f"  -> Running Test Case {i+1}/{len(request.test_set)}: {test_case.test_id}")

        # [핵심 로직 시뮬레이션]: 실제로는 여기에 LLM API 호출 코드가 들어갑니다.
        time.sleep(0.1) # 비동기 지연 시간 모방
        if "failure" in test_case.input_prompt.lower():
            status = "FAILURE"
            actual_output = f"ERROR: Failed to process input due to version mismatch."
            metrics = {"latency": 50, "accuracy": 0.1}
            print("  -> [SIMULATE] Failure detected.")
        else:
            # 성공 시뮬레이션 (버전별로 약간 다른 성능 부여)
            status = "SUCCESS"
            actual_output = f"성공적으로 처리됨. 결과 키워드 포함: {', '.join(test_case.expected_output_keywords)}"
            metrics = {"latency": 150, "accuracy": 0.95} if request.active_version == "v2.3-beta" else {"latency": 180, "accuracy": 0.85}
            total_success += 1
        
        test_results.append(TestResult(
            test_id=test_case.test_id,
            status=status,
            actual_output=actual_output,
            metrics=metrics
        ))

    # 3. Metric Aggregation 및 회귀 검사
    total_tests = len(request.test_set)
    success_rate = (total_success / total_tests) * 100 if total_tests > 0 else 0
    
    # 성능 메트릭 저장소 업데이트
    state = load_state()
    state['runs'].append({
        "version": request.active_version,
        "test_set": [t.dict() for t in request.test_set],
        "results": [r.dict() for r in test_results],
        "metrics": {"success_rate": success_rate}
    })
    state['metrics']['latest'] = {"SuccessRate": f"{success_rate:.2f}%"}
    save_state(state)

    # 4. Regression Check 수행 (가장 중요한 안전 장치)
    if version_manager.check_for_regression({"success_rate": success_rate}):
        print("🛑 [SYSTEM ALERT] 치명적인 성능 저하 감지! 즉시 롤백이 필요합니다.")

    return test_results

@app.post("/control/rollback")
async def trigger_rollback(target_version: str):
    """성능 저하 감지 시, 안정화된 이전 버전으로 시스템을 강제 전환합니다."""
    print(f"\n--- [CONTROL] 🚨 긴급 롤백 시작 요청: {target_version} ---")
    try:
        # 버전 관리자에게 직접 명령하여 활성화 버전을 변경합니다.
        version_manager.set_active_version(target_version)
        return {"status": "SUCCESS", "message": f"시스템이 안정화된 버전 '{target_version}'으로 성공적으로 롤백되었습니다."}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# 초기 상태 파일 생성 (실제 실행 시 필요)
with open("state_store.json", "w") as f:
    json.dump({"runs": [], "metrics": {}}, f)