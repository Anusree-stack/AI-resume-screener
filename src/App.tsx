// src/App.tsx
import { useState } from 'react';
import './index.css';
import type { AppScreen, Candidate, JobDescription, Bucket } from './types';
import { jdLibrary, generateMockCandidates, mockCandidates } from './mockData';
import TopNav from './components/TopNav';
import Home from './screens/Home';
import JDSetup from './screens/JDSetup';
import CVUpload from './screens/CVUpload';
import Processing from './screens/Processing';
import Dashboard from './screens/Dashboard';
import CandidateDetail from './screens/CandidateDetail';
import Shortlist from './screens/Shortlist';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [jd, setJd] = useState<JobDescription | null>(null);
  const [uploadedFileCount, setUploadedFileCount] = useState(0);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  // Dashboard Filters Persistence
  const [dashboardSearch, setDashboardSearch] = useState('');
  const [dashboardBucketFilter, setDashboardBucketFilter] = useState<Bucket | ''>('');
  const [dashboardMinScore, setDashboardMinScore] = useState(0);
  const [dashboardMinExp, setDashboardMinExp] = useState(0);
  const [dashboardSeniority, setDashboardSeniority] = useState('');
  const [dashboardDomain, setDashboardDomain] = useState('');
  const [dashboardEdu, setDashboardEdu] = useState('');
  const [dashboardReferralOnly, setDashboardReferralOnly] = useState(false);
  const [dashboardView, setDashboardView] = useState<'list' | 'bucket'>('list');

  const handleJDSave = (savedJd: JobDescription, action: 'draft' | 'publish' | 'upload') => {
    setJd(savedJd);
    if (action === 'upload') {
      setScreen('cv-upload');
    } else {
      setScreen('home');
    }
  };

  const handleCVUploadNext = (files: File[]) => {
    setUploadedFileCount(files.length);
    // Use currently active JD or fallback to first one in library
    const activeJd = jd || jdLibrary[0];
    setCandidates(generateMockCandidates(files.length, activeJd));
    setScreen('processing');
  };

  const handleProcessingComplete = () => setScreen('dashboard');

  const handleSelectCandidate = (id: string) => {
    setSelectedCandidateId(id);
    setScreen('candidate-detail');
  };

  const handleUpdateCandidate = (updated: Candidate) => {
    setCandidates(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleRemoveFromShortlist = (id: string) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, isShortlisted: false } : c));
  };

  const handleHomeNavigate = (dest: AppScreen, jdItem?: JobDescription) => {
    if (jdItem) setJd(jdItem);
    setScreen(dest);
  };

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <TopNav
        currentScreen={screen}
        onHome={() => setScreen('home')}
        onCreateJD={() => { setJd(null); setScreen('jd-setup'); }}
      />

      {screen === 'home' && (
        <Home jds={jdLibrary} onNavigate={handleHomeNavigate} />
      )}

      {screen === 'jd-setup' && (
        <JDSetup onSave={handleJDSave} initialJd={jd || undefined} />
      )}

      {screen === 'cv-upload' && (
        <CVUpload
          onNext={handleCVUploadNext}
          onBack={() => setScreen('jd-setup')}
        />
      )}

      {screen === 'processing' && (
        <Processing fileCount={uploadedFileCount} onComplete={handleProcessingComplete} />
      )}

      {screen === 'dashboard' && (
        <Dashboard
          candidates={candidates}
          onSelectCandidate={handleSelectCandidate}
          onUpdateCandidates={setCandidates}
          onProceedToShortlist={() => setScreen('shortlist')}
          onBack={() => setScreen('home')}
          roleName={jd?.title}
          search={dashboardSearch} setSearch={setDashboardSearch}
          bucketFilter={dashboardBucketFilter} setBucketFilter={setDashboardBucketFilter}
          minScore={dashboardMinScore} setMinScore={setDashboardMinScore}
          minExp={dashboardMinExp} setMinExp={setDashboardMinExp}
          seniority={dashboardSeniority} setSeniority={setDashboardSeniority}
          domain={dashboardDomain} setDomain={setDashboardDomain}
          edu={dashboardEdu} setEdu={setDashboardEdu}
          referralOnly={dashboardReferralOnly} setReferralOnly={setDashboardReferralOnly}
          view={dashboardView} setView={setDashboardView}
        />
      )}

      {screen === 'candidate-detail' && selectedCandidate && (
        <CandidateDetail
          candidate={selectedCandidate}
          onBack={() => setScreen('dashboard')}
          onUpdate={handleUpdateCandidate}
        />
      )}

      {screen === 'shortlist' && (
        <Shortlist
          candidates={candidates}
          onBack={() => setScreen('dashboard')}
          onRemove={handleRemoveFromShortlist}
          roleName={jd?.title}
        />
      )}
    </div>
  );
}
