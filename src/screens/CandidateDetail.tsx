// src/screens/CandidateDetail.tsx
import { useState } from 'react';
import {
    ArrowLeft, Star, MapPin, Briefcase, Clock, GraduationCap,
    CheckCircle2, RotateCcw, HelpCircle, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import type { Candidate, Bucket } from '../types';

interface CandidateDetailProps {
    candidate: Candidate;
    onBack: () => void;
    onUpdate: (candidate: Candidate) => void;
}

const OVERRIDE_REASONS = [
    'Skill Alignment Adjustment',
    'Relevant Experience Adjustment',
    'Role Complexity Context',
    'Career Trajectory Signal',
    'Must-Have Criteria Re-evaluation',
    'Domain Expertise Recognised',
    'Other',
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
        <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
            <div style={{ padding: '11px 14px', cursor: 'pointer', userSelect: 'none' }} onClick={() => setExpanded(!expanded)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: barColor }}>
                            {score}<span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-muted)' }}>/{max}</span>
                        </span>
                        {expanded ? <ChevronUp size={12} color="var(--text-muted)" /> : <ChevronDown size={12} color="var(--text-muted)" />}
                    </div>
                </div>
                <div style={{ height: 4, background: 'var(--border-subtle)', borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 100, width: `${pct}%`, background: barColor, transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)' }} />
                </div>
            </div>
            {expanded && (
                <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-subtle)', fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.75, background: 'var(--bg-card)' }}>
                    {reasoning}
                </div>
            )}
        </div>
    );
}

