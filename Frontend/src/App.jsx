import React, { useState } from 'react';
import { AuthProvider } from './context/authcontext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuthModal from './components/layout/auth/AuthModal';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import InterviewSetupPage from './pages/InterviewSetupPage';
import LiveInterviewPage from './pages/LiveInterviewPage';
import InterviewReportPage from './pages/InterviewReportPage';
import PerformanceAnalyticsPage from './pages/PerformanceAnalyticsPage';

function MainApp() {
  const [activePage, setActivePage] = useState('landing');
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleStartSession = (session) => {
    setCurrentSession(session);
  };

  const handleFinishInterview = (reportPayload) => {
    setReportData(reportPayload);
  };

  const handleViewHistoricalReport = (payload) => {
    setReportData(payload);
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 font-sans selection:bg-brand-purple/30 selection:text-white">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenAuth={handleOpenAuth}
      />

      <main className="flex-1">
        {activePage === 'landing' && (
          <LandingPage
            setActivePage={setActivePage}
            onOpenAuth={handleOpenAuth}
            onSelectRole={setSelectedRole}
          />
        )}

        {activePage === 'dashboard' && (
          <DashboardPage
            setActivePage={setActivePage}
            onViewReport={handleViewHistoricalReport}
            onSelectRole={setSelectedRole}
          />
        )}

        {activePage === 'roles' && (
          <RoleSelectionPage
            onSelectRole={setSelectedRole}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'setup' && (
          <InterviewSetupPage
            selectedRole={selectedRole}
            selectedCompany={null}
            onStartSession={handleStartSession}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'interview' && (
          <LiveInterviewPage
            session={currentSession}
            onFinishInterview={handleFinishInterview}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'report' && (
          <InterviewReportPage
            reportData={reportData}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'analytics' && (
          <PerformanceAnalyticsPage setActivePage={setActivePage} />
        )}
      </main>

      <Footer setActivePage={setActivePage} />

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          if (activePage === 'landing') {
            setActivePage('dashboard');
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
