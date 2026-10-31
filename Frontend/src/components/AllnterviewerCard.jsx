import React, { useState } from 'react';
import { Settings2 } from 'lucide-react';

export const PERSONAS = [
  {
    id: 'sophia',
    name: 'Sophia Chen',
    title: 'Senior FAANG Tech Lead',
    avatar: 'SC',
    color: 'from-purple-500 to-indigo-600',
    tone: 'Analytical & Rigorous',
    bio: 'Former Staff Engineer at Google. Probes for system edge cases and algorithmic depth.',
  },
  {
    id: 'marcus',
    name: 'Marcus Vance',
    title: 'Principal Systems Architect',
    avatar: 'MV',
    color: 'from-cyan-500 to-blue-600',
    tone: 'Architectural & Pragmatic',
    bio: 'Distributed systems veteran. Focuses on scalability, database bottlenecks, and production trade-offs.',
  },
  {
    id: 'elena',
    name: 'Elena Rostova',
    title: 'VP of Talent & HR Lead',
    avatar: 'ER',
    color: 'from-rose-500 to-amber-600',
    tone: 'Empathetic & Structured',
    bio: 'Leadership and culture specialist evaluating STAR behavioral alignment and team collaboration.',
  },
];

export default function AIInterviewerCard({
  isSpeaking,
  isListening,
  isEvaluating,
  activePersona,
  onSelectPersona,
}) {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const current = activePersona || PERSONAS[0];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-navy-900/95 via-navy-850 to-slate-900 p-5 shadow-glass">
      {(isSpeaking || isListening || isEvaluating) && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-violet/15 via-brand-cyan/10 to-transparent animate-pulse" />
      )}

      <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center space-x-3.5">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr ${current.color} text-sm font-extrabold text-white shadow-md`}>
            {current.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold tracking-tight text-white">{current.name}</h4>
              <span className="rounded-full border border-slate-800 bg-slate-950 px-2 py-0.5 text-[10px] text-slate-300">
                {current.tone}
              </span>
            </div>
            <p className="text-xs text-slate-400">{current.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-1.5">
          <div className="flex h-6 items-end gap-1 px-1">
            {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50].map((height, index) => (
              <span
                key={index}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isSpeaking
                    ? 'bg-cyan-400'
                    : isListening
                      ? 'bg-rose-500'
                      : isEvaluating
                        ? 'bg-amber-400'
                        : 'bg-slate-700'
                }`}
                style={{
                  height: isSpeaking || isListening ? `${Math.max(15, (height * ((index % 3) + 1)) % 100)}%` : '20%',
                  animation:
                    isSpeaking || isListening
                      ? `pulse 0.${(index % 5) + 3}s ease-in-out infinite alternate`
                      : 'none',
                }}
              />
            ))}
          </div>
          <span className="min-w-[120px] text-xs font-mono font-medium text-slate-300">
            {isSpeaking
              ? 'Interviewer speaking...'
              : isListening
                ? 'Listening to answer...'
                : isEvaluating
                  ? 'Analyzing response...'
                  : 'Interviewer ready'}
          </span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPersonaMenu((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:text-white"
          >
            <Settings2 className="h-3.5 w-3.5 text-brand-purple" />
            Switch Persona
          </button>

          {showPersonaMenu && (
            <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-slate-800 bg-navy-950 p-2 shadow-2xl">
              <p className="border-b border-slate-800 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Choose AI Persona
              </p>
              <div className="mt-2 space-y-1.5">
                {PERSONAS.map((persona) => {
                  const isSelected = persona.id === current.id;
                  return (
                    <button
                      key={persona.id}
                      type="button"
                      onClick={() => {
                        onSelectPersona(persona);
                        setShowPersonaMenu(false);
                      }}
                      className={`flex w-full items-start space-x-2.5 rounded-xl p-2 text-left transition ${
                        isSelected ? 'border border-brand-purple/40 bg-brand-purple/20 text-white' : 'text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr ${persona.color} text-xs font-bold text-white`}>
                        {persona.avatar}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{persona.name}</p>
                        <p className="text-[10px] text-brand-purple">{persona.tone}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">{persona.bio}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
