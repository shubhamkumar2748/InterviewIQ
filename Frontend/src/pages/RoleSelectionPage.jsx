import  React, { useState, useEffect } from 'react';
import {
  Search,
  Layout,
  Server,
  Layers,
  Code2,
  Terminal,
  Coffee,
  Cpu,
  BarChart3,
  Brain,
  Users,
  ArrowRight,
  Filter,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { fetchJobRoles } from '../services/api';
const ICON_MAP = {
  Layout,
  Server,
  Layers,
  Code2,
  Terminal,
  Coffee,
  Cpu,
  BarChart3,
  Brain,
  Users,
};
export default function RoleSelectionPage({ onSelectRole, setActivePage }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  useEffect(() => {
    async function loadRoles() {
      try {
        const data = await fetchJobRoles();
        setRoles(data);
      } catch (err) {
        console.error('Error loading job roles:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRoles();
  }, []);
  const categories = ['All', 'Engineering', 'Core Tech', 'Language Specialization', 'Data & Analytics', 'Data & AI', 'Behavioral'];
  const filteredRoles = roles.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.topics.some((t) => t.toLowerCase().includes(search.toLowerCase()));
     const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  return (
    <div className="min-h-screen bg-navy-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-xs text-brand-purple font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Targeted Interview Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Select Your Target Job Role
          </h1>
          <p className="text-base text-slate-400">
            Choose from 10 industry tracks. Each role features customized real-world evaluation rubrics calibrated by senior tech recruiters.
          </p>
        </div>
        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-navy-900/60 border border-slate-800 backdrop-blur-md">
          <label className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search roles, descriptions, or topics..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-purple"
            />
          </label>
          <label className="flex items-center gap-2 w-full md:w-auto text-sm text-slate-400">
            <Filter className="w-4 h-4" />
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full md:w-auto px-3 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-brand-purple"
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
        </div>
        {loading ? (
          <div className="text-center py-16 text-slate-400">Loading job roles...</div>
        ) : filteredRoles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRoles.map((role) => {
              const RoleIcon = ICON_MAP[role.icon] || Code2;
              return (
                <article key={role.id || role.name} className="group p-5 rounded-2xl bg-navy-900/60 border border-slate-800 hover:border-brand-purple/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-brand-purple/10 text-brand-purple">
                      <RoleIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-brand-purple font-semibold">{role.category}</p>
                      <h2 className="mt-1 text-lg font-bold text-white">{role.name}</h2>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-400">{role.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {role.topics.slice(0, 3).map((topic) => (
                      <span key={topic} className="px-2.5 py-1 rounded-full bg-slate-800/70 text-xs text-slate-300">{topic}</span>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800/60">
                    <button
                      onClick={() => {
                        onSelectRole(role);
                        setActivePage('setup');
                      }}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-900 group-hover:bg-gradient-to-r group-hover:from-brand-violet group-hover:to-brand-blue text-slate-200 group-hover:text-white text-xs font-semibold border border-slate-800 group-hover:border-transparent transition-all shadow-sm"
                    >
                      <span>Configure Mock Interview</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
        {filteredRoles.length === 0 && !loading && (
          <div className="text-center py-16 bg-navy-900/30 rounded-2xl border border-slate-800">
            <p className="text-base text-slate-400">No job roles match your search filters.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All'); }}
              className="mt-3 text-xs text-brand-purple hover:underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}  