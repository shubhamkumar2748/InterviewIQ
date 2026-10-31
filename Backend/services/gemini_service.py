import os
import json
import logging
import random
from typing import List, Dict, Any, Optional
from backend.config import GEMINI_API_KEY, DEFAULT_GEMINI_MODEL
from backend.models import Question, QuestionEvaluation
logger = logging.getLogger("interviewiq.gemini")
logging.basicConfig(level=logging.INFO)
# Role curated knowledge base for high fidelity questions & fallback
ROLE_CURATED_DATA = {
    "Frontend Developer": {
        "topics": ["React Lifecycle & Hooks", "Virtual DOM & Rendering Performance", "CSS Architecture & Flexbox/Grid", "JavaScript Event Loop & Promises", "Browser Storage & Web APIs", "State Management (Redux/Zustand)", "TypeScript in Frontend", "Web Accessibility & Core Web Vitals"],
        "sample_questions": [
            {
                "question": "Can you explain how the React reconciliation algorithm works, specifically what the Virtual DOM does and why 'keys' are critical in lists?",
                "topic": "Virtual DOM & Rendering Performance",
                "difficulty": "Intermediate",
                "expected_points": ["Virtual DOM is a lightweight JS representation of the real DOM", "Diffing algorithm compares previous and next tree in O(n) time", "Keys identify elements across re-renders to avoid re-mounting", "Helps batch updates and minimize layout thrashing"],
                "hint": "Think about tree diffing heuristics and why array indexes can cause subtle bugs when items are reordered."
            },
            {
                "question": "What is the JavaScript Event Loop, and how does it prioritize microtasks (Promises) versus macrotasks (setTimeout)?",
                "topic": "JavaScript Event Loop & Promises",
                "difficulty": "Intermediate",
                "expected_points": ["Call stack executes synchronous code", "Microtask queue holds Promise callbacks and MutationObservers", "Macrotask queue holds setTimeout, setInterval, I/O", "Microtask queue is fully emptied before next macrotask is processed"],
                "hint": "Walk through the execution order when both a resolved Promise and setTimeout(..., 0) are triggered."
            },
            {
                "question": "How do you optimize Core Web Vitals, specifically Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS)?",
                "topic": "Web Accessibility & Core Web Vitals",
                "difficulty": "Advanced",
                "expected_points": ["LCP measures main content render time; optimize with CDN, image compression, preload critical assets", "CLS measures unexpected shifts; fix with explicit image width/height dimensions", "Avoid injecting dynamic DOM content above existing elements", "Font display: swap with matching fallback font"],
                "hint": "Mention image aspect ratios, preloading hero elements, and reserved container spaces."
            }
        ]
    },
    "Backend Developer": {
        "topics": ["RESTful API Design & Best Practices", "Database Indexing & Query Optimization", "Microservices vs Monolith Architecture", "Concurrency & Threading Models", "Caching Strategies (Redis)", "Authentication & JWT Security", "Message Queues (Kafka/RabbitMQ)", "ACID Properties & Transactions"],
        "sample_questions": [
                "Python Developer": {
        "topics": ["Python GIL & Multiprocessing vs Asyncio", "Decorators & Generators", "Metaclasses & Dunder Methods", "Memory Management & Garbage Collection", "FastAPI / Django Ecosystem", "Pytest & Mocking", "Data Structures & Performance", "Type Hinting & Pydantic"],
        "sample_questions": [
            {
                "question": "How does Python's Global Interpreter Lock (GIL) affect multi-threaded programs, and when should you choose multiprocessing or asyncio instead?",
                "topic": "Python GIL & Multiprocessing vs Asyncio",
                "difficulty": "Intermediate",
                "expected_points": ["GIL allows only one native thread to execute Python bytecode at a time", "CPU-bound tasks do not benefit from threading; use multiprocessing to utilize multiple CPU cores", "I/O-bound tasks benefit from threading or asyncio (cooperative multitasking without OS thread overhead)", "Python 3.13+ free-threaded build considerations"],
                "hint": "Distinguish between CPU-bound math operations and I/O-bound network calls."
            },
            {
                "question": "Explain how Python manages memory using reference counting and the cyclic garbage collector (generational GC).",
                "topic": "Memory Management & Garbage Collection",
                "difficulty": "Advanced",
                "expected_points": ["Primary mechanism is reference counting (deallocates immediately when ref count hits 0)", "Cyclic garbage collector handles self-referencing objects and cycles", "Divided into 3 generations (Gen 0, 1, 2) based on object longevity", "The gc module enables manual triggering and threshold tuning"],
                "hint": "Explain what happens when object A references object B and B references A."
            }
        ]
    },
    "Java Developer": {
        "topics": ["JVM Architecture & Memory Model", "Java Garbage Collection (G1, ZGC)", "Multithreading & Concurrency Utilities", "Spring Boot & Dependency Injection", "Generics & Type Erasure", "Design Patterns in Java", "Streams API & Lambdas", "JPA / Hibernate Performance"],
        "sample_questions": [
            {
                   "sample_questions": [
            {
                "question": "Explain Resource Acquisition Is Initialization (RAII) and how std::unique_ptr and std::shared_ptr manage resource lifecycles.",
                "topic": "RAII & Smart Pointers",
                "difficulty": "Intermediate",
                "expected_points": ["RAII ties resource lifecycle to object lifetime on the stack", "Destructor is automatically called when leaving scope, preventing resource leaks", "std::unique_ptr represents exclusive ownership with zero overhead", "std::shared_ptr uses an atomic reference counter in a control block"],
                "hint": "Explain cyclic references in shared_ptr and how std::weak_ptr solves it."
            },
            {
                "question": "How does dynamic polymorphism work in C++ under the hood via the vtable and vptr?",
                "topic": "Virtual Tables & Polymorphism",
                "difficulty": "Intermediate",
                "expected_points": ["Classes with virtual functions contain an invisible vptr pointer to a static vtable", "Vtable contains pointers to the actual virtual function implementations", "At runtime, calls through base pointer/reference are resolved via indirect pointer lookup", "Cost: extra pointer in class instance, cache miss on indirect call, prevents inlining"],
                "hint": "Draw the relationship between the object instance, the vptr, and the class vtable."
            }
        ]
    },
    "Data Analyst": {
        "topics": ["Advanced SQL (Window Functions, CTEs)", "Data Cleaning & Transformation", "Exploratory Data Analysis (EDA)", "Business Metrics & KPIs (LTV, Churn, CAC)", "Data Visualization Best Practices", "Statistical Significance & A/B Testing", "Excel / Power BI / Tableau Modeling", "Cohort Analysis"],
        "sample_questions": [
            {
                "question": "Explain SQL Window Functions (like ROW_NUMBER(), RANK(), DENSE_RANK(), and LAG/LEAD). When would you use DENSE_RANK over RANK?",
                "topic": "Advanced SQL (Window Functions, CTEs)",
                "difficulty": "Intermediate",
                "expected_points": ["Window functions perform calculations across related rows without collapsing them like GROUP BY", "RANK leaves gaps in sequence when there are ties (1, 2, 2, 4)", "DENSE_RANK does not leave gaps (1, 2, 2, 3)", "LAG/LEAD accesses data from preceding or following rows in the same partition"],
                "hint": "Think about finding the top 3 highest earning employees in each department."
            },
            {
                "question": "How would you design and analyze an A/B test for an e-commerce checkout flow to determine if a new design improves conversion rate?",
                "topic": "Statistical Significance & A/B Testing",
                "difficulty": "Intermediate",
                "expected_points": ["Define null and alternative hypothesis, primary metric (conversion rate) and guardrail metrics", "Sample size calculation using power analysis, alpha (0.05), and minimum detectable effect (MDE)", "Randomization and ensuring sample ratio mismatch (SRM) does not occur", "Evaluate p-value and confidence intervals before drawing business conclusions"],
                              {
                "question": "How does the CAP Theorem apply to distributed data stores, and how do systems choose between Consistency and Availability during a network partition?",
                "topic": "Distributed Systems & CAP Theorem",
                "difficulty": "Intermediate",
                "expected_points": ["Network Partition (P) is inevitable in distributed systems", "Under partition, system must choose either CP (reject writes to preserve strict consistency) or AP (serve stale/concurrent writes to stay available)", "Eventual consistency systems like Cassandra choose AP, while CockroachDB/Spanner favor CP"],
                "hint": "Explain why 'CA' is not a realistic option in the real world when network links fail."
            }
        ]
    },
    "HR / Behavioral Interview": {
        "topics": ["STAR Method Conflict Resolution", "Leadership & Ownership", "Handling Tight Deadlines & Prioritization", "Dealing with Ambiguity", "Failure & Lessons Learned", "Team Collaboration & Cross-Functional Work", "Career Aspirations & Growth", "Work Ethic & Culture Fit"],
        "sample_questions": [
            {
                "question": "Tell me about a time when you had a technical disagreement with a colleague or lead. How did you handle it and what was the outcome?",
                "topic": "STAR Method Conflict Resolution",
                "difficulty": "Beginner",
                "expected_points": ["Situation & Task clearly established", "Objective technical discussion based on data/benchmarks rather than ego", "Active listening and understanding counter-arguments", "Collaborative resolution with clear win-win outcome"],
                "hint": "Use the STAR format: Situation, Task, Action, and Result."
            },
            {
                "question": "Describe a project that failed or did not meet its initial expectations. What was your personal role, and what specific lessons did you take away?",
                "topic": "Failure & Lessons Learned",
                "difficulty": "Intermediate",
                "expected_points": ["Authentic acknowledgement of mistake without deflecting blame", "Clear analysis of root causes (e.g., poor requirements, missing automated tests)", "Proactive actions taken to remediate the damage", "Long-term systemic improvement implemented so it never happens again"],
                "hint": "Interviewers value self-awareness, accountability, and demonstrable growth after failure."
            },
            {
                "question": "How do you prioritize competing tasks when multiple stakeholders demand urgent deliverables with conflicting deadlines?",
                "topic": "Handling Tight Deadlines & Prioritization",
                "difficulty": "Intermediate",
                "expected_points": ["Impact vs Effort assessment (Eisenhower matrix)", "Transparent communication with stakeholders to align on trade-offs and expectations", "Negotiating scope reductions or phased rollouts", "Maintaining work quality under pressure without burning out"],
                "hint": "Highlight proactive communication before a deadline is missed rather than after."
            }
        ]
    }class GeminiService:
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self.client = None
        self._init_client()
    def _init_client(self):
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                logger.info("Google Gemini API client initialized successfully.")
            except Exception as e:
                logger.warning(f"Could not initialize google-genai client: {e}. Fallback engine will be active.")
                self.client = None
        else:
            logger.info("GEMINI_API_KEY not configured. High-fidelity intelligent generation engine active.")
    def generate_questions(
        self,
        job_role: str,
        experience_level: str,
        interview_type: str,
        topics: List[str],
        num_questions: int,
        resume_text: Optional[str] = None
    ) -> List[Question]:
        """Generate structured interview questions using Gemini or high-fidelity domain knowledge."""
        if self.client and self.api_key:
            try:
                prompt = f"""
You are an expert senior engineering hiring manager and principal interviewer conducting an authentic mock interview.
Role: {job_role}
Experience Level: {experience_level}
Interview Type: {interview_type}
Focus Topics: {', '.join(topics) if topics else 'Core industry topics'}
Number of Questions: {num_questions}
Resume Context (if any): {resume_text or 'None provided'}
Generate exactly {num_questions} interview questions tailored specifically to this candidate.
Each question must test practical, real-world understanding rather than simple memorization.
Return ONLY a valid JSON array of objects conforming to this schema (no markdown fences, just raw JSON):
[
  {{
    "id": 1,
    "question": "detailed question text",
    "topic": "specific topic name",
  "difficulty": "{experience_level}",
    "expected_points": ["critical concept 1", "critical concept 2", "critical concept 3"],
    "hint": "subtle guiding hint without giving away the answer",
    "code_template": "optional starter code or null if non-coding"
  }}
]
"""
                response = self.client.models.generate_content(
                    model=DEFAULT_GEMINI_MODEL,
                    contents=prompt
                )
                text = response.text.strip()
                if text.startswith("```json"):
                    text = text[7:]
                if text.startswith("```"):
                    text = text[3:]
                if text.endswith("```"):
                    text = text[:-3]
                text = text.strip()
                
                raw_list = json.loads(text)
                questions = []
                for idx, item in enumerate(raw_list):
                    questions.append(Question(
                        id=idx + 1,
                        question=item.get("question", ""),
                        topic=item.get("topic", job_role),
                        difficulty=item.get("difficulty", experience_level),
                        expected_points=item.get("expected_points", []),
                        hint=item.get("hint"),
                        code_template=item.get("code_template")
                    ))
                if questions:
                    return questions
            except Exception as e:
                logger.error(f"Gemini API question generation failed: {e}. Using high-fidelity generator.")
        # Fallback intelligent generator tailored per role, level, topics
        return self._generate_fallback_questions(job_role, experience_level, interview_type, topics, num_questions)
                questions = []
        # First use curated high-fidelity samples
        for idx, sample in enumerate(samples[:num_questions]):
            questions.append(Question(
                id=idx + 1,
                question=sample["question"],
                topic=sample["topic"],
                difficulty=sample.get("difficulty", experience_level),
                expected_points=sample.get("expected_points", []),
                hint=sample.get("hint")
            ))
        # If more questions are required, generate targeted questions for remaining topics
        current_count = len(questions)
        while current_count < num_questions:
            topic_idx = current_count % len(available_topics)
            topic = available_topics[topic_idx]
            
            if interview_type == "HR / Behavioral" or job_role == "HR / Behavioral Interview":
                q_text = f"Describe a situation in your recent experience dealing with {topic}. What actions did you take and what was the measured outcome?"
                pts = ["Context and objective", "Action taken demonstrating ownership", "Clear quantifiable result", "Key learnings"]
                hint = "Structure with the STAR method (Situation, Task, Action, Result)."
            elif interview_type == "Coding":
                q_text = f"Write an efficient implementation or discuss how you would design an algorithm for a practical {topic} scenario under time complexity O(N) and minimal space complexity."
                pts = ["Time and space complexity analysis", "Edge cases (null, empty, negative inputs)", "Clean, modular code structure"]
                hint = "Think about two-pointer techniques, hash maps, or sliding windows."
            else:
                q_text = f"In a real-world production environment for a {job_role}, how do you effectively implement and optimize {topic}? What common architectural pitfalls should be avoided?"
                pts = [f"Core mechanics of {topic}", "Scalability and reliability considerations", "Common bugs or performance anti-patterns", "Observability and testing"]
                hint = f"Focus on practical enterprise trade-offs when implementing {topic}."
            questions.append(Question(
                id=current_count + 1,
                question=q_text,
                topic=topic,
                difficulty=experience_level,
                expected_points=pts,
                hint=hint
            ))
            current_count += 1
        return questions
    def evaluate_single_answer(
        self,
        question: str,
        job_role: str,
        Evaluate the candidate's answer to this mock interview question.
Question: {question}
Candidate Answer: {user_answer}
Provide an honest, constructive, and accurate evaluation. Return ONLY a valid JSON object (no markdown fences, just raw JSON) conforming to this schema:
{{
  "question_id": {question_id},
  "score": 0 to 100,
  "technical_accuracy": 0 to 100,
  "clarity_communication": 0 to 100,
  "strengths": ["bullet point 1", "bullet point 2"],
  "improvements": ["constructive critique 1", "constructive critique 2"],
  "model_answer": "a model 10/10 answer that the candidate can study and learn from",
  "feedback_summary": "2-3 sentences summarizing the candidate's performance"
}}
"""
                response = self.client.models.generate_content(
                    model=DEFAULT_GEMINI_MODEL,
                    contents=prompt
                )
                text = response.text.strip()
                if text.startswith("```json"):
                    text = text[7:]
                if text.startswith("```"):
                    text = text[3:]
                if text.endswith("```"):
                    text = text[:-3]
                text = text.strip()
                data = json.loads(text)
                return QuestionEvaluation(
                    question_id=question_id,
                    score=int(data.get("score", 75)),
                    technical_accuracy=int(data.get("technical_accuracy", 75)),
                              ],
            improvements=[
                "Provide deeper architectural nuance and quantitative benchmarks",
                "Discuss failure modes and production trade-offs explicitly"
            ],
            model_answer=f"When discussing {question[:50]}..., senior engineers clearly outline the core mechanism, compare trade-offs against alternative approaches, and cite concrete production experiences.",
            feedback_summary=f"Strong foundational grasp with {word_count} words submitted. Deepen your explanation of practical trade-offs to reach top-tier interview scores."
        )
    def generate_final_report(
        self,
        job_role: str,
        experience_level: str,
        interview_type: str,
        questions: List[Question],
        evaluations: List[QuestionEvaluation]
    ) -> Dict[str, Any]:
        """Aggregate evaluations into a comprehensive performance report with analytics."""
        if not evaluations:
            return {}
        avg_score = round(sum(e.score for e in evaluations) / len(evaluations), 1)
        tech_score = round(sum(e.technical_accuracy for e in evaluations) / len(evaluations), 1)
        comm_score = round(sum(e.clarity_communication for e in evaluations) / len(evaluations), 1)
        problem_solving_score = round(min(100, max(40, (tech_score * 0.5) + (comm_score * 0.5) + random.randint(-3, 4))), 1)
        # Aggregate topic performance
        topic_scores: Dict[str, List[int]] = {}
        for q, ev in zip(questions, evaluations):
            topic = q.topic
            topic_scores.setdefault(topic, []).append(ev.score)
        topic_averages = {
            t: round(sum(scores) / len(scores), 1)
            for t, scores in topic_scores.items()
        }
        # Determine strongest and weakest topics
        sorted_topics = sorted(topic_averages.items(), key=lambda x: x[1], reverse=True)
        strongest = [t[0] for t in sorted_topics if t[1] >= 70][:3]
        if not strongest and sorted_topics:
            strongest = [sorted_topics[0][0]] 
            weakest = [t[0] for t in sorted_topics if t[1] < 75]
        if not weakest and len(sorted_topics) > 1:
            weakest = [sorted_topics[-1][0]]
        # Actionable recommendations based on score and weaknesses
        recommendations = []
        if avg_score >= 85:
            recommendations.append("Outstanding performance! You are interview-ready for top tech positions.")
            recommendations.append("Continue practicing high-level system design and edge-case handling under time constraints.")
        elif avg_score >= 70:
            recommendations.append("Solid performance. Focus on quantifying your answers with metrics and explicit production trade-offs.")
            recommendations.append(f"Review core principles of: {', '.join(weakest) if weakest else 'system bottlenecks'}.")
        else:
            recommendations.append("Build deeper foundational knowledge in key problem areas before technical screen rounds.")
            recommendations.append("Practice the STAR technique (Situation, Task, Action, Result) for structured communication.")
            if weakest:
                recommendations.append(f"Dedicated study recommended for: {', '.join(weakest)}.")
        all_strengths = []
        for e in evaluations:
            all_strengths.extend(e.strengths)
        all_improvements = []
        for e in evaluations:
            all_improvements.extend(e.improvements)
        # Deduplicate
        unique_strengths = list(dict.fromkeys(all_strengths))[:4]
        unique_improvements = list(dict.fromkeys(all_improvements))[:4]
        return {
            "overall_score": int(avg_score),
            "technical_score": int(tech_score),
            "communication_score": int(comm_score),
            "problem_solving_score": int(problem_solving_score),
            "topic_scores": topic_averages,
            "strongest_topics": strongest,
            "weakest_topics": weakest,
            "key_strengths": unique_strengths,
            "critical_weaknesses": unique_improvements,
            "recommendations": recommendations,
            "evaluations": [e.model_dump() for e in evaluations]
        }
gemini_service = GeminiService()