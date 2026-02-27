// src/screens/Dashboard.tsx
import { useState, useMemo } from 'react';
import { Star, ArrowLeft, Search, X, LayoutList, Columns2, ArrowRight, CheckSquare } from 'lucide-react';
import type { Candidate, Bucket } from '../types';
import VirtualBucket from '../components/VirtualBucket';
import ScoreRing from '../components/ScoreRing';

interface DashboardProps {
    candidates: Candidate[];
    onSelectCandidate: (id: string) => void;
    onUpdateCandidates: (candidates: Candidate[]) => void;
    onProceedToShortlist: () => void;
    onBack: () => void;
    roleName?: string;
}

const BUCKET_CONFIG = {
    strong: { label: 'Strong', sublabel: 'Score ≥ 80', color: 'var(--strong-text)', bg: 'var(--strong-bg)', border: 'var(--strong-border)', badgeClass: 'badge-strong' },
    potential: { label: 'Potential', sublabel: 'Score 50–79', color: 'var(--potential-text)', bg: 'var(--potential-bg)', border: 'var(--potential-border)', badgeClass: 'badge-potential' },
    low: { label: 'Limited Alignment', sublabel: 'Score < 50', color: 'var(--low-text)', bg: 'var(--low-bg)', border: 'var(--low-border)', badgeClass: 'badge-low' },
};

