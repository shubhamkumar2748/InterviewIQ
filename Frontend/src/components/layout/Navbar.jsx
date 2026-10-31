import React, { useState } from 'react';
import {
  Sparkles,
  Menu,
  X,
  LogOut,
  Home,
  BarChart3,
  Briefcase,
  Settings,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/authcontext';

const navItems = [
  { key: 'landing', label: 'Home', icon: Home },
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { key: 'roles', label: 'Roles', icon: Briefcase },
  { key: 'setup', label: 'Interview', icon: Sparkles },
];

function SettingsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-navy-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">AI Settings</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-3 text-sm text-slate-300">
          <p>Voice mode: Balanced</p>
          <p>Interview intensity: Medium</p>
          <p>Evaluation speed: Real-time</p>
        </div>
      </div>
    </div>
  );
}

export default function Navbar({ activePage, setActivePage, onOpenAuth }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleNavClick = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800 bg-navy-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => handleNavClick('landing')}
          className="flex items-center space-x-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-violet to-brand-blue shadow-glow-purple">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-lg font-extrabold tracking-tight text-white">
              Interview<span className="text-brand-purple">IQ</span>
            </p>
          </div>
        </button>

        <div className="hidden items-center gap-2 md:flex">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleNavClick(key)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                activePage === key
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300 hover:text-white"
          >
            <Settings className="h-4 w-4 text-brand-purple" />
            Settings
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">
                <User className="h-4 w-4 text-brand-purple" />
                <span className="text-sm text-slate-200">
                  {user.displayName || user.email?.split('@')[0] || 'Candidate'}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-500/15 px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/20"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('signup')}
                className="rounded-xl bg-gradient-to-r from-brand-violet to-brand-blue px-4 py-2 text-sm font-medium text-white shadow-glow-purple"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          className="rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-200 md:hidden"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-800 bg-navy-950 md:hidden">
          <div className="mx-auto max-w-7xl space-y-3 px-4 py-4">
            {navItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleNavClick(key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm ${
                  activePage === key ? 'bg-slate-800 text-white' : 'text-slate-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}

            {user ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-500/20 px-4 py-2.5 text-sm font-medium text-rose-300"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-200"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenAuth('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-xl bg-gradient-to-r from-brand-violet to-brand-blue px-4 py-2.5 text-sm font-medium text-white"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </nav>
  );
}
