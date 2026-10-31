import React from 'react';
import { ArrowRight, Bot, Brain, CheckCircle2, ShieldCheck, Sparkles, Target, Trophy, Users } from 'lucide-react';
import { useAuth } from '../context/authcontext';

export default function LandingPage({ setActivePage, onOpenAuth, onSelectRole }) {
  const { user } = useAuth();

  const features = [
    { icon: Target, title: 'Targeted interview prep', description: 'Practice role-specific questions, coding rounds, and behavioral prompts.' },
    { icon: Brain, title: 'AI feedback loops', description: 'Get immediate explanations and actionable improvement points after sessions.' },
    { icon: ShieldCheck, title: 'Realistic interview flow', description: 'Simulate a polished and structured mock interview experience end-to-end.' },
  ];

  return (
    <div className="min-h-screen bg-navy-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="grid items-center gap-10 rounded-[2rem] border border-slate-800 bg-gradient-to-br from-navy-900 via-navy-850 to-slate-900 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-purple/30 bg-brand-purple/10 px-3 py-1 text-xs font-medium text-brand-purple">
              <Sparkles className="h-3.5 w-3.5" />
              Interview prep for ambitious engineers
            </div>
            <h1 className="max-w-xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Practice smarter interviews with AI that thinks like a hiring bar.
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-300">
              InterviewIQ creates realistic mock interviews, evaluates your answers, and helps you improve with measurable feedback.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => (user ? setActivePage('dashboard') : onOpenAuth('signup'))}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-violet to-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-glow-purple"
              >
                {user ? 'Open Dashboard' : 'Get Started'}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setActivePage('roles')}
                className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200"
              >
                Explore Roles
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-sm font-bold text-white">
                  AI
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Role-specific interviewer</p>
                  <p className="text-xs text-slate-400">Sophia Chen • Senior FAANG Lead</p>
                </div>
              </div>
              <Bot className="h-5 w-5 text-brand-purple" />
            </div>

            <div className="space-y-3">
              {['Live technical depth checks', 'Behavioral STAR evaluation', 'Actionable scorecards'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-slate-800 bg-navy-900/80 p-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{description}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-3">
          {[
            { label: 'Student prep', value: '4.9/5', icon: Users },
            { label: 'Interview clarity', value: '92%', icon: Target },
            { label: 'Improvement rate', value: '+31%', icon: Trophy },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-slate-800 bg-navy-900/80 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{label}</p>
                <Icon className="h-4 w-4 text-brand-purple" />
              </div>
              <p className="mt-4 text-3xl font-extrabold text-white">{value}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
