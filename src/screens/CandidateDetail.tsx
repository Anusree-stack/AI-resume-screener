// src/screens/CandidateDetail.tsx
import { useState } from 'react';
import {
    ArrowLeft, Star, MapPin, Clock, GraduationCap,
    CheckCircle2, RotateCcw, HelpCircle, AlertCircle, FileText, X
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

export default function CandidateDetail({ candidate, onBack, onUpdate }: CandidateDetailProps) {
    const [overrideOpen, setOverrideOpen] = useState(false);
    const [isJDOpen, setIsJDOpen] = useState(false);
    const [targetBucket, setTargetBucket] = useState<Bucket | ''>('');
    const [overrideReason, setOverrideReason] = useState('');
    const [overrideNote, setOverrideNote] = useState('');

    const activeBucket = candidate.overriddenBucket ?? candidate.bucket;
    const canSaveOverride = targetBucket && overrideReason && overrideNote.trim().length >= 10;

    const handleOverride = () => {
        if (!canSaveOverride) return;
        onUpdate({ ...candidate, overriddenBucket: targetBucket as Bucket, overrideReason, overrideNote });
        setOverrideOpen(false);
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

            {/* Sticky Header */}
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
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>Score:</span>
                        <span style={{ fontSize: 18, fontWeight: 800, color: candidate.compositeScore >= 80 ? 'var(--strong-text)' : candidate.compositeScore >= 50 ? 'var(--potential-text)' : 'var(--low-text)' }}>{candidate.compositeScore}</span>
                        <span className={`badge badge-${activeBucket}`} style={{ fontSize: 10 }}>{activeBucket.toUpperCase()}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button
                        className="btn-secondary"
                        onClick={() => setIsJDOpen(true)}
                        style={{ fontSize: 13, height: 36, padding: '0 14px', borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }}
                        id="detail-view-jd-btn"
                    >
                        <FileText size={14} /> View Reference JD
                    </button>

                    <div style={{ width: 1, height: 20, background: 'var(--border-subtle)' }} />

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
                </div>
            </div>

            <div style={{ maxWidth: 1240, margin: '0 auto', padding: '32px 40px' }}>

                {/* Reclassify Panel */}
                {overrideOpen && (
                    <div className="screen-fade" style={{
                        marginBottom: 32, padding: '28px 34px',
                        background: 'var(--bg-card)', border: '2px solid var(--accent-purple)',
                        borderRadius: 12, boxShadow: 'var(--shadow-lg)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                            <RotateCcw size={20} color="var(--accent-purple)" />
                            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Manual Reclassification</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginBottom: 24 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <label style={sectionLabel}>Target Bucket</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {(['strong', 'potential', 'low'] as Bucket[]).map(b => (
                                        <button key={b} onClick={() => setTargetBucket(b)} className={`badge badge-${b}`} style={{ padding: '10px 14px', fontSize: 11, cursor: 'pointer', borderRadius: 8, opacity: targetBucket && targetBucket !== b ? 0.4 : 1, border: targetBucket === b ? '2px solid var(--accent-purple)' : 'none', fontWeight: 800 }}>{b.toUpperCase()}</button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <label style={sectionLabel}>Primary Reason</label>
                                <select className="input-field" value={overrideReason} onChange={e => setOverrideReason(e.target.value)} style={{ padding: '9px 12px', fontSize: 13 }}><option value="">Reason for change...</option>{OVERRIDE_REASONS.map(r => <option key={r} value={r}>{r}</option>)}</select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <label style={sectionLabel}>Justification</label>
                                <textarea className="input-field" value={overrideNote} onChange={e => setOverrideNote(e.target.value)} placeholder="Min. 10 chars..." style={{ minHeight: 46, height: 46, padding: '10px 12px', fontSize: 13 }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                            <button className="btn-secondary" onClick={() => setOverrideOpen(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleOverride} disabled={!canSaveOverride}><CheckCircle2 size={16} />Apply Changes</button>
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 32 }}>

                    {/* LEFT: Analysis */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="card" style={{ padding: '24px 28px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-purple-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HelpCircle size={18} color="var(--accent-purple)" /></div>
                                <h2 style={{ fontSize: 18, fontWeight: 800 }}>AI Analysis Summary</h2>
                            </div>
                            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-primary)', marginBottom: 24 }}>{candidate.summary}</p>

                            <p style={sectionLabel}>Detailed Score Breakdown</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {candidate.dimensions.map(dim => (
                                    <div key={dim.label} style={{ padding: '16px', borderRadius: 12, background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                            <span style={{ fontSize: 14, fontWeight: 700 }}>{dim.label}</span>
                                            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent-purple)' }}>{dim.score}/{dim.max}</span>
                                        </div>
                                        <div style={{ height: 4, background: 'var(--border-subtle)', borderRadius: 100, marginBottom: 12 }}>
                                            <div style={{ width: `${(dim.score / dim.max) * 100}%`, height: '100%', background: 'var(--accent-purple)', borderRadius: 100 }} />
                                        </div>
                                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{dim.reasoning}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card" style={{ padding: '24px 28px' }}>
                            <p style={sectionLabel}>Key Strengths & Gaps</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                <div style={{ background: 'var(--strong-bg)', padding: 16, borderRadius: 12, border: '1px solid var(--strong-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--strong-text)', marginBottom: 10, fontWeight: 800 }}>
                                        <CheckCircle2 size={16} /> STRENGTHS
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: 'var(--strong-text)', lineHeight: 1.6 }}>
                                        <li>Strong match on core technical requirements</li>
                                        <li>High proficiency in {candidate.skills.slice(0, 3).join(', ')}</li>
                                        <li>Stable career progression at {candidate.currentCompany}</li>
                                    </ul>
                                </div>
                                <div style={{ background: 'var(--low-bg)', padding: 16, borderRadius: 12, border: '1px solid var(--low-border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--low-text)', marginBottom: 10, fontWeight: 800 }}>
                                        <AlertCircle size={16} /> GAPS
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: 'var(--low-text)', lineHeight: 1.6 }}>
                                        {candidate.mustHaveViolations.length > 0 ? (
                                            candidate.mustHaveViolations.map(v => <li key={v}>{v}</li>)
                                        ) : (
                                            <li>No critical violations identified.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Experience */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="card" style={{ padding: '24px' }}>
                            <p style={sectionLabel}>Professional History</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', paddingLeft: 12 }}>
                                <div style={{ position: 'absolute', left: 0, top: 4, bottom: 4, width: 2, background: 'var(--border-subtle)' }} />
                                {(candidate.experienceHistory || []).map((exp, i) => (
                                    <div key={i} style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: -16, top: 4, width: 10, height: 10, borderRadius: '50%', background: i === 0 ? 'var(--accent-purple)' : 'var(--bg-card)', border: `2px solid ${i === 0 ? 'var(--accent-purple)' : 'var(--border-subtle)'}` }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{exp.role}</h4>
                                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{exp.duration}</span>
                                        </div>
                                        <div style={{ fontSize: 13, color: 'var(--accent-purple)', fontWeight: 600, marginBottom: 8 }}>{exp.company}</div>
                                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{exp.summary}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card" style={{ padding: '24px' }}>
                            <p style={sectionLabel}>Candidate Context</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Clock size={16} color="var(--text-muted)" />
                                    <span style={{ fontSize: 13.5 }}>{candidate.yearsOfExperience}y Total Experience</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <MapPin size={16} color="var(--text-muted)" />
                                    <span style={{ fontSize: 13.5 }}>{candidate.location}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <GraduationCap size={16} color="var(--text-muted)" />
                                    <span style={{ fontSize: 13.5 }}>{candidate.education} · {candidate.educationInstitution}</span>
                                </div>
                            </div>

                            <div style={{ marginTop: 20 }}>
                                <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12 }}>Matched Skills</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {candidate.skills.map(s => <span key={s} className="tag">{s}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* JD Reference Side Panel */}
            {isJDOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', justifyContent: 'flex-end' }}>
                    <div onClick={() => setIsJDOpen(false)} style={{ position: 'absolute', inset: 0, background: 'hsla(220,30%,10%,0.4)', backdropFilter: 'blur(2px)' }} />
                    <div className="screen-fade" style={{
                        position: 'relative', width: 480, height: '100%', background: 'var(--bg-card)',
                        borderLeft: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Reference Material</div>
                                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Job Description</h3>
                            </div>
                            <button onClick={() => setIsJDOpen(false)} style={{ background: 'var(--bg-secondary)', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer', color: 'var(--text-muted)' }}>
                                <X size={18} />
                            </button>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
                            <div style={{ marginBottom: 24 }}>
                                <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>Role Summary</h4>
                                <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>Senior Full-Stack Engineer</p>
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>Requirements</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {['React', 'Node.js', 'TypeScript', 'PostgreSQL'].map(s => (
                                        <span key={s} style={{ padding: '4px 10px', borderRadius: 6, background: 'var(--accent-purple-dim)', color: 'var(--accent-purple)', fontSize: 12, fontWeight: 600 }}>{s}</span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>Description</h4>
                                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                                    We're looking for a Senior Full-Stack Engineer to join our product team. You'll work on mission-critical features, lead technical architecture decisions, and mentor junior engineers.
                                    {"\n\n"}
                                    You'll be embedded in a cross-functional team and collaborate closely with Product, Design, and Data.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