export default function Dashboard({ candidates, onSelectCandidate, onUpdateCandidates, onProceedToShortlist, onBack, roleName }: DashboardProps) {
    const [search, setSearch] = useState('');
    const [bucketFilter, setBucketFilter] = useState<Bucket | ''>('');
    const [minScore, setMinScore] = useState(0);
    const [minExp, setMinExp] = useState(0);
    const [view, setView] = useState<'list' | 'bucket'>('list');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showShortlistModal, setShowShortlistModal] = useState(false);
    const [shortlistConfirmed, setShortlistConfirmed] = useState(false);

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

    const filteredCandidates = useMemo(() =>
        candidates
            .filter(c => {
                const matchSearch = !search.trim() || c.name.toLowerCase().includes(search.toLowerCase()) || c.currentRole.toLowerCase().includes(search.toLowerCase()) || c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
                const matchScore = c.compositeScore >= minScore;
                const matchExp = c.yearsOfExperience >= minExp;
                const matchBucket = !bucketFilter || (c.overriddenBucket ?? c.bucket) === bucketFilter;
                return matchSearch && matchScore && matchExp && matchBucket;
            })
            .sort((a, b) => b.compositeScore - a.compositeScore),
        [candidates, search, minScore, minExp, bucketFilter]
    );

    const getBucketCandidates = (bucket: Bucket) => filteredCandidates.filter(c => (c.overriddenBucket ?? c.bucket) === bucket);

    const shortlistedCount = candidates.filter(c => c.isShortlisted).length;
    const strongCount = candidates.filter(c => (c.overriddenBucket ?? c.bucket) === 'strong').length;
    const potentialCount = candidates.filter(c => (c.overriddenBucket ?? c.bucket) === 'potential').length;
    const avgScore = candidates.length ? Math.round(candidates.reduce((s, c) => s + c.compositeScore, 0) / candidates.length) : 0;
    const pctStrong = candidates.length ? Math.round((strongCount / candidates.length) * 100) : 0;
    const pctPotential = candidates.length ? Math.round((potentialCount / candidates.length) * 100) : 0;

    const filterPillStyle: React.CSSProperties = {
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 12px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        fontSize: 12.5,
        color: 'var(--text-secondary)',
        fontFamily: 'Inter, sans-serif',
    };

    const selectStyle: React.CSSProperties = {
        padding: '6px 28px 6px 10px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        color: 'var(--text-primary)',
        fontSize: 13,
        fontFamily: 'Inter, sans-serif',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none' as const,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 8px center',
    };

    return (
        <div className="screen-fade" style={{ minHeight: 'calc(100vh - 60px)', padding: '28px 36px 80px', background: 'var(--bg-primary)' }}>
            <div style={{ maxWidth: 1320, margin: '0 auto' }}>

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
                            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)' }}>Screening</div>
                            <h1 style={{ fontSize: 17, marginTop: 1, fontWeight: 800 }}>{roleName || 'Senior Full-Stack Engineer'}</h1>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        {shortlistConfirmed && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--strong-text)', fontWeight: 600, padding: '6px 14px', background: 'var(--strong-bg)', border: '1px solid var(--strong-border)', borderRadius: 8 }}>
                                ✓ Candidates shortlisted
                            </div>
                        )}
                        {shortlistedCount > 0 && (
                            <button className="btn-primary" onClick={onProceedToShortlist} style={{ fontSize: 13, padding: '8px 18px' }} id="proceed-shortlist-btn">
                                <Star size={13} />
                                Review Shortlist ({shortlistedCount}) <ArrowRight size={13} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
                    {[
                        { label: 'Total Applications', value: candidates.length, color: undefined },
                        { label: '% Strong', value: `${pctStrong}%`, color: 'var(--strong-text)' },
                        { label: '% Potential', value: `${pctPotential}%`, color: 'var(--potential-text)' },
                        { label: 'Avg Score', value: `${avgScore}%`, color: 'var(--accent-purple)' },
                    ].map(stat => (
                        <div key={stat.label} className="card metric-card" style={{ padding: '14px 18px' }}>
                            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: stat.color || 'var(--text-primary)', letterSpacing: '-0.02em' }}>{stat.value}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Filter Bar */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 18, alignItems: 'center', flexWrap: 'wrap', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10 }}>
                    <div style={{ position: 'relative', width: 240 }}>
                        <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            className="input-field"
                            style={{ paddingLeft: 32, paddingTop: 6, paddingBottom: 6, fontSize: 13 }}
                            placeholder="Search candidates, skills..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            id="dashboard-search"
                        />
                    </div>

                    <select value={bucketFilter} onChange={e => setBucketFilter(e.target.value as Bucket | '')} style={selectStyle} id="bucket-filter">
                        <option value="">All Buckets</option>
                        <option value="strong">Strong</option>
                        <option value="potential">Potential</option>
                        <option value="low">Limited Alignment</option>
                    </select>

                    <div style={filterPillStyle}>
                        <span style={{ whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--text-muted)', fontSize: 12 }}>Score ≥ {minScore}%</span>
                        <input type="range" min="0" max="100" value={minScore} onChange={e => setMinScore(Number(e.target.value))}
                            style={{ width: 80, accentColor: 'var(--accent-purple)', cursor: 'pointer' }} />
                    </div>

                    <div style={filterPillStyle}>
                        <span style={{ whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--text-muted)', fontSize: 12 }}>Exp ≥ {minExp}y</span>
                        <input type="range" min="0" max="15" value={minExp} onChange={e => setMinExp(Number(e.target.value))}
                            style={{ width: 60, accentColor: 'var(--accent-purple)', cursor: 'pointer' }} />
                    </div>

                    {(search || bucketFilter || minScore > 0 || minExp > 0) && (
                        <button className="btn-ghost" style={{ fontSize: 12, color: 'var(--accent-red)' }}
                            onClick={() => { setSearch(''); setBucketFilter(''); setMinScore(0); setMinExp(0); }}>
                            <X size={12} /> Clear
                        </button>
                    )}

                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 3, background: 'var(--bg-secondary)', padding: 3, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                        {([['list', 'Ranked List', LayoutList], ['bucket', 'Buckets', Columns2]] as const).map(([v, label, Icon]) => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                style={{
                                    padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12.5,
                                    background: view === v ? 'var(--bg-card)' : 'transparent',
                                    color: view === v ? 'var(--accent-purple)' : 'var(--text-muted)',
                                    fontWeight: view === v ? 600 : 500,
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    transition: 'all 120ms ease',
                                    fontFamily: 'Inter, sans-serif',
                                    boxShadow: view === v ? 'var(--shadow-sm)' : 'none',
                                }}
                                id={`view-${v}-btn`}
                            >
                                <Icon size={13} /> {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* === RANKED LIST VIEW === */}
                {view === 'list' && (
                    <div className="card" style={{ overflow: 'hidden' }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '36px 56px 1fr 100px 74px 80px 90px 100px',
                            alignItems: 'center', padding: '10px 18px',
                            background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)',
                        }}>
                            <div>
                                <input type="checkbox"
                                    checked={selectedIds.size > 0 && selectedIds.size === filteredCandidates.length}
                                    onChange={toggleSelectAll}
                                    style={{ cursor: 'pointer', accentColor: 'var(--accent-purple)' }}
                                />
                            </div>
                            {['Rank', 'Candidate', 'Bucket', 'Score', 'Experience', 'Location', ''].map((h, i) => (
                                <div key={h + i} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
                            ))}
                        </div>
                        {filteredCandidates.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: 14 }}>No candidates match current filters.</div>
                        ) : (
                            filteredCandidates.map((c, i) => {
                                const activeBucket = c.overriddenBucket ?? c.bucket;
                                const isSelected = selectedIds.has(c.id);
                                return (
                                    <div
                                        key={c.id}
                                        className="table-row"
                                        style={{
                                            display: 'grid', gridTemplateColumns: '36px 56px 1fr 100px 74px 80px 90px 100px',
                                            alignItems: 'center', padding: '10px 18px',
                                            borderBottom: i < filteredCandidates.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                            background: isSelected ? 'var(--accent-purple-dim)' : undefined,
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => onSelectCandidate(c.id)}
                                        id={`list-row-${c.id}`}
                                    >
                                        <div onClick={e => { e.stopPropagation(); toggleSelect(c.id); }}>
                                            <input type="checkbox" checked={isSelected} readOnly style={{ cursor: 'pointer', accentColor: 'var(--accent-purple)' }} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <ScoreRing score={c.compositeScore} size={38} strokeWidth={3.5} showLabel={false} />
                                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>#{i + 1}</span>
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                                <span style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>{c.name}</span>
                                                {c.isShortlisted && <Star size={11} fill="var(--accent-amber)" color="var(--accent-amber)" />}
                                                {c.isUnderHMReview && (
                                                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 100, fontWeight: 600, background: 'hsla(175,65%,42%,0.1)', color: 'var(--stage-offer-extended-color)', border: '1px solid hsla(175,65%,42%,0.2)', whiteSpace: 'nowrap' }}>HM Review</span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.currentRole} · {c.currentCompany}</div>
                                        </div>
                                        <div>
                                            <span className={`badge badge-${activeBucket}`} style={{ fontSize: 10 }}>
                                                {activeBucket === 'low' ? 'Limited' : activeBucket === 'strong' ? 'Strong' : 'Potential'}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: 14, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: activeBucket === 'strong' ? 'var(--strong-text)' : activeBucket === 'potential' ? 'var(--potential-text)' : 'var(--text-secondary)' }}>
                                            {c.compositeScore}%
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
                                                    display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5,
                                                    color: c.isShortlisted ? 'var(--accent-amber)' : 'var(--text-muted)',
                                                    fontFamily: 'Inter, sans-serif', fontWeight: 600,
                                                    transition: 'all 120ms ease',
                                                }}
                                                id={`list-star-${c.id}`}
                                            >
                                                <Star size={12} fill={c.isShortlisted ? 'var(--accent-amber)' : 'none'} color={c.isShortlisted ? 'var(--accent-amber)' : 'currentColor'} />
                                                {c.isShortlisted ? 'Starred' : 'Star'}
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

            {/* Bulk Action Bar */}
            {selectedIds.size > 0 && (
                <div style={{
                    position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--bg-card)', border: '1px solid var(--border-glow)',
                    borderRadius: 12, padding: '14px 22px',
                    display: 'flex', alignItems: 'center', gap: 18,
                    boxShadow: 'var(--shadow-lg)', zIndex: 200,
                    backdropFilter: 'blur(12px)',
                }}>
                    <Star size={15} color="var(--accent-amber)" fill="var(--accent-amber)" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {selectedIds.size} candidate{selectedIds.size !== 1 ? 's' : ''} selected
                    </span>
                    <button className="btn-primary" style={{ fontSize: 13, padding: '8px 20px' }} onClick={() => setShowShortlistModal(true)} id="shortlist-selected-btn">
                        <Star size={13} /> Shortlist Selected
                    </button>
                    <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setSelectedIds(new Set())} id="clear-selection-btn">
                        <X size={12} /> Clear
                    </button>
                </div>
            )}

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
                            <button className="btn-primary" style={{ flex: 1, fontSize: 14 }} onClick={confirmShortlist} id="confirm-shortlist-btn">
                                <Star size={13} /> Add to Shortlist
                            </button>
                            <button className="btn-secondary" style={{ flex: 1, fontSize: 14 }} onClick={() => setShowShortlistModal(false)} id="cancel-shortlist-btn">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
