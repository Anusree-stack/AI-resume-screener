// src/screens/CandidateDetail.tsx
import { useState } from 'react';
import {
    ArrowLeft, Star, MapPin, Briefcase, Clock, GraduationCap,
    AlertTriangle, CheckCircle2, RotateCcw, ChevronDown, ChevronUp, Send
} from 'lucide-react';
import type { Candidate, Bucket } from '../types';
import ScoreRing from '../components/ScoreRing';

interface CandidateDetailProps {
    candidate: Candidate;
    onBack: () => void;
    onUpdate: (candidate: Candidate) => void;
}

const bucketOptions: { value: Bucket; label: string; class: string }[] = [
    { value: 'strong', label: 'Strong Match', class: 'badge-strong' },
    { value: 'potential', label: 'Potential Fit', class: 'badge-potential' },
    { value: 'low', label: 'Low Match', class: 'badge-low' },
];

function DimensionBar({ label, score, max, reasoning }: { label: string; score: number; max: number; reasoning: string }) {
    const [expanded, setExpanded] = useState(false);
    const pct = (score / max) * 100;

    const barColor =
        pct >= 80 ? 'var(--accent-green)'
            : pct >= 60 ? 'var(--accent-blue)'
                : pct >= 40 ? 'var(--accent-amber)'
                    : 'var(--accent-red)';

    return (
        <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 12, overflow: 'hidden',
            transition: 'border-color 0.2s',
        }}>
            <div
                style={{ padding: '14px 18px', cursor: 'pointer', userSelect: 'none' }}
                onClick={() => setExpanded(!expanded)}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 15, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: barColor }}>
                            {score}<span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)' }}>/{max}</span>
                        </span>
                        {expanded ? <ChevronUp size={14} color="var(--text-muted)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
                    </div>
                </div>
                <div className="progress-bar" style={{ height: 6 }}>
                    <div style={{
                        height: '100%', borderRadius: 100, width: `${pct}%`,
                        background: `linear-gradient(90deg, ${barColor}88, ${barColor})`,
                        transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                    }} />
                </div>
            </div>
            {expanded && (
                <div style={{
                    padding: '0 18px 16px',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: 14,
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    background: 'hsla(222,22%,12%,0.6)',
                }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                        <span style={{
                            padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                            background: 'var(--accent-purple-dim)', color: 'var(--accent-purple)',
                            border: '1px solid hsla(262,83%,68%,0.2)',
                            letterSpacing: '0.04em',
                        }}>AI REASONING</span>
                    </div>
                    {reasoning}
                </div>
            )}
        </div>
    );
}

