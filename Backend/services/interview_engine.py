import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from backend.models import (
    InterviewSetupRequest,
    InterviewSession,
    Question,
    QuestionEvaluation,
    DashboardStats
)
from backend.services.gemini_service import gemini_service
from backend.services.firebase_service import firebase_service
class InterviewEngine:
    def create_interview_session(self, request: InterviewSetupRequest) -> InterviewSession:
        interview_id = f"int_{uuid.uuid4().hex[:10]}"
        created_at = datetime.now(timezone.utc).isoformat()
        # Generate questions using Gemini
        questions = gemini_service.generate_questions(
            job_role=request.job_role,
            experience_level=request.experience_level,
            interview_type=request.interview_type,
            topics=request.topics,
            num_questions=request.num_questions,
            resume_text=request.resume_text
        )
        session = InterviewSession(
            id=interview_id,
            user_id=request.user_id,
            job_role=request.job_role,
            experience_level=request.experience_level,
            interview_type=request.interview_type,
            topics=request.topics,
            questions=questions,
            status="in_progress",
            created_at=created_at,
            answers={}
        )
        # Save to database (Firestore / local)
        firebase_service.save_interview(session.model_dump())
        return session
    def evaluate_and_submit_all(self, interview_id: str, answers: Dict[int, str]) -> Dict[str, Any]:
        """Evaluate all submitted answers and produce the comprehensive final report."""
        session_data = firebase_service.get_interview(interview_id)
        if not session_data:
            raise ValueError(f"Interview session '{interview_id}' not found.")
        raw_questions = session_data.get("questions", [])
        questions = [Question(**q) for q in raw_questions]
        
        job_role = session_data.get("job_role", "Software Engineer")
                  "interview_type": interview_type,
            "report": report
        }
    def get_dashboard_stats(self, user_id: str) -> DashboardStats:
        """Calculate live, dynamic dashboard analytics from all completed interviews."""
        interviews = firebase_service.list_user_interviews(user_id)
        completed = [i for i in interviews if i.get("status") == "completed" and i.get("evaluation_report")]
        total_interviews = len(completed)
        if total_interviews == 0:
            return DashboardStats(
                total_interviews=0,
                average_score=0.0,
                technical_score=0.0,
                communication_score=0.0,
                recent_history=[],
                strongest_topics=[],
                weakest_topics=[],
                recommendations=[
                    "Welcome to InterviewIQ! Take your first mock interview to baseline your skills.",
                    "Select a job role matching your career goals to receive tailored interview questions.",
                    "Review model answers after each session to accelerate improvement."
                ],
                score_trends=[]
            )
        # Calculate averages from real completed sessions
        scores = [c["evaluation_report"].get("overall_score", 0) for c in completed]
        tech_scores = [c["evaluation_report"].get("technical_score", 0) for c in completed]
        comm_scores = [c["evaluation_report"].get("communication_score", 0) for c in completed]
                       "role": c.get("job_role", "Engineering"),
                "overall": rep.get("overall_score", 0),
                "technical": rep.get("technical_score", 0),
                "communication": rep.get("communication_score", 0)
            })
        # Recent history
        recent_history = []
        for c in completed[:8]:
            rep = c.get("evaluation_report", {})
            recent_history.append({
                "id": c.get("id"),
                "job_role": c.get("job_role"),
                "experience_level": c.get("experience_level"),
                "interview_type": c.get("interview_type"),
                "created_at": c.get("created_at"),
                "overall_score": rep.get("overall_score", 0),
                "technical_score": rep.get("technical_score", 0),
                "communication_score": rep.get("communication_score", 0),
                "total_questions": len(c.get("questions", []))
            })
        return DashboardStats(
            total_interviews=total_interviews,
            average_score=avg_score,
            technical_score=avg_tech,
            communication_score=avg_comm,
            recent_history=recent_history,
            strongest_topics=strongest,
            weakest_topics=weakest,
            recommendations=recommendations,
            score_trends=score_trends
        )
interview_engine = InterviewEngine()  