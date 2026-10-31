import React, { useState, useEffect } from 'react';
import { Sparkles, Sliders, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/authcontext';
import { setupInterview, fetchJobRoles, fetchCompanyTracks } from '../services/api';

export default function InterviewSetupPage({ selectedRole, selectedCompany, onStartSession, setActivePage }) {
  const { user } = useAuth();
  const [allRoles, setAllRoles] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [currentRoleName, setCurrentRoleName] = useState(selectedRole?.name || 'Frontend Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [interviewType, setInterviewType] = useState('Technical');
  const [numQuestions, setNumQuestions] = useState(5);
  const [selectedTopics, setSelectedTopics] = useState(['React', 'JavaScript']);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [roles, companies] = await Promise.all([fetchJobRoles(), fetchCompanyTracks()]);
        setAllRoles(roles);
        setAllCompanies(companies);

        if (roles.length && !selectedRole) {
          setCurrentRoleName(roles[0].name);
          setSelectedTopics(roles[0].topics.slice(0, 2));
        }
      } catch (err) {
        console.error('Failed to load configuration', err);
      }
    }

    fetchData();
  }, [selectedRole]);

  useEffect(() => {
    const match = allRoles.find((role) => role.name === currentRoleName);
    if (match) {
      setSelectedTopics(match.topics.slice(0, 2));
    }
  }, [currentRoleName, allRoles]);

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((item) => item !== topic) : [...prev, topic]
    );
  };

  const handleStart = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await setupInterview({
        user_id: user?.uid || 'guest_user',
        job_role: currentRoleName,
        experience_level: experienceLevel,
        interview_type: interviewType,
        topics: selectedTopics,
        num_questions: Number(numQuestions),
      });

      if (response?.session) {
        onStartSession(response.session);
        setActivePage('interview');
      } else {
        throw new Error('Interview initialization failed.');
      }
    } catch (err) {
      setError(err.message || 'Unable to start your session.');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-purple/30 bg-brand-purple/10 px-3 py-1 text-xs font-medium text-brand-purple">
            <Sliders className="h-3.5 w-3.5" />
            AI Simulation Calibration
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Configure Your Mock Interview
          </h1>
          <p className="text-sm text-slate-400">
            Tailor the role, difficulty, and focus areas before launching the engine.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleStart} className="space-y-8 rounded-2xl border border-slate-800 bg-navy-900/80 p-6 sm:p-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <Building2 className="h-4 w-4 text-cyan-400" />
                Target Company Bar (Optional)
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(allCompanies.length ? allCompanies : [{ id: 'general', name: 'Standard', tagline: 'Industry standard' }]).map((company) => (
                <button
                  key={company.id}
                  type="button"
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-left text-xs text-slate-300 transition hover:border-slate-700"
                >
                  <p className="font-bold text-white">{company.name}</p>
                  <p className="mt-1 text-[9px] text-slate-400">{company.tagline}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-200">1. Job Role Track</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(allRoles.length ? allRoles : [{ id: 'demo', name: 'Frontend Engineer', topics: ['React', 'JavaScript', 'Testing'] }]).map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setCurrentRoleName(role.name)}
                  className={`rounded-xl border p-3 text-left text-xs transition ${
                    currentRoleName === role.name
                      ? 'border-brand-purple bg-brand-purple/20 text-white'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300'
                  }`}
                >
                  {role.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Experience</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-sm text-white focus:border-brand-purple focus:outline-none"
              >
                <option>Freshman</option>
                <option>Intermediate</option>
                <option>Senior</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Interview Type</label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-sm text-white focus:border-brand-purple focus:outline-none"
              >
                <option>Technical</option>
                <option>Behavioral</option>
                <option>Resume-based</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Questions</label>
              <input
                type="number"
                min={3}
                max={8}
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-sm text-white focus:border-brand-purple focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-200">Topics to Probe</label>
              <span className="text-xs text-slate-400">{selectedTopics.length} selected</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {((allRoles.find((role) => role.name === currentRoleName)?.topics) || ['React', 'JavaScript']).map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    selectedTopics.includes(topic)
                      ? 'border-brand-purple bg-brand-purple/20 text-brand-purple'
                      : 'border-slate-700 bg-slate-900 text-slate-300'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-violet to-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-glow-purple"
            >
              <Sparkles className="h-4 w-4" />
              Launch Interview
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
