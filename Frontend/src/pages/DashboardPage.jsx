import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Database, Layers, Sparkles, Trash2, Trophy } from 'lucide-react';
import { useAuth } from '../context/authcontext';
import { fetchDashboardStats, deleteInterview, seedDemoData, fetchInterviewSession } from '../services/api';

export default function DashboardPage({ setActivePage, onViewReport, onSelectRole }) {
  const { user } = useAuth();
  const userId = user?.uid || 'guest_user';
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchDashboardStats(userId);
      setStats(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleDelete = async (id) => {
    await deleteInterview(id);
    setMessage('Interview deleted successfully');
    setTimeout(() => setMessage(''), 2500);
    loadData();
  };

  const handleSeed = async () => {
    await seedDemoData(userId);
    setMessage('Sample analytics loaded successfully');
    setTimeout(() => setMessage(''), 2500);
    loadData();
  };

  const handleInspectReport = async (item) => {
    const session = await fetchInterviewSession(item.id);
    if (session?.evaluation_report) {
      onViewReport({
        job_role: session.job_role,
        experience_level: session.experience_level,
        interview_type: session.interview_type,
        report: session.evaluation_report,
      });
      setActivePage('report');
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950 text-slate-300">
        <div className="text-center">
          <Sparkles className="mx-auto mb-3 h-10 w-10 animate-spin text-brand-purple" />
          <p>Calculating your live interview analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-800 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 p-6 sm:p-8 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full border border-brand-purple/30 bg-brand-purple/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-purple">
                Verified Performance Dashboard
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
              Welcome, {user?.displayName || user?.email?.split('@')[0] || 'Candidate'}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Track your interview readiness, key scores, and recent sessions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSeed}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-amber-300"
            >
              <Database className="h-4 w-4" />
              Load Sample Analytics
            </button>
            <button
              type="button"
              onClick={() => setActivePage('setup')}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-violet to-brand-blue px-5 py-2.5 text-xs font-bold text-white"
            >
              Start New Interview
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {message && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            {message}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Interviews', value: stats.total_interviews, icon: Layers },
            { label: 'Average Score', value: `${stats.average_score}/100`, icon: Trophy },
            { label: 'Technical', value: `${stats.technical_score}/100`, icon: Sparkles },
            { label: 'Communication', value: `${stats.communication_score}/100`, icon: CheckCircle2 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-slate-800 bg-navy-900/80 p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{label}</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-brand-purple">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-2xl border border-slate-800 bg-navy-900/80 p-5">
            <h2 className="mb-4 text-lg font-bold text-white">Recent Interview History</h2>
            <div className="space-y-3">
              {stats.recent_history.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div>
                    <p className="font-medium text-white">{item.job_role}</p>
                    <p className="text-xs text-slate-400">{item.created_at}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-brand-purple/30 bg-brand-purple/15 px-2 py-1 text-xs text-brand-purple">
                      {item.score}/100
                    </span>
                    <button type="button" onClick={() => handleInspectReport(item)} className="rounded-lg bg-slate-800 px-2 py-1.5 text-xs text-slate-200">
                      View
                    </button>
                    <button type="button" onClick={() => handleDelete(item.id)} className="rounded-lg bg-slate-800 px-2 py-1.5 text-xs text-rose-300">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-navy-900/80 p-5">
            <h2 className="mb-4 text-lg font-bold text-white">Top Recommendations</h2>
            <ul className="space-y-3 text-sm text-slate-300">
              {stats.recommendations.map((item) => (
                <li key={item} className="flex gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
