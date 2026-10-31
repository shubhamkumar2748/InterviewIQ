from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
class Question(BaseModel):
    id: int
    question: str
    topic: str
    difficulty: str = "Medium"
    expected_points: List[str] = []
    hint: Optional[str] = None
    code_template: Optional[str] = None
class InterviewSetupRequest(BaseModel):
    user_id: str = "guest_user"
    job_role: str
    experience_level: str  # Beginner, Intermediate, Advanced
    interview_type: str    # Technical, HR, Coding, Resume-based
    topics: List[str] = []
    num_questions: int = Field(default=5, ge=1, le=15)
    resume_text: Optional[str] = None
class InterviewSession(BaseModel):
    id: str
    user_id: str
    job_role: str
    experience_level: str
    interview_type: str
    topics: List[str]
    questions: List[Question]
    status: str = "in_progress" # in_progress, completed
    created_at: str
    answers: Dict[str, str] = {} # question_id (as str) -> answer
    evaluation_report: Optional[Dict[str, Any]] = None
class SingleAnswerEvaluationRequest(BaseModel):
    interview_id: str
    question_id: int
    question: str
    job_role: str
    experience_level: str
    user_answer: str
class QuestionEvaluation(BaseModel):
    question_id: int
    score: int
    technical_accuracy: int
    clarity_communication: int
    strengths: List[str]
    improvements: List[str]
    model_answer: str
    feedback_summary: str
class SubmitInterviewRequest(BaseModel):
    interview_id: str
    answers: Dict[int, str] # question_id -> user answer text
class DashboardStats(BaseModel):
    total_interviews: int
    average_score: float
    technical_score: float
    communication_score: float
    recent_history: List[Dict[str, Any]]
    strongest_topics: List[Dict[str, Any]]
    weakest_topics: List[Dict[str, Any]]
    recommendations: List[str]
    score_trends: List[Dict[str, Any]]