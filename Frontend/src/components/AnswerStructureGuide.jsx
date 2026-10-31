import React from 'react';
import { CheckCircle2, Circle, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
export default function AnswerStructureGuide({ text = '', interviewType = 'Technical' }) {
  const lower = text.toLowerCase();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const isBehavioral = interviewType === 'HR' || interviewType === 'HR / Behavioral';
  // Rubrics for Behavioral (STAR)
  const starChecklist = [
    {
      label: 'S - Situation',
      desc: 'Set the scene, context, and environment',
      matched: /situation|context|at my|when i was|project|company|team|client/i.test(lower)
    },
    {
      label: 'T - Task',
      desc: 'Your explicit goal or challenge to solve',
      matched: /task|goal|responsibility|objective|challenge|assigned|needed to/i.test(lower)
    },
    {
              label: 'R - Result',
      desc: 'Measurable metric, outcome, or lessons learned',
      matched: /result|outcome|improved|reduced|increased|percent|%|saved|boosted|learned/i.test(lower)
    }
  ];
  // Rubrics for Technical & Coding
  const techChecklist = [
    {
      label: 'Core Definition & Mechanics',
      desc: 'How it works internally under the hood',
      matched: wordCount >= 15 && /is a|works by|mechanism|internal|under the hood|algorithm|structure/i.test(lower)
    },
    {
      label: 'Time / Space Complexity & Trade-offs',
      desc: 'O(N), memory footprint, or engineering trade-offs',
      matched: /o\(|trade-off|time complexity|space|memory|latency|throughput|performance/i.test(lower)
    },
    {
      label: 'Production Scale & Caching',
      desc: 'Handling concurrent traffic, index, or state',
       matched: /scale|concurrent|cache|database|lock|distributed|race condition|async|load/i.test(lower)
    },
    {
      label: 'Edge Cases & Failure Modes',
      desc: 'Null states, boundaries, and network errors',
      matched: /edge case|null|boundary|failure|exception|fallback|timeout|bug/i.test(lower)
    }
  ];
  const activeChecklist = isBehavioral ? starChecklist : techChecklist;
  const matchedCount = activeChecklist.filter((c) => c.matched).length;
  const completionPct = Math.round((matchedCount / activeChecklist.length) * 100);
  return (
    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
          <span className="text-xs font-bold text-white">
            {isBehavioral ? 'STAR Method Assistant' : 'Technical Depth Meter'}
          </span>
        </div>
              <span className={`text-[11px] font-bold ${completionPct >= 75 ? 'text-brand-emerald' : completionPct >= 50 ? 'text-amber-400' : 'text-slate-400'}`}>
          {completionPct}% Structured ({matchedCount}/{activeChecklist.length})
        </span>
      </div>
      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            completionPct >= 75 ? 'bg-brand-emerald' : completionPct >= 50 ? 'bg-amber-400' : 'bg-brand-purple'
          }`}
          style={{ width: `${Math.max(5, completionPct)}%` }}
        />
      </div>
      {/* Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
        {activeChecklist.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2 p-2 rounded-lg text-xs transition-colors ${
              item.matched ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-200' : 'bg-slate-900/40 text-slate-400 border border-transparent'
            }`}
          >
                   {item.matched ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`font-semibold ${item.matched ? 'text-white' : 'text-slate-300'}`}>
                {item.label}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}