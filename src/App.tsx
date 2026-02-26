// src/App.tsx
import { useState } from 'react';
import './index.css';
import type { AppScreen, Candidate, JobDescription } from './types';
import { jdLibrary, generateMockCandidates, mockCandidates } from './mockData';
import TopNav from './components/TopNav';
import Breadcrumbs from './components/Breadcrumbs';
import JDList from './screens/JDList';
import JDSetup from './screens/JDSetup';
import CVUpload from './screens/CVUpload';
import Processing from './screens/Processing';
import Dashboard from './screens/Dashboard';
import CandidateDetail from './screens/CandidateDetail';
import Shortlist from './screens/Shortlist';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('jd-list');
  const [jd, setJd] = useState<JobDescription | null>(null);
  const [uploadedFileCount, setUploadedFileCount] = useState(0);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  const handleJDSelect = (selectedJd: JobDescription) => {
    setJd(selectedJd);
    setScreen('cv-upload');
  };

  const handleJDNext = (newJd: JobDescription) => {
    setJd(newJd);
    setScreen('cv-upload');
  };

  const handleCVUploadNext = (files: File[]) => {
    setUploadedFileCount(files.length);
    // If it's a bulk/demo upload, generate many candidates
    if (files.length > 50) {
      setCandidates(generateMockCandidates(files.length, jd || mockCandidates[0] as unknown as JobDescription));
    } else {
      setCandidates(mockCandidates);
    }
    setScreen('processing');
  };

  const handleProcessingComplete = () => {
    setScreen('dashboard');
  };

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

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  return (
    <div style={{ minHeight: '100vh' }}>
      <TopNav currentScreen={screen} />
      <Breadcrumbs currentScreen={screen} onNavigate={setScreen} />

      {screen === 'jd-list' && (
        <JDList
          jds={jdLibrary}
          onSelect={handleJDSelect}
          onCreateNew={() => setScreen('jd-setup')}
        />
      )}

      {screen === 'jd-setup' && (
        <JDSetup onNext={handleJDNext} initialJd={jd || undefined} />
      )}

      {screen === 'cv-upload' && (
        <CVUpload
          onNext={handleCVUploadNext}
          onBack={() => setScreen(jd?.id ? 'jd-list' : 'jd-setup')}
        />
      )}

      {screen === 'processing' && (
        <Processing
          fileCount={uploadedFileCount}
          onComplete={handleProcessingComplete}
        />
      )}

      {screen === 'dashboard' && (
        <Dashboard
          candidates={candidates}
          onSelectCandidate={handleSelectCandidate}
          onUpdateCandidates={setCandidates}
          onProceedToShortlist={() => setScreen('shortlist')}
        />
      )}

      {screen === 'candidate-detail' && selectedCandidate && (
        <CandidateDetail
          candidate={selectedCandidate}
          onBack={() => setScreen('dashboard')}
          onUpdate={updated => {
            handleUpdateCandidate(updated);
          }}
        />
      )}

      {screen === 'shortlist' && (
        <Shortlist
          candidates={candidates}
          onBack={() => setScreen('dashboard')}
          onRemove={handleRemoveFromShortlist}
        />
      )}
    </div>
  );
}
