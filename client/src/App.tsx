import { useState } from 'react';
import './index.css';
import { Topbar } from './components/layout/Topbar';
import { NavBar } from './components/layout/NavBar';
import { ApplicantsPage } from './components/applicants/ApplicantsPage';
import { CallListPage } from './components/call-list/CallListPage';
import { ReengagementPage } from './components/reengagement/ReengagementPage';
import { PipelineBoardPage } from './components/pipeline/PipelineBoardPage';
import { CalendarPage } from './components/calendar/CalendarPage';

export type Page =
  | 'applicants'
  | 'call-list'
  | 'calendar'
  | 'pipeline'
  | 'reengagement'
  | 'home'
  | 'reports'
  | 'sms-email'
  | 'settings'
  | 'ai';

function PlaceholderPage({ label }: { label: string }) {
  return (
    <div style={{ maxWidth: 900, margin: '60px auto', padding: '0 16px', textAlign: 'center', color: '#94a3b8' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🚧</div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#475569', margin: '0 0 6px' }}>{label}</h2>
      <p style={{ fontSize: 13 }}>This section is coming soon.</p>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('applicants');

  const renderPage = () => {
    switch (currentPage) {
      case 'applicants':   return <ApplicantsPage />;
      case 'call-list':    return <CallListPage />;
      case 'calendar':     return <CalendarPage />;
      case 'pipeline':     return <PipelineBoardPage />;
      case 'reengagement': return <ReengagementPage />;
      default:             return <PlaceholderPage label={currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <Topbar />
      <NavBar currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;
