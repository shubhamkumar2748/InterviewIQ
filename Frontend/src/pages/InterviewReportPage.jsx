import React, { useMemo, useState } from 'react';
import { Award, CheckCircle2, Copy, Download, Printer, RefreshCw, Sparkles, Trophy } from 'lucide-react';

export default function InterviewReportPage({ reportData, setActivePage }) {
  const [copied, setCopied] = useState(false);
  const report = useMemo(() => {
    return reportData?.report || {
      overall_score: 88,
      technical_score: 89,
      communication_score: 84,
      strengths: ['Structured thinking', 'Strong engineering examples'],
      weaknesses: ['Could expand on trade-offs'],
      recommendations: ['Practice more system design details']
    };
  }, [reportData]);

  const copyMarkdown = async () => {
    const markdown = `# Interview Report\n\nOverall Score: ${report.overall_score}\nTechnical: ${report.technical_score}\nCommunication: ${report.communication_score}\n\nStrengths:\n- ${report.strengths.join('\n- ')}\n\nWeaknesses:\n- ${report.weaknesses.join('\n- ')}\n\nRecommendations:\n- ${report.recommendations.join('\n- ')}`;
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-navy-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-purple">Interview Summary</p>
              <h1 className="mt-2 text-3xl font-extrabold text-white">Performance Report</h1>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={copyMarkdown} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200">
                <Copy className="h-4 w-4" />
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button type="button" onClick={() => setActivePage('dashboard')} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-violet to-brand-blue px-4 py-2 text-sm font-semibold text-white">
                <Download className="h-4 w-4" />
                Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { label: 'Overall Score', value: `${report.overall_score}/100`, icon: Trophy },
            { label: 'Technical', value: `${report.technical_score}/100`, icon: Award },
            { label: 'Communication', value: `${report.communication_score}/100`, icon: Sparkles },
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
            <div className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Strengths
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              {report.strengths.map((item) => (
                <li key={item} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-navy-900/80 p-5">
            <div className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <RefreshCw className="h-5 w-5 text-amber-400" />
              Improvement Focus
            </div>
            <ul className="space-y-3 text-sm text-slate-300">
              {report.weaknesses.map((item) => (
                <li key={item} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-navy-900/80 p-5">
          <div className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
            <Printer className="h-5 w-5 text-brand-purple" />
            Recommendations
          </div>
          <ul className="space-y-3 text-sm text-slate-300">
            {report.recommendations.map((item) => (
              <li key={item} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
