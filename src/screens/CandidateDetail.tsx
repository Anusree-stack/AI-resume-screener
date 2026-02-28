// src/screens/CandidateDetail.tsx
import { useState } from 'react';
import {
    ArrowLeft, Star, MapPin, Clock, GraduationCap,
    CheckCircle2, RotateCcw, AlertCircle, FileText, X, ShieldCheck, ShieldAlert
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

const EXPERIENCE_MIN = 4;

export default function CandidateDetail({ candidate, onBack, onUpdate }: CandidateDetailProps) {
    const [overrideOpen, setOverrideOpen] = useState(false);
    const [isJDOpen, setIsJDOpen] = useState(false);
    const [targetBucket, setTargetBucket] = useState<Bucket | ''>('');
    const [overrideReason, setOverrideReason] = useState('');
    const [overrideNote, setOverrideNote] = useState('');

    const activeBucket = candidate.overriddenBucket ?? candidate.bucket;
    const isStrong = activeBucket === 'strong';
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

    // Use JD from candidate's context if available, else fallback
    const jdSkills = candidate.mustHaveSkills || ['React', 'Node.js', 'TypeScript', 'PostgreSQL'];
    const foundSkills = jdSkills.filter(s => candidate.skills.some(cs => cs.toLowerCase() === s.toLowerCase()));
    const missingSkills = jdSkills.filter(s => !foundSkills.includes(s));
    const expGatePassed = candidate.yearsOfExperience >= EXPERIENCE_MIN;

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
                        <div>
                            <h1 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>{candidate.name}</h1>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{candidate.currentRole} · {candidate.currentCompany}</div>
                        </div>
                    </div>

                    <div style={{ width: 1, height: 20, background: 'var(--border-subtle)' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>AI Score:</span>
                        <span style={{ fontSize: 20, fontWeight: 800, color: candidate.compositeScore >= 80 ? 'var(--strong-text)' : candidate.compositeScore >= 50 ? 'var(--potential-text)' : 'var(--low-text)' }}>{candidate.compositeScore}%</span>
                        <span className={`badge badge-${activeBucket}`} style={{ fontSize: 10 }}>{activeBucket === 'strong' ? 'Strong Match' : activeBucket === 'potential' ? 'Potential' : 'Limited'}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button
                        className="btn-secondary"
                        onClick={() => setIsJDOpen(true)}
                        style={{ fontSize: 13, height: 36, padding: '0 14px', borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }}
                        id="detail-view-jd-btn"
                    >
                        <FileText size={14} /> View JD
                    </button>

                    <div style={{ width: 1, height: 20, background: 'var(--border-subtle)' }} />

                    <button
                        onClick={toggleShortlist}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '0', width: 36, height: 36, borderRadius: 8,
                            background: candidate.isShortlisted ? 'var(--accent-amber)' : 'var(--bg-card)',
                            border: `1px solid ${candidate.isShortlisted ? 'var(--accent-amber)' : 'var(--border-subtle)'}`,
                            color: candidate.isShortlisted ? '#fff' : 'var(--text-secondary)',
                            cursor: 'pointer',
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
                                    {(['strong', 'potential', 'low'] as Bucket[]).map(b => {
                                        const isCurrent = b === activeBucket;
                                        return (
                                            <button
                                                key={b}
                                                onClick={() => setTargetBucket(b)}
                                                disabled={isCurrent}
                                                className={`badge badge-${b}`}
                                                style={{
                                                    padding: '10px 14px',
                                                    fontSize: 11,
                                                    cursor: isCurrent ? 'not-allowed' : 'pointer',
                                                    borderRadius: 8,
                                                    opacity: isCurrent ? 0.2 : (targetBucket && targetBucket !== b ? 0.4 : 1),
                                                    border: targetBucket === b ? '2px solid var(--accent-purple)' : 'none',
                                                    fontWeight: 800,
                                                    transition: 'all 0.2s ease'
                                                }}
                                                id={`reclassify-${b}`}
                                            >
                                                {b.toUpperCase()}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <label style={sectionLabel}>Primary Reason</label>
                                <select className="input-field" value={overrideReason} onChange={e => setOverrideReason(e.target.value)} style={{ padding: '9px 12px', fontSize: 13 }}>
                                    <option value="">Reason for change...</option>
                                    {OVERRIDE_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <label style={sectionLabel}>Justification (min. 10 chars)</label>
                                <textarea className="input-field" value={overrideNote} onChange={e => setOverrideNote(e.target.value)} placeholder="Describe your reasoning..." style={{ minHeight: 46, height: 46, padding: '10px 12px', fontSize: 13 }} />
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

                        {/* AI Summary Card */}
                        <div className="card" style={{ padding: '24px 28px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-purple-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Star size={16} color="var(--accent-purple)" />
                                </div>
                                <h2 style={{ fontSize: 17, fontWeight: 800 }}>AI Analysis Summary</h2>
                            </div>
                            <p style={{ fontSize: 14.5, lineHeight: 1.8, color: 'var(--text-primary)' }}>{candidate.summary}</p>
                        </div>

                        {/* Must-Have Requirements gate */}
                        <div className="card" style={{ padding: '24px 28px' }}>
                            <p style={sectionLabel}>Must-Have Requirements Check</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                                {/* Skill gate */}
                                <div style={{ padding: 16, borderRadius: 12, background: (missingSkills.length === 0 || isStrong) ? 'var(--strong-bg)' : 'var(--low-bg)', border: `1px solid ${(missingSkills.length === 0 || isStrong) ? 'var(--strong-border)' : 'var(--low-border)'}` }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                        {(missingSkills.length === 0 || isStrong)
                                            ? <ShieldCheck size={16} color="var(--strong-text)" />
                                            : <ShieldAlert size={16} color="var(--low-text)" />
                                        }
                                        <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: (missingSkills.length === 0 || isStrong) ? 'var(--strong-text)' : 'var(--low-text)' }}>
                                            Skill Gate: {(missingSkills.length === 0 || isStrong) ? 'Passed' : 'Failed'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {(candidate.mustHaveSkills || ['React', 'Node.js', 'TypeScript', 'PostgreSQL']).map(s => {
                                            const found = foundSkills.includes(s) || isStrong;
                                            return (
                                                <span key={s} style={{
                                                    display: 'flex', alignItems: 'center', gap: 4,
                                                    padding: '3px 10px', borderRadius: 100, fontSize: 11.5, fontWeight: 600,
                                                    background: found ? 'hsla(158,72%,42%,0.1)' : 'hsla(0,80%,55%,0.1)',
                                                    color: found ? 'var(--strong-text)' : 'var(--low-text)',
                                                    border: `1px solid ${found ? 'var(--strong-border)' : 'var(--low-border)'}`,
                                                }}>
                                                    {found ? '✓' : '✗'} {s}
                                                </span>
                                            );
                                        })}
                                    </div>
                                    {(missingSkills.length > 0 && !isStrong) && (
                                        <p style={{ fontSize: 11.5, color: 'var(--low-text)', margin: '10px 0 0', lineHeight: 1.5 }}>
                                            Missing must-have{missingSkills.length > 1 ? 's' : ''}: candidate ineligible for Strong Match bucket.
                                        </p>
                                    )}
                                </div>

                                {/* Experience gate */}
                                <div style={{ padding: 16, borderRadius: 12, background: expGatePassed ? 'var(--strong-bg)' : 'var(--low-bg)', border: `1px solid ${expGatePassed ? 'var(--strong-border)' : 'var(--low-border)'}` }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                        {expGatePassed
                                            ? <ShieldCheck size={16} color="var(--strong-text)" />
                                            : <ShieldAlert size={16} color="var(--low-text)" />
                                        }
                                        <span style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: expGatePassed ? 'var(--strong-text)' : 'var(--low-text)' }}>
                                            Exp Gate: {expGatePassed ? 'Passed' : 'Failed'}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: expGatePassed ? 'var(--strong-text)' : 'var(--low-text)', marginBottom: 4 }}>
                                        {candidate.yearsOfExperience}y
                                    </div>
                                    <p style={{ fontSize: 11.5, color: expGatePassed ? 'var(--strong-text)' : 'var(--low-text)', lineHeight: 1.5, margin: 0 }}>
                                        JD requires minimum {EXPERIENCE_MIN} years.
                                        {!expGatePassed && ' Candidate is ineligible for Strong Match bucket.'}
                                    </p>
                                </div>
                            </div>

                            {/* Overall eligibility */}
                            <div style={{ padding: '10px 16px', borderRadius: 8, background: (missingSkills.length === 0 && expGatePassed) ? 'var(--strong-bg)' : 'var(--low-bg)', border: `1px solid ${(missingSkills.length === 0 && expGatePassed) ? 'var(--strong-border)' : 'var(--low-border)'}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                                {(missingSkills.length === 0 && expGatePassed)
                                    ? <><ShieldCheck size={14} color="var(--strong-text)" /><span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--strong-text)' }}>All eligibility constraints met — candidate is eligible for Strong Match bucket.</span></>
                                    : <><AlertCircle size={14} color="var(--low-text)" /><span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--low-text)' }}>One or more eligibility constraints not met — candidate is ineligible for Strong Match. Gating restricts bucket placement but does not remove from consideration.</span></>
                                }
                            </div>
                        </div>

                        {/* Score Breakdown */}
                        <div className="card" style={{ padding: '24px 28px' }}>
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
                                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>{dim.reasoning}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Context */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="card" style={{ padding: '24px' }}>
                            <p style={sectionLabel}>Professional History</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', paddingLeft: 16 }}>
                                <div style={{ position: 'absolute', left: 4, top: 4, bottom: 4, width: 2, background: 'var(--border-subtle)' }} />
                                {(candidate.experienceHistory || []).map((exp, i) => (
                                    <div key={i} style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: -20, top: 4, width: 10, height: 10, borderRadius: '50%', background: i === 0 ? 'var(--accent-purple)' : 'var(--bg-card)', border: `2px solid ${i === 0 ? 'var(--accent-purple)' : 'var(--border-subtle)'}` }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <h4 style={{ fontSize: 13.5, fontWeight: 700, margin: 0 }}>{exp.role}</h4>
                                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: 8 }}>{exp.duration}</span>
                                        </div>
                                        <div style={{ fontSize: 12.5, color: 'var(--accent-purple)', fontWeight: 600, marginBottom: 8 }}>{exp.company}</div>
                                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{exp.summary}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card" style={{ padding: '24px' }}>
                            <p style={sectionLabel}>Candidate Context</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                                    {candidate.skills.map(s => <span key={s} className="tag" style={{ fontSize: 11 }}>{s}</span>)}
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
                                <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>Role</h4>
                                <p style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 700 }}>Senior Full-Stack Engineer</p>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Engineering · Remote / Bangalore · 4–8 years</p>
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>Must-Have Skills</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {['React', 'Node.js', 'TypeScript', 'PostgreSQL'].map(s => (
                                        <span key={s} style={{ padding: '4px 10px', borderRadius: 6, background: 'var(--accent-purple-dim)', color: 'var(--accent-purple)', fontSize: 12, fontWeight: 600, border: '1px solid var(--border-glow)' }}>{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>Nice-to-Have</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {['GraphQL', 'AWS', 'Redis', 'Docker', 'System Design'].map(s => (
                                        <span key={s} style={{ padding: '4px 10px', borderRadius: 6, background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, border: '1px solid var(--border-subtle)' }}>{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>Role Description</h4>
                                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                                    {`We're looking for a Senior Full-Stack Engineer to join our product team. You'll work on mission-critical features, lead technical architecture decisions, and mentor junior engineers.\n\nYou'll collaborate closely with Product, Design, and Data in a cross-functional environment. Fintech or SaaS background is strongly preferred.`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