export default function CandidateDetail({ candidate, onBack, onUpdate }: CandidateDetailProps) {
    const [overrideOpen, setOverrideOpen] = useState(false);
    const [targetBucket, setTargetBucket] = useState<Bucket | ''>('');
    const [overrideReason, setOverrideReason] = useState('');
    const [overrideNote, setOverrideNote] = useState('');

    const activeBucket = candidate.overriddenBucket ?? candidate.bucket;

    const canSaveOverride = targetBucket && overrideReason && overrideNote.trim().length >= 10;

    const handleOverride = () => {
        if (!canSaveOverride) return;
        onUpdate({ ...candidate, overriddenBucket: targetBucket as Bucket, overrideReason, overrideNote });
        setOverrideOpen(false);
        setTargetBucket('');
        setOverrideReason('');
        setOverrideNote('');
    };

    const toggleShortlist = () => {
        onUpdate({ ...candidate, isShortlisted: !candidate.isShortlisted });
    };

    const sectionLabel: React.CSSProperties = {
        fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 12,
    };

    return (
        <div className="screen-fade" style={{ minHeight: 'calc(100vh - 60px)', background: 'var(--bg-primary)', paddingBottom: 100 }}>

            {/* Sticky Header - COMPACT SINGLE LINE */}
            <div style={{
                position: 'sticky', top: 60, zIndex: 1000,
                background: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)',
                padding: '10px 40px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                backdropFilter: 'blur(12px)',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
                    <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4, borderRadius: 6 }} id="detail-back-btn">
                        <ArrowLeft size={18} />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 8,
                            background: 'var(--accent-purple)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 14, fontWeight: 800, color: 'white',
                        }}>
                            {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{candidate.name}</h1>
                    </div>

                    <div style={{ width: 1, height: 20, background: 'var(--border-subtle)' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>AI Score:</span>
                        <span style={{ fontSize: 18, fontWeight: 800, color: candidate.compositeScore >= 80 ? 'var(--strong-text)' : candidate.compositeScore >= 50 ? 'var(--potential-text)' : 'var(--low-text)' }}>{candidate.compositeScore}</span>
                        <span className={`badge badge-${activeBucket}`} style={{ fontSize: 10 }}>{activeBucket.toUpperCase()}</span>
                    </div>

                    <div style={{ width: 1, height: 20, background: 'var(--border-subtle)' }} />

                    {/* Score Breakdown in Header - Condensed */}
                    <div style={{ display: 'flex', gap: 12, overflow: 'hidden' }}>
                        {candidate.dimensions.map(dim => (
                            <div key={dim.label} style={{ display: 'flex', flexDirection: 'column', minWidth: 70 }}>
                                <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{dim.label.split(' ')[0]}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <div style={{ flex: 1, height: 3, background: 'var(--border-subtle)', borderRadius: 2 }}>
                                        <div style={{ width: `${(dim.score / dim.max) * 100}%`, height: '100%', background: 'var(--accent-purple)', borderRadius: 2 }} />
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 700 }}>{dim.score}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div className="tooltip-wrapper">
                        <button
                            onClick={toggleShortlist}
                            className={candidate.isShortlisted ? 'btn-primary' : 'btn-secondary'}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                padding: '0', width: 36, height: 36, borderRadius: 8,
                                background: candidate.isShortlisted ? 'var(--accent-amber)' : 'var(--bg-card)',
                                borderColor: candidate.isShortlisted ? 'var(--accent-amber)' : 'var(--border-subtle)',
                                color: candidate.isShortlisted ? '#fff' : 'var(--text-secondary)',
                            }}
                            id="detail-shortlist-btn"
                        >
                            <Star size={18} fill={candidate.isShortlisted ? '#fff' : 'none'} />
                        </button>
                        <div className="tooltip-box">Shortlist candidate</div>
                    </div>

                    <div className="tooltip-wrapper">
                        <button
                            onClick={() => setOverrideOpen(!overrideOpen)}
                            className="btn-secondary"
                            style={{
                                display: 'flex', alignItems: 'center', gap: 7,
                                padding: '0 14px', height: 36, borderRadius: 8, fontSize: 13, fontWeight: 700,
                                background: overrideOpen ? 'var(--accent-purple-dim)' : 'var(--bg-card)',
                                borderColor: overrideOpen ? 'var(--accent-purple)' : 'var(--border-subtle)',
                                color: overrideOpen ? 'var(--accent-purple)' : 'var(--text-primary)',
                            }}
                            id="toggle-override-btn"
                        >
                            <RotateCcw size={14} />
                            Reclassify
                        </button>
                        <div className="tooltip-box">I can move the profile to a different bucket</div>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 1240, margin: '0 auto', padding: '32px 40px' }}>

                {/* Reclassify Panel - HIGH VISIBILITY */}
                {overrideOpen && (
                    <div className="screen-fade" style={{
                        marginBottom: 32, padding: '28px 34px',
                        background: 'var(--bg-card)', border: '2px solid var(--accent-purple)',
                        borderRadius: 12, boxShadow: 'var(--shadow-lg)',
                        position: 'relative', zIndex: 100
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                            <RotateCcw size={20} color="var(--accent-purple)" />
                            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Manual Reclassification Flow</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30, marginBottom: 24 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: targetBucket ? 'var(--accent-green)' : 'var(--accent-purple)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>1</div>
                                    <label style={{ ...sectionLabel, marginBottom: 0 }}>Target Bucket</label>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {(['strong', 'potential', 'low'] as Bucket[]).map(b => (
                                        <button key={b} onClick={() => setTargetBucket(b)} className={`badge badge-${b}`} style={{ padding: '10px 14px', fontSize: 11, cursor: 'pointer', borderRadius: 8, opacity: targetBucket && targetBucket !== b ? 0.4 : 1, border: targetBucket === b ? '2px solid var(--accent-purple)' : '2px solid transparent', fontWeight: 800 }}>{b.toUpperCase()}</button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: overrideReason ? 'var(--accent-green)' : 'var(--accent-purple)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>2</div>
                                    <label style={{ ...sectionLabel, marginBottom: 0 }}>Primary Reason</label>
                                </div>
                                <select className="input-field" value={overrideReason} onChange={e => setOverrideReason(e.target.value)} style={{ padding: '9px 12px', fontSize: 13 }}><option value="">Reason for change...</option>{OVERRIDE_REASONS.map(r => <option key={r} value={r}>{r}</option>)}</select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: overrideNote.trim().length >= 10 ? 'var(--accent-green)' : 'var(--accent-purple)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>3</div>
                                    <label style={{ ...sectionLabel, marginBottom: 0 }}>Justification</label>
                                </div>
                                <textarea className="input-field" value={overrideNote} onChange={e => setOverrideNote(e.target.value)} placeholder="Min. 10 chars..." style={{ minHeight: 46, height: 46, padding: '10px 12px', fontSize: 13 }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
                            <button className="btn-secondary" onClick={() => setOverrideOpen(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleOverride} disabled={!canSaveOverride} style={{ minWidth: 160 }}><CheckCircle2 size={16} />Apply Changes</button>
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 420px', gap: 32 }}>

                    {/* LEFT COLUMN: AI Deep Analysis */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="card" style={{ padding: '24px 28px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-purple-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HelpCircle size={18} color="var(--accent-purple)" /></div>
                                <h2 style={{ fontSize: 18, fontWeight: 800 }}>AI Reasoning: Why this score?</h2>
                            </div>
                            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 24 }}>{candidate.summary}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div style={{ padding: '16px', borderRadius: 12, background: 'var(--strong-bg)', border: '1px solid var(--strong-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: 'var(--strong-text)' }}><CheckCircle2 size={16} /><span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>Key Strengths</span></div>
                                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--strong-text)', lineHeight: 1.6 }}><li>High match on core engineering stack</li><li>Scale-ready experience at {candidate.currentCompany}</li><li>Relevant project leadership signals</li></ul>
                                </div>
                                <div style={{ padding: '16px', borderRadius: 12, background: 'var(--low-bg)', border: '1px solid var(--low-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, color: 'var(--low-text)' }}><AlertCircle size={16} /><span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>Identified Gaps</span></div>
                                    <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: 'var(--low-text)', lineHeight: 1.6 }}>{candidate.mustHaveViolations.length > 0 ? candidate.mustHaveViolations.map(v => <li key={v}>{v}</li>) : <li>No critical skill gaps.</li>}</ul>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Score Justifications */}
                        <div className="card" style={{ padding: '24px 28px' }}>
                            <p style={sectionLabel}>Scoring Justification</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {candidate.dimensions.map(dim => (
                                    <div key={dim.label} style={{ paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <span style={{ fontSize: 14, fontWeight: 700 }}>{dim.label}</span>
                                            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-purple)' }}>{dim.score}/{dim.max}</span>
                                        </div>
                                        <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{dim.reasoning}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Candidate Context & Experience */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="card" style={{ padding: '24px' }}>
                            <p style={sectionLabel}>Professional Experience</p>
                            <div style={{ position: 'relative', paddingLeft: 20 }}>
                                <div style={{ position: 'absolute', left: 4, top: 4, bottom: 4, width: 2, background: 'var(--border-subtle)' }} />
                                {(candidate.experienceHistory || []).length > 0 ? (
                                    (candidate.experienceHistory || []).map((exp, idx) => (
                                        <div key={idx} style={{ marginBottom: 24, position: 'relative' }}>
                                            <div style={{ position: 'absolute', left: -21, top: 4, width: 10, height: 10, borderRadius: '50%', background: idx === 0 ? 'var(--accent-purple)' : 'var(--bg-card)', border: `2px solid ${idx === 0 ? 'var(--accent-purple)' : 'var(--border-subtle)'}`, zIndex: 1 }} />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{exp.role}</h3>
                                                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{exp.duration}</span>
                                            </div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-purple)', marginBottom: 6 }}>{exp.company}</div>
                                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{exp.summary}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>Detailed history not available for this record.</div>
                                )}
                            </div>
                        </div>

                        <div className="card" style={{ padding: '24px' }}>
                            <p style={sectionLabel}>Contextual Info</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Clock size={15} color="var(--text-muted)" /><span style={{ fontSize: 13.5 }}>{candidate.yearsOfExperience} Years Experience</span></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><MapPin size={15} color="var(--text-muted)" /><span style={{ fontSize: 13.5 }}>{candidate.location}</span></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><GraduationCap size={15} color="var(--text-muted)" /><span style={{ fontSize: 13.5 }}>{candidate.education}</span></div>
                            </div>
                            <div style={{ marginTop: 24 }}>
                                <p style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>Matched Skills</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{candidate.skills.map(s => <span key={s} className="tag" style={{ fontSize: 11 }}>{s}</span>)}</div>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '24px' }}>
                            <p style={sectionLabel}>Contact</p>
                            <div style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}><div style={{ marginBottom: 6 }}>✉ {candidate.email}</div><div>📞 {candidate.phone}</div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
