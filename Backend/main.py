from __future__ import annotations

import random
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


app = FastAPI(title='InterviewIQ API', version='1.1.0')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


ROLES = [
    {
        'id': 'frontend-engineer',
        'name': 'Frontend Engineer',
        'category': 'Engineering',
        'description': 'Build modern web applications with performance, accessibility, and UI quality in focus.',
        'icon': 'Code2',
        'topics': ['React', 'JavaScript', 'Accessibility', 'Browser Rendering', 'State Management'],
    },
    {
        'id': 'backend-engineer',
        'name': 'Backend Engineer',
        'category': 'Core Tech',
        'description': 'Design scalable services, APIs, data flows, and system resilience for production workloads.',
        'icon': 'Server',
        'topics': ['REST APIs', 'System Design', 'Databases', 'Concurrency', 'Scaling'],
    },
    {
        'id': 'python-developer',
        'name': 'Python Developer',
        'category': 'Language Specialization',
        'description': 'Work with Python internals, APIs, async models, and application design in data-heavy systems.',
        'icon': 'Terminal',
        'topics': ['Python', 'Asyncio', 'FastAPI', 'Testing', 'Performance'],
    },
    {
        'id': 'product-manager',
        'name': 'Product Manager',
        'category': 'Behavioral',
        'description': 'Balance customer insight, roadmap trade-offs, and execution clarity across teams.',
        'icon': 'Layers',
        'topics': ['Product Strategy', 'Roadmaps', 'Metrics', 'Prioritization', 'Communication'],
    },
]

COMPANIES = [
    {'id': 'google', 'name': 'Google', 'tagline': 'Search and AI', 'level': 'High bar'},
    {'id': 'meta', 'name': 'Meta', 'tagline': 'Scale systems', 'level': 'Fast execution'},
    {'id': 'amazon', 'name': 'Amazon', 'tagline': 'Customer obsession', 'level': 'Operational excellence'},
    {'id': 'microsoft', 'name': 'Microsoft', 'tagline': 'Platform impact', 'level': 'Strong breadth'},
]

SESSIONS: Dict[str, Dict[str, Any]] = {}


class VerifyKeyRequest(BaseModel):
    api_key: str


class SetupInterviewRequest(BaseModel):
    user_id: str = 'guest_user'
    job_role: str
    experience_level: str = 'Intermediate'
    interview_type: str = 'Technical'
    topics: List[str] = Field(default_factory=list)
    num_questions: int = Field(default=5, ge=1, le=8)
    resume_text: Optional[str] = None


class EvaluateAnswerRequest(BaseModel):
    interview_id: str
    question_id: str
    question: str
    job_role: str
    experience_level: str
    user_answer: str


class SubmitInterviewRequest(BaseModel):
    interview_id: str
    answers: Dict[str, str]


class RetryRequest(BaseModel):
    interview_id: str
    question_id: str
    question: str
    job_role: str
    experience_level: str
    new_answer: str


def make_question(index: int, topic: str) -> Dict[str, Any]:
    question_text = {
        'React': 'Explain how React renders updates efficiently and why key props matter for list rendering.',
        'JavaScript': 'Walk through event loop behavior when Promise callbacks and setTimeout callbacks compete.',
        'Accessibility': 'How would you ensure a complex dashboard is usable for keyboard and screen-reader users?',
        'Browser Rendering': 'How would you optimize layout and paint work when the page becomes reflow-heavy?',
        'State Management': 'Describe how you decide between local state, context, and a dedicated state store for a feature.',
        'REST APIs': 'How would you design a clean REST API for a resource that needs pagination and rate limits?',
        'System Design': 'Design a scalable service that handles bursty traffic while preserving low latency.',
        'Databases': 'What trade-offs would you consider between SQL and NoSQL for a multi-tenant analytics workload?',
        'Concurrency': 'How do you reason about locking, race conditions, and throughput in a concurrent backend?',
        'Scaling': 'What signals tell you when a service needs sharding, caching, or a queue-based architecture?',
        'Python': 'Discuss Python performance trade-offs between synchronous, threaded, and async execution models.',
        'Asyncio': 'How does asyncio differ from multithreading for I/O-bound workloads and where does it fall short?',
        'FastAPI': 'What patterns would you use to validate, serialize, and secure a FastAPI service in production?',
        'Testing': 'What does a high-confidence automated test strategy for a backend service look like?',
        'Performance': 'How would you benchmark and reduce latency in a Python service that serves data-heavy endpoints?',
        'Product Strategy': 'How would you prioritize a roadmap when the engineering team has limited capacity?',
        'Roadmaps': 'How do you balance short-term delivery with long-term platform investments in a roadmap?',
        'Metrics': 'What product metrics would you monitor to know whether a new onboarding flow is working?',
        'Prioritization': 'How do you choose between two competing features with equal urgency?',
        'Communication': 'Describe a time when you aligned a cross-functional team around a risky decision.',
    }
    fallback = f'Discuss a practical approach to {topic.lower()} in a production environment.'
    return {
        'id': str(index),
        'question': question_text.get(topic, fallback),
        'topic': topic,
        'difficulty': 'Intermediate',
        'expected_points': [topic, 'Clear examples', 'Trade-off awareness'],
        'hint': 'Give a concrete example, explain trade-offs, and connect to business impact.',
    }


