import React from 'react';
import { Sparkles, Heart, ExternalLink, Globe } from 'lucide-react';
export default function Footer({ setActivePage }) {
  return (
    <footer className="border-t border-slate-800/80 bg-navy-950/90 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-blue flex items-center justify-center shadow-glow-purple">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Interview<span className="text-brand-purple">IQ</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Prepare Smarter. Interview Better. An enterprise-grade AI mock interview platform built for college students, freshers, and engineers preparing for tier-1 tech interviews.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 text-xs rounded-md bg-slate-900 border border-slate-800 text-slate-300">FastAPI</span>
              <span className="px-2.5 py-1 text-xs rounded-md bg-slate-900 border border-slate-800 text-slate-300">Google Gemini 2.5</span>
              <span className="px-2.5 py-1 text-xs rounded-md bg-slate-900 border border-slate-800 text-slate-300">Firebase Firestore</span>
              <span className="px-2.5 py-1 text-xs rounded-md bg-slate-900 border border-slate-800 text-slate-300">React + Vite</span>
              <span className="px-2.5 py-1 text-xs rounded-md bg-slate-900 border border-slate-800 text-slate-300">Tailwind CSS</span>
              <span className="px-2.5 py-1 text-xs rounded-md bg-slate-900 border border-slate-800 text-slate-300">Recharts</span>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setActivePage('dashboard')} className="hover:text-white transition-colors">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('roles')} className="hover:text-white transition-colors">
                  Job Roles Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('setup')} className="hover:text-white transition-colors">
                  Start Mock Interview
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('analytics')} className="hover:text-white transition-colors">
                  Skill Analytics
                </button>
              </li>
            </ul>
          </div>
          {/* Supported Roles */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
              Popular Tracks
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Frontend & React Systems</li>
              <li>Backend & Distributed Systems</li>
              <li>Python & FastAPI / Django</li>
              <li>Data Science & Machine Learning</li>
              <li>HR / STAR Behavioral Rounds</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 InterviewIQ Platform. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span>Enterprise AI Security</span>
            <span>•</span>
            <span>Real-time Scoring</span>
            <span>•</span>
            <span>Tailored Feedback</span>
          </div>
        </div>
      </div>
    </footer>
  );
} 