// src/screens/Dashboard.tsx
import { useState, useMemo } from 'react';
import { Star, ArrowLeft, Search, X, LayoutList, Columns2, ArrowRight, CheckSquare, FileText, ArrowUpDown, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import type { Candidate, Bucket, JobDescription } from '../types';
import VirtualBucket from '../components/VirtualBucket';

interface DashboardProps {
    candidates: Candidate[];
    jd?: JobDescription | null;
    onSelectCandidate: (id: string) => void;
    onUpdateCandidates: (candidates: Candidate[]) => void;
    onProceedToShortlist: () => void;
    onViewOverrides: () => void;
    onBack: () => void;
    roleName?: string;

    // Filters Persistence
    search: string; setSearch: (v: string) => void;
    bucketFilter: Bucket | ''; setBucketFilter: (v: Bucket | '') => void;
    minScore: number; setMinScore: (v: number) => void;
    minExp: number; setMinExp: (v: number) => void;
    seniority: string; setSeniority: (v: string) => void;
    domain: string; setDomain: (v: string) => void;
    edu: string; setEdu: (v: string) => void;
    referralOnly: boolean; setReferralOnly: (v: boolean) => void;
    view: 'list' | 'bucket'; setView: (v: 'list' | 'bucket') => void;
}

const BUCKET_CONFIG = {
    strong: { label: 'Strong', sublabel: 'Score ≥ 80', color: 'var(--strong-text)', bg: 'var(--strong-bg)', border: 'var(--strong-border)', badgeClass: 'badge-strong' },
    potential: { label: 'Potential', sublabel: 'Score 50–79', color: 'var(--potential-text)', bg: 'var(--potential-bg)', border: 'var(--potential-border)', badgeClass: 'badge-potential' },
    low: { label: 'Limited Alignment', sublabel: 'Score < 50', color: 'var(--low-text)', bg: 'var(--low-bg)', border: 'var(--low-border)', badgeClass: 'badge-low' },
};

export default function Dashboard({
    candidates, jd, onSelectCandidate, onUpdateCandidates, onProceedToShortlist, onViewOverrides, onBack, roleName,
    search, setSearch, bucketFilter, setBucketFilter, minScore, setMinScore, minExp, setMinExp,
    seniority, setSeniority, domain, setDomain, edu, setEdu, referralOnly, setReferralOnly, view, setView
}: DashboardProps) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showShortlistModal, setShowShortlistModal] = useState(false);
    const [shortlistConfirmed, setShortlistConfirmed] = useState(false);
    const [isJDOpen, setIsJDOpen] = useState(false);
    const [sortBy, setSortBy] = useState<'rank' | 'score' | 'exp'>('rank');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const toggleShortlist = (id: string) => {
        onUpdateCandidates(candidates.map(c => c.id === id ? { ...c, isShortlisted: !c.isShortlisted } : c));
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredCandidates.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(filteredCandidates.map(c => c.id)));
    };

    const toggleSelectBucket = (bucket: Bucket) => {
        const inBucket = filteredCandidates.filter(c => (c.overriddenBucket ?? c.bucket) === bucket).map(c => c.id);
        const allSelected = inBucket.every(id => selectedIds.has(id));
        setSelectedIds(prev => {
            const next = new Set(prev);
            inBucket.forEach(id => allSelected ? next.delete(id) : next.add(id));
            return next;
        });
    };

    const confirmShortlist = () => {
        onUpdateCandidates(candidates.map(c => selectedIds.has(c.id) ? { ...c, isShortlisted: true } : c));
        setSelectedIds(new Set());
        setShowShortlistModal(false);
        setShortlistConfirmed(true);
        setTimeout(() => setShortlistConfirmed(false), 3500);
    };

    const BUCKET_TIER: Record<string, number> = { strong: 0, potential: 1, low: 2 };

    const candidatesWithGlobalRank = useMemo(() => {
        return [...candidates]
            .sort((a, b) => {
                const bktA = a.overriddenBucket ?? a.bucket;
                const bktB = b.overriddenBucket ?? b.bucket;
                const tierDiff = (BUCKET_TIER[bktA] ?? 3) - (BUCKET_TIER[bktB] ?? 3);
                if (tierDiff !== 0) return tierDiff;
                return b.compositeScore - a.compositeScore;
            })
            .map((c, i) => ({ ...c, globalRank: i + 1 }));
    }, [candidates]);

    const filteredCandidates = useMemo(() =>
        candidatesWithGlobalRank
            .filter(c => {
                const matchSearch = !search.trim() || c.name.toLowerCase().includes(search.toLowerCase()) || c.currentRole.toLowerCase().includes(search.toLowerCase()) || c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
                const matchScore = c.compositeScore >= minScore;
                const matchExp = c.yearsOfExperience >= minExp;
                const matchBucket = !bucketFilter || (c.overriddenBucket ?? c.bucket) === bucketFilter;
                const matchSeniority = !seniority || c.seniority === seniority;
                const matchDomain = !domain || c.domain === domain;
                const getEduLevel = (str: string) => {
                    if (str.startsWith('B')) return 'Bachelors';
                    if (str.startsWith('M') || str.startsWith('MBA')) return 'Masters';
                    if (str.startsWith('P')) return 'PhD';
                    return '';
                };
                const matchEdu = !edu || getEduLevel(c.education) === edu;
                const matchReferral = !referralOnly || c.isReferral;
                return matchSearch && matchScore && matchExp && matchBucket && matchSeniority && matchDomain && matchEdu && matchReferral;
            }),
        [candidatesWithGlobalRank, search, minScore, minExp, bucketFilter, seniority, domain, edu, referralOnly]
    );

    const getBucketCandidates = (bucket: Bucket) => filteredCandidates.filter(c => (c.overriddenBucket ?? c.bucket) === bucket);

    const shortlistedCount = candidates.filter(c => c.isShortlisted).length;
    const strongCount = candidates.filter(c => (c.overriddenBucket ?? c.bucket) === 'strong').length;
    const potentialCount = candidates.filter(c => (c.overriddenBucket ?? c.bucket) === 'potential').length;
    const pctStrong = candidates.length ? Math.round((strongCount / candidates.length) * 100) : 0;
    const pctPotential = candidates.length ? Math.round((potentialCount / candidates.length) * 100) : 0;
    const batchTAT = '< 30 sec';

    const selectStyle: React.CSSProperties = {
        padding: '6px 28px 6px 10px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        color: 'var(--text-primary)',
        fontSize: 12.5,
        fontFamily: 'Inter, sans-serif',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none' as const,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 8px center',
        minWidth: 100,
    };

    return (
        <>
            <div className="screen-fade" style={{ minHeight: 'calc(100vh - 60px)', padding: '28px 36px 80px', background: 'var(--bg-primary)' }}>
                <div style={{ maxWidth: 1380, margin: '0 auto' }}>

                    {/* Header */}
                    <div style={{
                        padding: '14px 20px', marginBottom: 24, borderRadius: 12,
                        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4, borderRadius: 6 }} title="Back to Overview">
                                <ArrowLeft size={16} />
                            </button>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)' }}>Screening Dashboard</div>
                                <h1 style={{ fontSize: 17, marginTop: 1, fontWeight: 800 }}>{jd?.title ?? roleName ?? 'Role Overview'}</h1>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button
                                className="btn-secondary"
                                onClick={() => setIsJDOpen(true)}
                                style={{ fontSize: 13, padding: '8px 16px', borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }}
                                id="view-jd-btn"
                            >
                                <FileText size={14} /> View JD Reference
                            </button>

                            {/* View Overrides button — only when overrides exist */}
                            {candidates.some(c => c.overriddenBucket !== undefined) && (
                                <button
                                    className="btn-secondary"
                                    onClick={onViewOverrides}
                                    style={{ fontSize: 13, padding: '8px 16px', borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' }}
                                    id="view-overrides-btn"
                                >
                                    <RotateCcw size={14} /> View Overrides ({candidates.filter(c => c.overriddenBucket !== undefined).length})
                                </button>
                            )}

                            {shortlistConfirmed && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--strong-text)', fontWeight: 600, padding: '6px 14px', background: 'var(--strong-bg)', border: '1px solid var(--strong-border)', borderRadius: 8 }}>
                                    ✓ Candidates shortlisted
                                </div>
                            )}
                            <button className="btn-primary" onClick={onProceedToShortlist} style={{ fontSize: 13, padding: '8px 18px', opacity: shortlistedCount === 0 ? 0.6 : 1 }} disabled={shortlistedCount === 0} id="proceed-shortlist-btn">
                                <Star size={13} />
                                Shortlist Review ({shortlistedCount}) <ArrowRight size={13} />
                            </button>
                        </div>
                    </div>

                    {/* Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
                        {[
                            { label: 'Total Applications', value: candidates.length, color: undefined },
                            { label: '% Strong Match', value: `${pctStrong}%`, color: 'var(--strong-text)' },
                            { label: '% Potential', value: `${pctPotential}%`, color: 'var(--potential-text)' },
                            { label: 'Batch Screening TAT', value: batchTAT, color: 'var(--accent-purple)' },
                        ].map(stat => (
                            <div key={stat.label} className="card metric-card" style={{ padding: '14px 18px' }}>
                                <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: stat.color || 'var(--text-primary)', letterSpacing: '-0.02em' }}>{stat.value}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Filter Bar */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'center', flexWrap: 'wrap', padding: '12px 20px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
                        <div style={{ position: 'relative', width: 200 }}>
                            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                className="input-field"
                                style={{ paddingLeft: 32, paddingTop: 6, paddingBottom: 6, fontSize: 12.5 }}
                                placeholder="Search name, skills..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                id="dashboard-search"
                            />
                        </div>

                        <select value={bucketFilter} onChange={e => setBucketFilter(e.target.value as Bucket | '')} style={selectStyle} id="bucket-filter">
                            <option value="">All Buckets</option>
                            <option value="strong">Strong Match</option>
                            <option value="potential">Potential</option>
                            <option value="low">Limited</option>
                        </select>

                        <select value={seniority} onChange={e => setSeniority(e.target.value)} style={selectStyle} id="seniority-filter">
                            <option value="">Seniority</option>
                            {['Entry', 'Mid', 'Senior', 'Lead', 'Director'].map(s => <option key={s}>{s}</option>)}
                        </select>

                        <select value={domain} onChange={e => setDomain(e.target.value)} style={selectStyle} id="domain-filter">
                            <option value="">Domain</option>
                            {['Fintech', 'SaaS', 'Healthcare', 'E-commerce', 'EdTech'].map(d => <option key={d}>{d}</option>)}
                        </select>

                        <select value={edu} onChange={e => setEdu(e.target.value)} style={selectStyle} id="edu-filter">
                            <option value="">Education</option>
                            {['Bachelors', 'Masters', 'PhD'].map(e => <option key={e}>{e}</option>)}
                        </select>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Exp ≥ {minExp}y</span>
                            <input type="range" min="0" max="15" value={minExp} onChange={e => setMinExp(Number(e.target.value))} style={{ width: 60, accentColor: 'var(--accent-purple)' }} />
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', marginLeft: 4 }}>
                            <input type="checkbox" checked={referralOnly} onChange={e => setReferralOnly(e.target.checked)} style={{ accentColor: 'var(--accent-purple)' }} />
                            Referral Only
                        </label>

                        {(search || bucketFilter || seniority || domain || edu || minExp > 0 || referralOnly) && (
                            <button className="btn-ghost" style={{ fontSize: 11.5, color: 'var(--accent-red)', height: 32 }}
                                onClick={() => { setSearch(''); setBucketFilter(''); setSeniority(''); setDomain(''); setEdu(''); setMinScore(0); setMinExp(0); setReferralOnly(false); }}>
                                <X size={12} /> Clear Filters
                            </button>
                        )}

                        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, background: 'var(--bg-secondary)', padding: 4, borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                            {([['list', LayoutList], ['bucket', Columns2]] as const).map(([v, Icon]) => (
                                <button
                                    key={v}
                                    onClick={() => setView(v)}
                                    style={{
                                        width: 32, height: 32, borderRadius: 7, border: 'none', cursor: 'pointer',
                                        background: view === v ? 'var(--bg-card)' : 'transparent',
                                        color: view === v ? 'var(--accent-purple)' : 'var(--text-muted)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 150ms ease',
                                        boxShadow: view === v ? 'var(--shadow-sm)' : 'none',
                                    }}
                                    id={`view-${v}-btn`}
                                >
                                    <Icon size={14} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* === RANKED LIST VIEW === */}
                    {view === 'list' && (
                        <div className="card" style={{ overflow: 'hidden' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '40px 70px 50px 1.5fr 1fr 100px 100px 100px',
                                alignItems: 'center', padding: '12px 24px',
                                background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)',
                            }}>
                                <div>
                                    <input type="checkbox"
                                        checked={selectedIds.size > 0 && selectedIds.size === filteredCandidates.length}
                                        onChange={toggleSelectAll}
                                        style={{ cursor: 'pointer', accentColor: 'var(--accent-purple)' }}
                                    />
                                </div>
                                {/* Sortable column headers */}
                                <div onClick={() => { if (sortBy === 'score') setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortBy('score'); setSortDir('desc'); } }} style={{ display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer', userSelect: 'none', fontSize: 10, fontWeight: 700, color: sortBy === 'score' ? 'var(--accent-purple)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    Score {sortBy === 'score' ? (sortDir === 'asc' ? <ArrowUp size={9} /> : <ArrowDown size={9} />) : <ArrowUpDown size={9} />}
                                </div>
                                <div onClick={() => { if (sortBy === 'rank') setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortBy('rank'); setSortDir('asc'); } }} style={{ display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer', userSelect: 'none', fontSize: 10, fontWeight: 700, color: sortBy === 'rank' ? 'var(--accent-purple)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    Rank {sortBy === 'rank' ? (sortDir === 'asc' ? <ArrowUp size={9} /> : <ArrowDown size={9} />) : <ArrowUpDown size={9} />}
                                </div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Candidate</div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bucket</div>
                                <div onClick={() => { if (sortBy === 'exp') setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortBy('exp'); setSortDir('desc'); } }} style={{ display: 'flex', alignItems: 'center', gap: 3, cursor: 'pointer', userSelect: 'none', fontSize: 10, fontWeight: 700, color: sortBy === 'exp' ? 'var(--accent-purple)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    Exp {sortBy === 'exp' ? (sortDir === 'asc' ? <ArrowUp size={9} /> : <ArrowDown size={9} />) : <ArrowUpDown size={9} />}
                                </div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Location</div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right' }}>Actions</div>
                            </div>
                            {filteredCandidates.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '72px', color: 'var(--text-muted)', fontSize: 14 }}>No candidates match current scope.</div>
                            ) : (
                                filteredCandidates
                                    .slice()
                                    .sort((a, b) => {
                                        let val = 0;
                                        if (sortBy === 'score') val = b.compositeScore - a.compositeScore;
                                        else if (sortBy === 'rank') val = (a.globalRank ?? 0) - (b.globalRank ?? 0);
                                        else if (sortBy === 'exp') val = b.yearsOfExperience - a.yearsOfExperience;
                                        return sortDir === 'asc' ? val : -val;
                                    })
                                    .map((c, i) => {
                                        const activeBucket = c.overriddenBucket ?? c.bucket;
                                        const isSelected = selectedIds.has(c.id);
                                        return (
                                            <div
                                                key={c.id}
                                                className="table-row"
                                                style={{
                                                    display: 'grid', gridTemplateColumns: '40px 70px 50px 1.5fr 1fr 100px 100px 100px',
                                                    alignItems: 'center', padding: '14px 24px',
                                                    borderBottom: i < filteredCandidates.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                                    background: isSelected ? 'hsla(262,72%,52%,0.03)' : undefined,
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => onSelectCandidate(c.id)}
                                                id={`list-row-${c.id}`}
                                            >
                                                <div onClick={e => { e.stopPropagation(); toggleSelect(c.id); }}>
                                                    <input type="checkbox" checked={isSelected} readOnly style={{ cursor: 'pointer', accentColor: 'var(--accent-purple)' }} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: 14, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: activeBucket === 'strong' ? 'var(--strong-text)' : activeBucket === 'potential' ? 'var(--potential-text)' : 'var(--text-secondary)' }}>
                                                        {c.compositeScore}%
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>#{c.globalRank}</div>
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                                                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{c.name}</span>
                                                        {c.isReferral && (
                                                            <span title="Referral" style={{ background: 'hsla(38,92%,55%,0.1)', color: 'var(--accent-amber)', padding: '1px 5px', borderRadius: 4, fontSize: 9, fontWeight: 800, textTransform: 'uppercase' }}>Ref</span>
                                                        )}
                                                        {c.isUnderHMReview && (
                                                            <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, fontWeight: 700, background: 'hsla(175,65%,42%,0.1)', color: 'hsl(175,70%,40%)', border: '1px solid hsla(175,65%,42%,0.15)', textTransform: 'uppercase' }}>HM</span>
                                                        )}
                                                    </div>
                                                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.currentRole} · {c.currentCompany}</div>
                                                </div>
                                                <div>
                                                    <span className={`badge badge-${activeBucket}`} style={{ fontSize: 10, padding: '2px 8px' }}>
                                                        {activeBucket === 'low' ? 'Limited Alignment' : activeBucket === 'strong' ? 'Strong Match' : 'Potential'}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{c.yearsOfExperience}y</div>
                                                <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.location}</div>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => toggleShortlist(c.id)}
                                                        style={{
                                                            background: c.isShortlisted ? 'hsla(38,92%,45%,0.08)' : 'var(--bg-secondary)',
                                                            border: `1px solid ${c.isShortlisted ? 'var(--potential-border)' : 'var(--border-subtle)'}`,
                                                            borderRadius: 7, padding: '5px 9px', cursor: 'pointer',
                                                            display: 'flex', alignItems: 'center', gap: 5, fontSize: 11,
                                                            color: c.isShortlisted ? 'var(--accent-amber)' : 'var(--text-muted)',
                                                            fontFamily: 'Inter, sans-serif', fontWeight: 600,
                                                            transition: 'all 120ms ease',
                                                        }}
                                                        id={`list-star-${c.id}`}
                                                    >
                                                        <Star size={11} fill={c.isShortlisted ? 'var(--accent-amber)' : 'none'} color={c.isShortlisted ? 'var(--accent-amber)' : 'currentColor'} />
                                                        {c.isShortlisted ? 'Shortlisted' : 'Shortlist'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                    )}

                    {/* === BUCKET VIEW === */}
                    {view === 'bucket' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, alignItems: 'start' }}>
                            {(['strong', 'potential', 'low'] as Bucket[]).map(bucket => {
                                const cfg = BUCKET_CONFIG[bucket];
                                const bucketCands = getBucketCandidates(bucket);
                                const allInBucketSelected = bucketCands.length > 0 && bucketCands.every(c => selectedIds.has(c.id));
                                return (
                                    <div key={bucket} style={{ display: 'flex', flexDirection: 'column', height: '880px' }}>
                                        <div style={{
                                            padding: '12px 16px',
                                            borderRadius: '12px 12px 0 0',
                                            background: cfg.bg, border: `1px solid ${cfg.border}`, borderBottom: 'none',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                                                <span style={{ padding: '1px 8px', borderRadius: 100, background: cfg.border, fontSize: 11, fontWeight: 700, color: cfg.color }}>
                                                    {bucketCands.length}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 11, color: cfg.color, opacity: 0.7 }}>{cfg.sublabel}</span>
                                                {bucketCands.length > 0 && (
                                                    <button
                                                        onClick={() => toggleSelectBucket(bucket)}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: 4,
                                                            padding: '3px 8px', borderRadius: 6, border: `1px solid ${cfg.border}`,
                                                            background: allInBucketSelected ? cfg.border : 'transparent',
                                                            color: cfg.color, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                                                            fontFamily: 'Inter, sans-serif',
                                                        }}
                                                        id={`select-all-${bucket}`}
                                                    >
                                                        <CheckSquare size={11} />
                                                        {allInBucketSelected ? 'Deselect' : 'Select All'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{
                                            flex: 1, border: `1px solid ${cfg.border}`, borderTop: 'none',
                                            borderRadius: '0 0 12px 12px', background: 'var(--bg-card)',
                                            overflow: 'hidden', padding: '8px 6px 8px 8px',
                                        }}>
                                            {bucketCands.length === 0 ? (
                                                <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)', fontSize: 13 }}>No candidates</div>
                                            ) : (
                                                <VirtualBucket
                                                    candidates={bucketCands}
                                                    onSelectCandidate={onSelectCandidate}
                                                    onToggleShortlist={toggleShortlist}
                                                    height={820}
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Bulk Action Bar — at fragment root, position:fixed vs true viewport */}
            {selectedIds.size > 0 && (() => {
                const allSelectedShortlisted = [...selectedIds].every(
                    id => candidates.find(c => c.id === id)?.isShortlisted
                );
                return (
                    <div style={{
                        position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
                        background: 'var(--bg-card)',
                        border: `1px solid ${allSelectedShortlisted ? 'hsl(0,72%,55%)' : 'var(--accent-purple)'}`,
                        borderRadius: 14, padding: '12px 24px',
                        display: 'flex', alignItems: 'center', gap: 18,
                        boxShadow: `0 8px 32px ${allSelectedShortlisted ? 'hsla(0,72%,55%,0.18)' : 'hsla(262,72%,52%,0.22)'}, 0 2px 8px hsla(0,0%,0%,0.15)`,
                        zIndex: 9999, backdropFilter: 'blur(16px)', whiteSpace: 'nowrap',
                    }}>
                        <Star size={15} color={allSelectedShortlisted ? 'hsl(0,72%,55%)' : 'var(--accent-amber)'} fill={allSelectedShortlisted ? 'hsl(0,72%,55%)' : 'var(--accent-amber)'} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                            {selectedIds.size} candidate{selectedIds.size !== 1 ? 's' : ''} selected
                        </span>
                        {allSelectedShortlisted ? (
                            <button
                                className="btn-ghost"
                                style={{ fontSize: 13, padding: '8px 20px', color: 'hsl(0,72%,55%)', border: '1px solid hsl(0,72%,55%)', borderRadius: 8 }}
                                onClick={() => { onUpdateCandidates(candidates.map(c => selectedIds.has(c.id) ? { ...c, isShortlisted: false } : c)); setSelectedIds(new Set()); }}
                                id="remove-shortlist-btn"
                            >
                                <Star size={13} /> Remove from Shortlist
                            </button>
                        ) : (
                            <button className="btn-primary" style={{ fontSize: 13, padding: '8px 20px' }} onClick={() => setShowShortlistModal(true)} id="shortlist-selected-btn">
                                <Star size={13} /> Shortlist Selected
                            </button>
                        )}
                        <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setSelectedIds(new Set())} id="clear-selection-btn">
                            <X size={12} /> Clear
                        </button>
                    </div>
                );
            })()}

            {/* Shortlist Confirmation Modal */}
            {showShortlistModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'hsla(220,30%,10%,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, backdropFilter: 'blur(4px)' }}>
                    <div className="card" style={{ padding: '28px 32px', maxWidth: 400, width: '90%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <Star size={18} color="var(--accent-amber)" fill="var(--accent-amber)" />
                            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Shortlist Candidates</h3>
                        </div>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 22 }}>
                            <strong style={{ color: 'var(--text-primary)' }}>{selectedIds.size} candidate{selectedIds.size !== 1 ? 's' : ''}</strong> will be added to your shortlist for this role.
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button className="btn-primary" style={{ flex: 1, fontSize: 14 }} onClick={confirmShortlist} id="confirm-shortlist-btn"><Star size={13} /> Add to Shortlist</button>
                            <button className="btn-secondary" style={{ flex: 1, fontSize: 14 }} onClick={() => setShowShortlistModal(false)} id="cancel-shortlist-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* JD Reference Side Panel */}
            {isJDOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
                    <div onClick={() => setIsJDOpen(false)} style={{ position: 'absolute', inset: 0, background: 'hsla(220,30%,10%,0.4)', backdropFilter: 'blur(2px)' }} />
                    <div className="screen-fade" style={{ position: 'relative', width: 480, height: '100%', background: 'var(--bg-card)', borderLeft: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)' }}>
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Reference Material</div>
                                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Job Description</h3>
                            </div>
                            <button onClick={() => setIsJDOpen(false)} style={{ background: 'var(--bg-secondary)', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                            <div style={{ marginBottom: 24 }}>
                                <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>Role Summary</h4>
                                <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{jd?.title ?? roleName ?? 'Role Overview'}</p>
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>Must-Have Skills</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {(jd?.mustHaveSkills ?? ['React', 'Node.js', 'TypeScript', 'PostgreSQL']).map(s => (
                                        <span key={s} style={{ padding: '4px 10px', borderRadius: 6, background: 'var(--accent-purple-dim)', color: 'var(--accent-purple)', fontSize: 12, fontWeight: 600 }}>{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>Description</h4>
                                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                                    {jd?.description ?? 'No description available for this role.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