def build_session(payload: SetupInterviewRequest) -> Dict[str, Any]:
    topics = payload.topics or ROLES[0]['topics'][:3]
    questions = [
        make_question(i + 1, topic)
        for i, topic in enumerate(topics[: payload.num_questions])
    ]
    session_id = f"int_{uuid.uuid4().hex[:10]}"
    session = {
        'id': session_id,
        'user_id': payload.user_id,
        'job_role': payload.job_role,
        'experience_level': payload.experience_level,
        'interview_type': payload.interview_type,
        'topics': topics,
        'questions': questions,
        'status': 'in_progress',
        'answers': {},
        'created_at': datetime.now(timezone.utc).isoformat(),
    }
    SESSIONS[session_id] = session
    return session


def score_answer(question: str, answer: str) -> Dict[str, Any]:
    word_count = len(answer.split()) if answer else 0
    base = min(100, max(35, 70 + (word_count // 8) + random.randint(0, 18)))
    strengths = []
    improvements = []

    if 'trade-off' in answer.lower() or 'because' in answer.lower():
        strengths.append('Considers trade-offs and reasoning')
    else:
        improvements.append('Add clearer trade-off analysis')

    if 'example' in answer.lower() or 'for example' in answer.lower():
        strengths.append('Uses concrete examples')
    else:
        improvements.append('Include a concrete example to anchor your answer')

    if 'metrics' in answer.lower() or 'performance' in answer.lower():
        strengths.append('Connects the answer to measurable outcomes')
    else:
        improvements.append('Tie the answer back to measurable impact or KPIs')

    if not strengths:
        strengths = ['Structured explanation']

    summary = 'Strong answer with clear reasoning and relevant examples.' if base >= 80 else 'Answer is directionally correct but could be more concrete and structured.'

    return {
        'score': min(100, max(40, base)),
        'summary': summary,
        'strengths': strengths,
        'improvements': improvements,
    }


@app.get('/api/health')
def health() -> Dict[str, str]:
    return {'status': 'ok', 'service': 'InterviewIQ API'}


@app.post('/api/settings/verify-key')
def verify_key(payload: VerifyKeyRequest) -> Dict[str, Any]:
    return {'valid': bool(payload.api_key and len(payload.api_key) >= 10), 'model': 'gemini-2.5-flash'}


@app.get('/api/roles')
def get_roles() -> List[Dict[str, Any]]:
    return ROLES


@app.get('/api/companies')
def get_companies() -> List[Dict[str, Any]]:
    return COMPANIES


@app.post('/api/compensation/estimate')
def compensation_estimate(payload: Dict[str, Any]) -> Dict[str, Any]:
    role = str(payload.get('job_role', 'Software Engineer')).lower()
    base = 180000 if 'engineer' in role or 'developer' in role else 145000
    return {
        'salary': base,
        'range': {'min': int(base * 0.85), 'max': int(base * 1.25)},
        'payload': payload,
    }


@app.post('/api/interviews/start')
def create_interview(payload: SetupInterviewRequest):
    session = build_session(payload)
    return {'session': session}


@app.post('/api/interviews/setup')
def setup_interview(payload: SetupInterviewRequest):
    return create_interview(payload)


@app.post('/api/interviews/evaluate-answer')
def evaluate_answer(payload: EvaluateAnswerRequest):
    result = score_answer(payload.question, payload.user_answer)
    return {
        'score': result['score'],
        'summary': result['summary'],
        'strengths': result['strengths'],
        'improvements': result['improvements'],
        'question': payload.question,
    }


@app.post('/api/interviews/retry-question')
def retry_question(payload: RetryRequest):
    result = score_answer(payload.question, payload.new_answer)
    return {
        'score': result['score'],
        'summary': result['summary'],
        'strengths': result['strengths'],
        'improvements': result['improvements'],
    }


@app.post('/api/interviews/submit')
def submit_interview(payload: SubmitInterviewRequest):
    session = SESSIONS.get(payload.interview_id)
    if not session:
        raise HTTPException(status_code=404, detail='Interview session not found.')

    session['answers'] = payload.answers
    session['status'] = 'completed'

    answers = [score_answer(q['question'], payload.answers.get(q['id'], '')) for q in session['questions']]
    overall = round(sum(a['score'] for a in answers) / max(len(answers), 1))
    technical = max(40, min(100, overall + random.randint(-6, 6)))
    communication = max(35, min(100, overall - 4 + random.randint(-5, 5)))

    report = {
        'overall_score': overall,
        'technical_score': technical,
        'communication_score': communication,
        'strengths': ['Clear reasoning', 'Practical examples', 'Good trade-off awareness'],
        'weaknesses': ['Need more structure', 'Include more metrics when relevant'],
        'recommendations': ['Practice deeper examples', 'Use STAR/structure in behavioral cases'],
    }
    session['evaluation_report'] = report

    return {
        'data': {
            'job_role': session['job_role'],
            'experience_level': session['experience_level'],
            'interview_type': session['interview_type'],
            'report': report,
            'answers': payload.answers,
        }
    }


@app.get('/api/interviews/{interview_id}')
def get_interview(interview_id: str):
    session = SESSIONS.get(interview_id)
    if not session:
        raise HTTPException(status_code=404, detail='Interview not found')
    return session


@app.get('/api/dashboard/stats')
def dashboard_stats(user_id: str = Query('guest_user')):
    completed = [s for s in SESSIONS.values() if s.get('user_id') == user_id and s.get('status') == 'completed']

    if not completed:
        return {
            'total_interviews': 0,
            'average_score': 0,
            'technical_score': 0,
            'communication_score': 0,
            'recent_history': [],
            'strongest_topics': [],
            'weakest_topics': [],
            'recommendations': ['Take your first mock interview to start tracking growth.'],
            'score_trends': [
                {'name': 'Baseline', 'score': 0},
                {'name': 'Practice', 'score': 0},
            ],
        }

    scores = [s['evaluation_report']['overall_score'] for s in completed]
    tech_scores = [s['evaluation_report']['technical_score'] for s in completed]
    comm_scores = [s['evaluation_report']['communication_score'] for s in completed]

    recent_history = [
        {
            'id': s['id'],
            'job_role': s['job_role'],
            'experience_level': s['experience_level'],
            'interview_type': s['interview_type'],
            'created_at': s['created_at'],
            'score': s['evaluation_report']['overall_score'],
        }
        for s in sorted(completed, key=lambda x: x['created_at'], reverse=True)[:8]
    ]

    return {
        'total_interviews': len(completed),
        'average_score': round(sum(scores) / len(scores)),
        'technical_score': round(sum(tech_scores) / len(tech_scores)),
        'communication_score': round(sum(comm_scores) / len(comm_scores)),
        'recent_history': recent_history,
        'strongest_topics': ['Problem Solving', 'Clear Communication', 'Structured Answers'],
        'weakest_topics': ['Deeper Trade-off Analysis', 'Metrics Framing'],
        'recommendations': ['Practice one architecture question each week', 'Refine your answer structure and examples'],
        'score_trends': [
            {'name': 'Week 1', 'score': max(50, min(100, int(sum(scores) / len(scores)) - 8))},
            {'name': 'Week 2', 'score': max(50, min(100, int(sum(scores) / len(scores))))},
            {'name': 'Week 3', 'score': min(100, max(50, int(sum(scores) / len(scores)) + 4))},
        ],
    }


@app.get('/api/coach/deep-probe')
def deep_probe(question: str = 'Tell me more', candidate_answer: str = '', job_role: str = 'Software Developer', question_type: str = 'Technical'):
    return {
        'question': question,
        'candidate_answer': candidate_answer,
        'job_role': job_role,
        'question_type': question_type,
        'follow_ups': ['What was the key constraint?', 'How did you validate the decision?'],
    }


@app.get('/api/coach/scenario')
def scenario(scenario_id: Optional[str] = None):
    return {
        'id': scenario_id or 'demo-scenario',
        'title': 'Trade-off scenario',
        'prompt': 'A product launches with 2x traffic and must keep latency under 250ms.',
    }


@app.get('/api/coach/recovery')
def recovery(topic: str = 'Database Indexing & Locks', job_role: str = 'Software Developer'):
    return {
        'topic': topic,
        'jobRole': job_role,
        'steps': ['Revisit the core principle', 'Think through the constraints', 'Present the trade-off clearly'],
    }


@app.get('/api/coach/readiness')
def readiness(user_id: str = 'guest_user'):
    return {'userId': user_id, 'readiness': 84, 'message': 'At a strong interview readiness level'}


@app.get('/api/coach/blindspot-radar')
def blindspot(user_id: str = 'guest_user'):
    return {'userId': user_id, 'blindSpots': ['Trade-off analysis'], 'topSignals': ['Clear structure']}


if __name__ == '__main__':
    import uvicorn

    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True)
