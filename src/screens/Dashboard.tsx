// src/screens/Dashboard.tsx
import { useState, useMemo } from 'react';
import { TrendingUp, Star, ArrowRight, Filter, Search } from 'lucide-react';
import type { Candidate, Bucket } from '../types';

interface DashboardProps {
    candidates: Candidate[];
    onSelectCandidate: (id: string) => void;
    onUpdateCandidates: (candidates: Candidate[]) => void;
    onProceedToShortlist: () => void;
}

const BUCKET_CONFIG = {
    strong: {
        label: 'Strong Match',
        sublabel: 'Score ≥ 80',
        color: 'var(--strong-text)',
        bg: 'var(--strong-bg)',
        border: 'var(--strong-border)',
        badgeClass: 'badge-strong',
    },
    potential: {
        label: 'Potential Fit',
        sublabel: 'Score 50–79',
        color: 'var(--potential-text)',
        bg: 'var(--potential-bg)',
        border: 'var(--potential-border)',
        badgeClass: 'badge-potential',
    },
    low: {
        label: 'Low Match',
        sublabel: 'Score < 50',
        color: 'var(--low-text)',
        bg: 'var(--low-bg)',
        border: 'var(--low-border)',
        badgeClass: 'badge-low',
    },
};

import VirtualBucket from '../components/VirtualBucket';

export default function Dashboard({
    candidates,
    onSelectCandidate,
    onUpdateCandidates,
    onProceedToShortlist,
}: DashboardProps) {
    const [search, setSearch] = useState('');
    const [minScore, setMinScore] = useState(0);
    const [minExp, setMinExp] = useState(0);
    const [showOnlyViolations, setShowOnlyViolations] = useState(false);

    const toggleShortlist = (id: string) => {
        onUpdateCandidates(
            candidates.map(c => c.id === id ? { ...c, isShortlisted: !c.isShortlisted } : c)
        );
    };

    const filteredCandidates = useMemo(() => {
        return candidates.filter(c => {
            const matchesSearch = !search.trim() ||
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.currentRole.toLowerCase().includes(search.toLowerCase()) ||
                c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));

            const matchesScore = c.compositeScore >= minScore;
            const matchesExp = c.yearsOfExperience >= minExp;
            const matchesViolation = !showOnlyViolations || c.mustHaveViolations.length > 0;

            return matchesSearch && matchesScore && matchesExp && matchesViolation;
        });
    }, [candidates, search, minScore, minExp, showOnlyViolations]);

    const getBucketCandidates = (bucket: Bucket) =>
        filteredCandidates
            .filter(c => (c.overriddenBucket ?? c.bucket) === bucket)
            .sort((a, b) => b.compositeScore - a.compositeScore);

    const shortlistedCount = candidates.filter(c => c.isShortlisted).length;
    const strongCount = candidates.filter(c => (c.overriddenBucket ?? c.bucket) === 'strong').length;
    const avgScore = candidates.length ? Math.round(candidates.reduce((s, c) => s + c.compositeScore, 0) / candidates.length) : 0;

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', padding: '32px 32px 64px' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                    <div>
                        <h1 style={{ fontSize: 30, letterSpacing: '-0.03em', marginBottom: 6 }}>Recruiter Dashboard</h1>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                            {candidates.length} candidates screened · Enterprise Realism Mode Active
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        {shortlistedCount > 0 && (
                            <button
                                className="btn-primary"
                                onClick={onProceedToShortlist}
                                style={{ fontSize: 14, padding: '12px 22px' }}
                                id="proceed-shortlist-btn"
                            >
                                <Star size={15} fill="white" />
                                Review Shortlist ({shortlistedCount})
                                <ArrowRight size={15} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters & Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 24, marginBottom: 32 }}>
                    {/* Filter Panel */}
                    <div className="card" style={{ padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <Filter size={14} color="var(--accent-purple)" />
                            <span style={{ fontSize: 13, fontWeight: 700 }}>Filter Results</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>MIN SCORE: {minScore}%</label>
                                <input
                                    type="range" min="0" max="100" value={minScore}
                                    onChange={e => setMinScore(Number(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>MIN EXPERIENCE: {minExp}y</label>
                                <input
                                    type="range" min="0" max="15" value={minExp}
                                    onChange={e => setMinExp(Number(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <input
                                    type="checkbox" checked={showOnlyViolations}
                                    onChange={e => setShowOnlyViolations(e.target.checked)}
                                    id="violation-toggle"
                                />
                                <label htmlFor="violation-toggle" style={{ fontSize: 12, color: 'var(--text-primary)' }}>Only show must-have violations</label>
                            </div>
                            <button
                                className="btn-ghost"
                                style={{ fontSize: 11, marginTop: 4 }}
                                onClick={() => { setMinScore(0); setMinExp(0); setShowOnlyViolations(false); setSearch(''); }}
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>

                    {/* Stats & Search */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                            {[
                                { label: 'Total Scanned', value: candidates.length, color: 'var(--accent-blue)' },
                                { label: 'Strong Fit', value: strongCount, color: 'var(--accent-green)' },
                                { label: 'Avg Base Score', value: `${avgScore}%`, color: 'var(--accent-purple)' },
                                { label: 'Matching Search', value: filteredCandidates.length, color: 'var(--accent-amber)' },
                            ].map(stat => (
                                <div key={stat.label} className="card" style={{ padding: '16px 20px' }}>
                                    <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: stat.color }}>{stat.value}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textTransform: 'uppercase' }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                className="input-field"
                                style={{ paddingLeft: 44, height: 48, fontSize: 14 }}
                                placeholder="Search candidates, skills, company..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                id="dashboard-search"
                            />
                        </div>
                    </div>
                </div>

                {/* 3-Column Bucket Layout with Virtualization */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'start' }}>
                    {(['strong', 'potential', 'low'] as Bucket[]).map(bucket => {
                        const cfg = BUCKET_CONFIG[bucket];
                        const bucketCands = getBucketCandidates(bucket);

                        return (
                            <div key={bucket} style={{ display: 'flex', flexDirection: 'column', height: '1000px' }}>
                                {/* Column Header */}
                                <div style={{
                                    padding: '16px',
                                    borderRadius: '16px 16px 0 0',
                                    background: cfg.bg,
                                    border: `1px solid ${cfg.border}`,
                                    borderBottom: 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontSize: 15, fontWeight: 800, color: cfg.color }}>{cfg.label}</span>
                                            <span style={{
                                                padding: '2px 10px', borderRadius: 100,
                                                background: cfg.border,
                                                fontSize: 12, fontWeight: 800, color: cfg.color,
                                            }}>{bucketCands.length}</span>
                                        </div>
                                    </div>
                                    {bucket === 'strong' && <TrendingUp size={16} color={cfg.color} opacity={0.5} />}
                                </div>

                                {/* Virtualized List Body */}
                                <div style={{
                                    flex: 1,
                                    border: `1px solid ${cfg.border}`,
                                    borderTop: 'none',
                                    borderRadius: '0 0 16px 16px',
                                    background: 'var(--bg-card)',
                                    overflow: 'hidden',
                                    padding: '12px 6px 12px 12px'
                                }}>
                                    {bucketCands.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--text-muted)', fontSize: 14 }}>
                                            No candidates found matching filters
                                        </div>
                                    ) : (
                                        <VirtualBucket
                                            candidates={bucketCands}
                                            onSelectCandidate={onSelectCandidate}
                                            onToggleShortlist={toggleShortlist}
                                            height={900}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

