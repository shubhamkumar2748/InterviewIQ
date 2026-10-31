import React, { useEffect, useState } from 'react';
import { ArrowRight, Award, BarChart3, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/authcontext';
import { fetchDashboardStats } from '../services/api';

export default function PerformanceAnalyticsPage({ setActivePage }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchDashboardStats(user?.uid || 'guest_user');
        setStats(data);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user]);

  if (loading || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950 text-slate-300">
        <Sparkles className="mr-3 h-5 w-5 animate-spin text-brand-purple" />
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-purple">Signal Dashboard</p>
              <h1 className="mt-2 text-3xl font-extrabold text-white">Performance Analytics</h1>
            </div>
            <button
              type="button"
              onClick={() => setActivePage('setup')}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-violet to-brand-blue px-4 py-2.5 text-sm font-semibold text-white"
            >
              Start another run
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Overall', value: `${stats.average_score}/100`, icon: Award },
            { label: 'Technical', value: `${stats.technical_score}/100`, icon: BarChart3 },
            { label: 'Communication', value: `${stats.communication_score}/100`, icon: ShieldCheck },
            { label: 'Sessions', value: stats.total_interviews, icon: CheckCircle2 },
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

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-navy-900/80 p-5">
            <h2 className="mb-4 text-lg font-bold text-white">Strongest Topics</h2>
            <ul className="space-y-3">
              {stats.strongest_topics.map((topic) => (
                <li key={topic} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-navy-900/80 p-5">
            <h2 className="mb-4 text-lg font-bold text-white">Weakest Topics</h2>
            <ul className="space-y-3">
              {stats.weakest_topics.map((topic) => (
                <li key={topic} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-amber-400" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
