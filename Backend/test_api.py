import sys
import pathlib
backend_dir = pathlib.Path(__file__).resolve().parent
project_root = backend_dir.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(backend_dir))

if (project_root / "backend" / "main.py").is_file():
    from backend.main import app
else:
    from main import app

from fastapi.testclient import TestClient

def run_tests():
    client = TestClient(app)
    
    print("Testing /api/health...")
    r = client.get("/api/health")
    assert r.status_code == 200, f"Health check failed: {r.text}"
    print("Health response:", r.json())
    print("\nTesting /api/roles...")
    r = client.get("/api/roles")
    assert r.status_code == 200, f"Roles failed: {r.text}"
    roles = r.json()
    assert len(roles) == 10, f"Expected 10 roles, got {len(roles)}"
    print(f"Verified {len(roles)} job roles loaded.")
    print("\nTesting /api/interviews/setup (Frontend Developer)...")
    setup_payload = {
        "user_id": "test_user_01",
        "job_role": "Frontend Developer",
        "experience_level": "Intermediate",
        "interview_type": "Technical",
        "topics": ["React Lifecycle & Hooks", "Virtual DOM & Rendering Performance"],
        "num_questions": 3
    }
    r = client.post("/api/interviews/setup", json=setup_payload)
    assert r.status_code == 200, f"Setup failed: {r.text}"
    session = r.json()["session"]
    interview_id = session["id"]
    questions = session["questions"]
    assert len(questions) == 3, f"Expected 3 questions, got {len(questions)}"
    print(f"Created interview session: {interview_id} with {len(questions)} questions.")
    print("\nTesting /api/interviews/evaluate-single...")
    eval_payload = {
        "interview_id": interview_id,
        "question_id": questions[0]["id"],
        "question": questions[0]["question"],
        "job_role": "Frontend Developer",
        "experience_level": "Intermediate",
        "user_answer": "React uses a virtual DOM diffing algorithm to compute minimal set of real DOM updates. Keys identify items uniquely to prevent unnecessary re-renders."
    }
    r = client.post("/api/interviews/evaluate-single", json=eval_payload)
    assert r.status_code == 200, f"Evaluate single failed: {r.text}"
    single_eval = r.json()
    assert "score" in single_eval
    print(f"Single answer evaluation score: {single_eval['score']}%")
    print("\nTesting /api/interviews/submit (Full Evaluation)...")
    submit_payload = {
        "interview_id": interview_id,
        "answers": {
            questions[0]["id"]: "React uses a virtual DOM diffing algorithm to compute minimal real DOM updates.",
            questions[1]["id"]: "The event loop manages microtasks like promises before macrotasks like setTimeout.",
            questions[2]["id"]: "Core Web Vitals measure LCP, FID, and CLS to ensure smooth user experience."
        }
    }
    r = client.post("/api/interviews/submit", json=submit_payload)
    assert r.status_code == 200, f"Submit failed: {r.text}"
    result = r.json()["data"]
    report = result["report"]
    print("Report generated successfully!")
    print(f"Overall Score: {report['overall_score']}%, Technical Score: {report['technical_score']}%, Comm Score: {report['communication_score']}%")
    print("\nTesting /api/dashboard/stats...")
    r = client.get("/api/dashboard/stats?user_id=test_user_01")
    assert r.status_code == 200, f"Dashboard stats failed: {r.text}"
    stats = r.json()
    assert stats["total_interviews"] >= 1
    print(f"Dashboard Stats: {stats['total_interviews']} interviews completed, Avg Score: {stats['average_score']}")
    print("\nAll backend endpoints verified successfully! 100% PASS.")
if __name__ == "__main__":
    run_tests()