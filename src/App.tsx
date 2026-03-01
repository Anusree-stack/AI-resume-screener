// src/App.tsx
import { useState, useMemo, useEffect } from 'react';
import './index.css';
import type { AppScreen, Candidate, JobDescription, Bucket } from './types';
import { jdLibraryBase } from './mockData';
import { buildCandidateStore, generateCandidatesForJD } from './candidateStore';
import TopNav from './components/TopNav';
import Home from './screens/Home';
import JDSetup from './screens/JDSetup';
import CVUpload from './screens/CVUpload';
import Processing from './screens/Processing';
import Dashboard from './screens/Dashboard';
import CandidateDetail from './screens/CandidateDetail';
import Shortlist from './screens/Shortlist';
import OverrideAudit from './screens/OverrideAudit';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [uploadedFileCount, setUploadedFileCount] = useState(0);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  // JD list — seeded from localStorage, persisted on every change (Bug 4)
  const [jds, setJds] = useState<JobDescription[]>(() => {
    try {
      const saved = localStorage.getItem('talentiq_jds');
      return saved ? JSON.parse(saved) : jdLibraryBase;
    } catch { return jdLibraryBase; }
  });
  const [activeJd, setActiveJd] = useState<JobDescription | null>(null);

  // Persist JD list to localStorage on every change
  useEffect(() => {
    localStorage.setItem('talentiq_jds', JSON.stringify(jds));
  }, [jds]);

  // Pre-build the candidate store once from the base JDs
  // When new JDs are published they won't have pre-built pools — we generate on demand via Processing
  const [candidateStore] = useState(() => buildCandidateStore(jdLibraryBase));

  // Compute strongCount per JD dynamically from the store, then attach it
  const jdsWithCounts = useMemo<JobDescription[]>(() => {
    return jds.map(jd => {
      const pool = candidateStore[jd.id] ?? [];
      const strong = pool.filter(c => (c.overriddenBucket ?? c.bucket) === 'strong').length;
      return {
        ...jd,
        applicationCount: pool.length > 0 ? pool.length : jd.applicationCount,
        strongCount: pool.length > 0 ? strong : jd.strongCount,
      };
    });
  }, [jds, candidateStore]);

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
    // If this JD already exists, update it; otherwise append (new role)
    setJds(prev => {
      const exists = prev.find(j => j.id === savedJd.id);
      if (exists) {
        return prev.map(j => j.id === savedJd.id ? savedJd : j);
      }
      // New JD — append with applicationCount 0
      return [...prev, { ...savedJd, applicationCount: 0, strongCount: 0, shortlistedCount: 0 }];
    });
    setActiveJd(savedJd);
    if (action === 'upload') {
      setScreen('cv-upload');
    } else {
      setScreen('home');
    }
  };

  const handleCVUploadNext = (files: File[]) => {
    setUploadedFileCount(files.length);
    const jdForUpload = activeJd ?? jdLibraryBase[0];
    const generated = generateCandidatesForJD(
      { ...jdForUpload, applicationCount: files.length },
      'fullstack'
    );
    setCandidates(generated);
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

  // Reset filters when switching roles to avoid stale state
  const resetFilters = () => {
    setDashboardSearch('');
    setDashboardBucketFilter('');
    setDashboardMinScore(0);
    setDashboardMinExp(0);
    setDashboardSeniority('');
    setDashboardDomain('');
    setDashboardEdu('');
    setDashboardReferralOnly(false);
    setDashboardView('list');
  };

  const handleHomeNavigate = (dest: AppScreen, jdItem?: JobDescription) => {
    if (jdItem) {
      setActiveJd(jdItem);
      // Load the pre-built pool for this role from the store
      const pool = candidateStore[jdItem.id];
      if (pool && pool.length > 0) {
        resetFilters();
        setCandidates(pool);
      }
    } else if (dest === 'jd-setup') {
      // Only reset activeJd when creating a brand new JD (no jdItem passed)
      setActiveJd(null);
    }
    setScreen(dest);
  };

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <TopNav
        currentScreen={screen}
        onHome={() => setScreen('home')}
        onCreateJD={() => { setActiveJd(null); setScreen('jd-setup'); }}
      />

      {screen === 'home' && (
        <Home jds={jdsWithCounts} onNavigate={handleHomeNavigate} />
      )}

      {screen === 'jd-setup' && (
        <JDSetup onSave={handleJDSave} initialJd={activeJd || undefined} />
      )}

      {screen === 'cv-upload' && (
        <CVUpload
          onNext={handleCVUploadNext}
          onBack={() => setScreen('jd-setup')}
          activeJd={activeJd}
        />
      )}

      {screen === 'processing' && (
        <Processing fileCount={uploadedFileCount} onComplete={handleProcessingComplete} />
      )}

      {screen === 'dashboard' && (
        <Dashboard
          candidates={candidates}
          jd={activeJd}
          onSelectCandidate={handleSelectCandidate}
          onUpdateCandidates={setCandidates}
          onProceedToShortlist={() => setScreen('shortlist')}
          onViewOverrides={() => setScreen('override-audit')}
          onBack={() => setScreen('home')}
          roleName={activeJd?.title}
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
          onUpdateCandidates={setCandidates}
          roleName={activeJd?.title}
        />
      )}

      {screen === 'override-audit' && (
        <OverrideAudit
          candidates={candidates}
          roleName={activeJd?.title}
          onBack={() => setScreen('dashboard')}
        />
      )}
    </div>
  );
}
