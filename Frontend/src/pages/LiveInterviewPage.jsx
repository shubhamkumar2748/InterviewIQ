import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import AIInterviewerCard, { PERSONAS } from '../components/AllnterviewerCard';
import { evaluateSingleAnswer, submitFullInterview } from '../services/api';

export default function LiveInterviewPage({ session, onFinishInterview, setActivePage }) {
  if (!session || !session.questions || session.questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-navy-950 p-4 text-center">
        <AlertTriangle className="mb-3 h-12 w-12 text-amber-400" />
        <h2 className="text-xl font-bold text-white">No Active Interview Session</h2>
        <p className="mt-1 max-w-sm text-sm text-slate-400">
          Please configure an interview track before starting the session.
        </p>
        <button
          type="button"
          onClick={() => setActivePage('setup')}
          className="mt-6 rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-semibold text-white"
        >
          Go to Interview Setup
        </button>
      </div>
    );
  }

  const { questions, job_role, experience_level, interview_type, id: interviewId } = session;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [singleFeedback, setSingleFeedback] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [activePersona, setActivePersona] = useState(PERSONAS[0]);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSecondsElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion.id] || '';

  const handleAnswerChange = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleEvaluateCurrent = async () => {
    if (!currentAnswer.trim()) return;
    setEvaluating(true);
    try {
      const result = await evaluateSingleAnswer({
        interview_id: interviewId,
        question_id: currentQuestion.id,
        question: currentQuestion.question,
        job_role,
        experience_level,
        user_answer: currentAnswer,
      });
      setSingleFeedback(result);
    } catch (error) {
      alert(error.message || 'Evaluation failed');
    } finally {
      setEvaluating(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await submitFullInterview({ interview_id: interviewId, answers });
      if (response?.data) {
        onFinishInterview(response.data);
        setActivePage('report');
      }
    } catch (error) {
      alert(error.message || 'Submission failed');
    }
  };

  const totalQuestions = questions.length;
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-navy-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <AIInterviewerCard
          isSpeaking={false}
          isListening={false}
          isEvaluating={evaluating}
          activePersona={activePersona}
          onSelectPersona={setActivePersona}
        />

        <div className="rounded-2xl border border-slate-800 bg-navy-900/80 p-4 shadow-glass">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-brand-purple">{job_role}</p>
              <h2 className="mt-1 text-xl font-bold text-white">{interview_type} Interview</h2>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-300">
              <Clock className="h-4 w-4 text-brand-purple" />
              {String(Math.floor(secondsElapsed / 60)).padStart(2, '0')}:{String(secondsElapsed % 60).padStart(2, '0')}
            </div>
          </div>

          <div className="mb-4 h-2.5 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-violet to-brand-blue" style={{ width: `${progress}%` }} />
          </div>

          <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-400">
              Question {currentIndex + 1} / {totalQuestions}
            </p>
            <h3 className="text-lg font-semibold text-white">{currentQuestion.question}</h3>
          </div>

          <textarea
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            rows={10}
            className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-white placeholder-slate-500 focus:border-brand-purple focus:outline-none"
            placeholder="Type your answer here..."
          />

          {singleFeedback && (
            <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                AI Feedback
              </div>
              <p>{singleFeedback.summary}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-emerald-100/90">
                {singleFeedback.strengths?.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800"
            >
              Previous
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleEvaluateCurrent}
                disabled={evaluating || !currentAnswer.trim()}
                className="rounded-xl bg-gradient-to-r from-brand-violet to-brand-blue px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {evaluating ? 'Evaluating...' : 'Evaluate'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentIndex < totalQuestions - 1) {
                    setCurrentIndex((prev) => prev + 1);
                    setSingleFeedback(null);
                  } else {
                    handleSubmit();
                  }
                }}
                className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white"
              >
                {currentIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Interview'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