export default function CandidateDetail({ candidate, onBack, onUpdate }: CandidateDetailProps) {
    const [overrideMode, setOverrideMode] = useState(false);
    const [overrideNote, setOverrideNote] = useState('');
    const activeBucket = candidate.overriddenBucket ?? candidate.bucket;

    const handleOverride = (bucket: Bucket) => {
        if (bucket === candidate.bucket && !candidate.overriddenBucket) return;
        onUpdate({ ...candidate, overriddenBucket: bucket === candidate.bucket ? undefined : bucket });
        setOverrideMode(false);
        setOverrideNote('');
    };

    const resetOverride = () => {
        onUpdate({ ...candidate, overriddenBucket: undefined });
    };

    const toggleShortlist = () => {
        onUpdate({ ...candidate, isShortlisted: !candidate.isShortlisted });
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', padding: '32px 32px 64px' }}>
            <div style={{ maxWidth: 880, margin: '0 auto' }}>

                {/* Top bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                    <button className="btn-ghost" onClick={onBack} id="detail-back-btn">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>
                    <div style={{ display: 'flex', gap: 10 }}>
                        {candidate.overriddenBucket && (
                            <button className="btn-secondary" onClick={resetOverride} style={{ fontSize: 13 }} id="reset-override-btn">
                                <RotateCcw size={14} /> Reset Override
                            </button>
                        )}
                        <button
                            className={candidate.isShortlisted ? 'btn-primary' : 'btn-secondary'}
                            onClick={toggleShortlist}
                            style={{ fontSize: 13 }}
                            id="detail-shortlist-btn"
                        >
                            <Star size={14} fill={candidate.isShortlisted ? 'white' : 'none'} />
                            {candidate.isShortlisted ? 'Shortlisted' : 'Add to Shortlist'}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>

                    {/* Left column — identity */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* Profile Card */}
                        <div className="card" style={{ padding: 24 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
                                {/* Avatar */}
                                <div style={{
                                    width: 72, height: 72, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 26, fontWeight: 800, color: 'white',
                                    boxShadow: 'var(--shadow-glow-purple)',
                                }}>
                                    {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                    <h2 style={{ fontSize: 18, marginBottom: 4 }}>{candidate.name}</h2>
                                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{candidate.currentRole}</p>
                                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{candidate.currentCompany}</p>
                                </div>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                                    <span className={`badge badge-${activeBucket}`}>
                                        {activeBucket === 'strong' ? 'Strong' : activeBucket === 'potential' ? 'Potential' : 'Low Match'}
                                    </span>
                                    {candidate.overriddenBucket && (
                                        <span style={{ padding: '3px 8px', borderRadius: 100, fontSize: 10, fontWeight: 700, background: 'hsla(38,95%,62%,0.12)', color: 'var(--accent-amber)', border: '1px solid hsla(38,95%,62%,0.25)' }}>
                                            Manual Override
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '16px 0' }} />

                            {[
                                { icon: <Clock size={13} />, label: `${candidate.yearsOfExperience} years experience` },
                                { icon: <MapPin size={13} />, label: candidate.location },
                                { icon: <GraduationCap size={13} />, label: candidate.education },
                                { icon: <Briefcase size={13} />, label: candidate.email },
                            ].map(item => (
                                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                    <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{item.icon}</span>
                                    <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Score Summary */}
                        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>Composite Score</p>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                                <ScoreRing score={candidate.compositeScore} size={110} strokeWidth={9} />
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Based on 4 AI-scored dimensions</p>
                        </div>

                        {/* Skills */}
                        <div className="card" style={{ padding: 20 }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Skills</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {candidate.skills.map(skill => (
                                    <span key={skill} className="tag" style={{ fontSize: 12 }}>{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column - analysis */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                        {/* AI Summary */}
                        <div className="card" style={{ padding: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                                <span style={{
                                    padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                                    background: 'var(--accent-purple-dim)', color: 'var(--accent-purple)',
                                    border: '1px solid hsla(262,83%,68%,0.2)',
                                    letterSpacing: '0.04em',
                                }}>AI SUMMARY</span>
                            </div>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                                {candidate.summary}
                            </p>
                        </div>

                        {/* Must-have violations */}
                        {candidate.mustHaveViolations.length > 0 && (
                            <div style={{
                                padding: 20, borderRadius: 14,
                                background: 'var(--low-bg)',
                                border: '1px solid var(--low-border)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <AlertTriangle size={15} color="var(--low-text)" />
                                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--low-text)' }}>Must-Have Violations</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {candidate.mustHaveViolations.map(v => (
                                        <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--low-text)' }}>
                                            <span>·</span> {v}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {candidate.mustHaveViolations.length === 0 && (
                            <div style={{
                                padding: '14px 18px', borderRadius: 12,
                                background: 'var(--strong-bg)', border: '1px solid var(--strong-border)',
                                display: 'flex', alignItems: 'center', gap: 10,
                            }}>
                                <CheckCircle2 size={16} color="var(--strong-text)" />
                                <span style={{ fontSize: 13, color: 'var(--strong-text)', fontWeight: 500 }}>All must-have criteria satisfied</span>
                            </div>
                        )}

                        {/* Dimension Scores */}
                        <div className="card" style={{ padding: 24 }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
                                Score Breakdown · Click to expand AI reasoning
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {candidate.dimensions.map(dim => (
                                    <DimensionBar
                                        key={dim.label}
                                        label={dim.label}
                                        score={dim.score}
                                        max={dim.max}
                                        reasoning={dim.reasoning}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Override Section */}
                        <div className="card" style={{ padding: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>Recruiter Override</p>
                                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Change bucket classification. Overrides are logged for audit.</p>
                                </div>
                                <button
                                    className="btn-ghost"
                                    onClick={() => setOverrideMode(!overrideMode)}
                                    style={{ fontSize: 13 }}
                                    id="toggle-override-btn"
                                >
                                    {overrideMode ? 'Cancel' : 'Override Bucket'}
                                </button>
                            </div>

                            {overrideMode && (
                                <div>
                                    <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                                        {bucketOptions.map(opt => (
                                            <button
                                                key={opt.value}
                                                className={`badge ${opt.class}`}
                                                onClick={() => handleOverride(opt.value)}
                                                style={{
                                                    cursor: 'pointer', border: '1px solid',
                                                    padding: '8px 16px', fontSize: 12, borderRadius: 100,
                                                    outline: activeBucket === opt.value ? '2px solid var(--accent-purple)' : 'none',
                                                    outlineOffset: 2,
                                                    transition: 'all 0.2s',
                                                }}
                                                id={`override-${opt.value}-btn`}
                                            >
                                                {opt.label} {activeBucket === opt.value ? '(current)' : ''}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        className="input-field"
                                        placeholder="Optional note explaining the override reason (recommended for audit trail)..."
                                        value={overrideNote}
                                        onChange={e => setOverrideNote(e.target.value)}
                                        style={{ minHeight: 80, fontSize: 13 }}
                                        id="override-note-input"
                                    />
                                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                                        ⚠️ Override will be logged with your user ID and timestamp for compliance.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
