// src/screens/CandidateDetail.tsx
import { useState } from 'react';
import {
    ArrowLeft, Star, MapPin, Briefcase, Clock, GraduationCap,
    CheckCircle2, RotateCcw, ChevronDown, ChevronUp, HelpCircle, AlertCircle
} from 'lucide-react';
import type { Candidate, Bucket } from '../types';
import ScoreRing from '../components/ScoreRing';

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

const bucketOptions: { value: Bucket; label: string; badgeClass: string }[] = [
    { value: 'strong', label: 'Strong', badgeClass: 'badge-strong' },
    { value: 'potential', label: 'Potential', badgeClass: 'badge-potential' },
    { value: 'low', label: 'Limited Alignment', badgeClass: 'badge-low' },
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

function parseEducation(raw: string) {
    const parts = raw.split('·').map(p => p.trim());
    return { degree: parts[0] ?? '', university: parts[1] ?? '', year: parts[2] ?? '', cert: parts[3] ?? '' };
}

export default function CandidateDetail({ candidate, onBack, onUpdate }: CandidateDetailProps) {
    const [overrideOpen, setOverrideOpen] = useState(false);
    const [targetBucket, setTargetBucket] = useState<Bucket | ''>('');
    const [overrideReason, setOverrideReason] = useState('');
    const [overrideNote, setOverrideNote] = useState('');
    const [overrideSaved, setOverrideSaved] = useState(false);

    const activeBucket = candidate.overriddenBucket ?? candidate.bucket;
    const edu = parseEducation(candidate.education);

    const canSaveOverride = targetBucket && overrideReason && overrideNote.trim().length >= 10;

    const handleOverride = () => {
        if (!canSaveOverride) return;
        onUpdate({ ...candidate, overriddenBucket: targetBucket as Bucket, overrideReason, overrideNote });
        setOverrideOpen(false);
        setTargetBucket('');
        setOverrideReason('');
        setOverrideNote('');
        setOverrideSaved(true);
        setTimeout(() => setOverrideSaved(false), 3500);
    };

    const resetOverride = () => {
        onUpdate({ ...candidate, overriddenBucket: undefined, overrideReason: undefined, overrideNote: undefined });
    };

    const toggleShortlist = () => {
        onUpdate({ ...candidate, isShortlisted: !candidate.isShortlisted });
    };

    const sectionLabel: React.CSSProperties = {
        fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 12,
    };

    return (
        <div className="screen-fade" style={{ minHeight: 'calc(100vh - 60px)', background: 'var(--bg-primary)', paddingBottom: 60 }}>

            {/* Sticky Header */}
            <div style={{
                position: 'sticky', top: 60, zIndex: 40,
                background: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)',
                padding: '12px 40px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                backdropFilter: 'blur(12px)',
            }}>
                {/* Left: Back + Identity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4, borderRadius: 6 }} title="Back to Dashboard" id="detail-back-btn">
                        <ArrowLeft size={16} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 42, height: 42, borderRadius: '50%',
                            background: 'var(--accent-purple)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 15, fontWeight: 800, color: 'white', letterSpacing: '-0.02em',
                            flexShrink: 0,
                        }}>
                            {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <h1 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>{candidate.name}</h1>
                                <span className={`badge badge-${activeBucket}`} style={{ fontSize: 10 }}>
                                    {activeBucket === 'low' ? 'Limited Alignment' : activeBucket === 'strong' ? 'Strong' : 'Potential'}
                                </span>
                                {candidate.overriddenBucket && (
                                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: 'hsla(38,92%,45%,0.1)', color: 'var(--accent-amber)', border: '1px solid hsla(38,92%,45%,0.2)' }}>Overridden</span>
                                )}
                            </div>
                            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 1 }}>{candidate.currentRole} · {candidate.currentCompany}</div>
                        </div>
                    </div>
                    {/* Composite score in header */}
                    <div style={{
                        marginLeft: 8,
                        padding: '6px 14px',
                        background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 10,
                        display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                        <ScoreRing score={candidate.compositeScore} size={36} strokeWidth={3.5} showLabel={false} />
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: candidate.compositeScore >= 80 ? 'var(--strong-text)' : candidate.compositeScore >= 50 ? 'var(--potential-text)' : 'var(--low-text)', lineHeight: 1 }}>
                                {candidate.compositeScore}%
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>AI Score</div>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {overrideSaved && (
                        <div style={{ fontSize: 12.5, color: 'var(--strong-text)', fontWeight: 600, padding: '6px 12px', background: 'var(--strong-bg)', border: '1px solid var(--strong-border)', borderRadius: 8 }}>
                            ✓ Override recorded
                        </div>
                    )}

                    {/* Recruiter Override with tooltip */}
                    <div className="tooltip-wrapper">
                        <button
                            onClick={() => setOverrideOpen(!overrideOpen)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
                                background: overrideOpen ? 'var(--accent-purple-dim)' : 'var(--bg-secondary)',
                                border: `1px solid ${overrideOpen ? 'var(--border-glow)' : 'var(--border-subtle)'}`,
                                color: overrideOpen ? 'var(--accent-purple)' : 'var(--text-secondary)',
                                fontFamily: 'Inter, sans-serif', fontWeight: 600,
                                transition: 'all 120ms ease',
                            }}
                            id="toggle-override-btn"
                        >
                            <RotateCcw size={13} />
                            {overrideOpen ? 'Cancel Override' : 'Reclassify'}
                        </button>
                        <HelpCircle
                            size={14}
                            color="var(--text-muted)"
                            style={{ marginLeft: 3, cursor: 'help' }}
                        />
                        <div className="tooltip-box" style={{ width: 220, left: 'auto', right: 0, transform: 'none' }}>
                            If you believe this candidate is wrongly classified, use Reclassify to move them to a different bucket. Your reason and notes will be recorded for AI model refinement.
                        </div>
                    </div>

                    {candidate.overriddenBucket && (
                        <button className="btn-ghost" onClick={resetOverride} style={{ fontSize: 12 }} id="reset-override-btn">
                            Reset Override
                        </button>
                    )}

                    {/* Star */}
                    <button
                        onClick={toggleShortlist}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
                            background: candidate.isShortlisted ? 'hsla(38,92%,45%,0.09)' : 'var(--bg-secondary)',
                            border: `1px solid ${candidate.isShortlisted ? 'var(--potential-border)' : 'var(--border-subtle)'}`,
                            color: candidate.isShortlisted ? 'var(--accent-amber)' : 'var(--text-secondary)',
                            fontFamily: 'Inter, sans-serif', fontWeight: 600,
                        }}
                        id="detail-shortlist-btn"
                    >
                        <Star size={13} fill={candidate.isShortlisted ? 'var(--accent-amber)' : 'none'} color={candidate.isShortlisted ? 'var(--accent-amber)' : 'currentColor'} />
                        {candidate.isShortlisted ? 'Starred' : 'Star'}
                    </button>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 40px' }}>

                {/* Override Panel */}
                {overrideOpen && (
                    <div style={{
                        marginBottom: 24, padding: '22px 26px',
                        background: 'var(--bg-card)', border: '1px solid var(--border-glow)',
                        borderRadius: 12, boxShadow: 'var(--shadow-glow-purple)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                            <RotateCcw size={15} color="var(--accent-purple)" />
                            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Reclassify Candidate</span>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>— All fields required. This is logged for AI model refinement.</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 16 }}>
                            {/* Step 1: Bucket */}
                            <div>
                                <label style={{ ...sectionLabel, display: 'block' }}>1. Move to Bucket <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {bucketOptions.map(opt => (
                                        <button
                                            key={opt.value}
                                            className={`badge ${opt.badgeClass}`}
                                            onClick={() => setTargetBucket(opt.value)}
                                            style={{
                                                padding: '8px 14px', fontSize: 12, cursor: 'pointer', borderRadius: 8,
                                                outline: targetBucket === opt.value ? `2px solid var(--accent-purple)` : '2px solid transparent',
                                                outlineOffset: 2, transition: 'outline 100ms',
                                                fontFamily: 'Inter, sans-serif',
                                                opacity: activeBucket === opt.value && targetBucket !== opt.value ? 0.55 : 1,
                                            }}
                                            id={`override-${opt.value}-btn`}
                                        >
                                            {opt.label} {activeBucket === opt.value ? '(current)' : ''}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Step 2: Reason */}
                            <div>
                                <label style={{ ...sectionLabel, display: 'block' }}>2. Reason <span style={{ color: 'var(--accent-red)' }}>*</span></label>
                                <select
                                    className="input-field"
                                    value={overrideReason}
                                    onChange={e => setOverrideReason(e.target.value)}
                                    style={{ fontSize: 13, padding: '9px 14px' }}
                                    id="override-reason-select"
                                >
                                    <option value="">Select a reason...</option>
                                    {OVERRIDE_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                        </div>
                        {/* Step 3: Notes */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ ...sectionLabel, display: 'block' }}>3. Notes & Context <span style={{ color: 'var(--accent-red)' }}>*</span> <span style={{ color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>(min. 10 characters)</span></label>
                            <textarea
                                className="input-field"
                                placeholder="Explain why this candidate should be reclassified. This note is mandatory for compliance and AI feedback loops."
                                value={overrideNote}
                                onChange={e => setOverrideNote(e.target.value)}
                                style={{ minHeight: 80, fontSize: 13 }}
                                id="override-note-input"
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <button
                                className="btn-primary"
                                onClick={handleOverride}
                                disabled={!canSaveOverride}
                                style={{ fontSize: 13, padding: '9px 20px' }}
                                id="save-override-btn"
                            >
                                Apply Reclassification
                            </button>
                            {!canSaveOverride && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                                    <AlertCircle size={13} color="var(--accent-amber)" />
                                    Select bucket, reason, and add notes to confirm.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* HM Review Banner */}
                {candidate.isUnderHMReview && (
                    <div style={{ marginBottom: 20, padding: '10px 18px', borderRadius: 9, background: 'var(--stage-offer-extended-bg)', border: '1px solid var(--stage-offer-extended-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--stage-offer-extended-color)' }}>Under Hiring Manager Review</span>
                        <button className="btn-ghost" style={{ fontSize: 11 }} onClick={() => onUpdate({ ...candidate, isUnderHMReview: false })} id="reopen-screening-btn">Reopen Screening</button>
                    </div>
                )}

                {/* TWO-COLUMN BODY */}
                <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 22, alignItems: 'start' }}>

                    {/* ====== LEFT: AI INTELLIGENCE PANEL ====== */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                        {/* Must-Have Status */}
                        {candidate.mustHaveViolations.length === 0 ? (
                            <div style={{ padding: '12px 16px', borderRadius: 10, background: 'var(--strong-bg)', border: '1px solid var(--strong-border)', display: 'flex', alignItems: 'center', gap: 9 }}>
                                <CheckCircle2 size={15} color="var(--strong-text)" />
                                <div>
                                    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--strong-text)' }}>All must-have criteria met</div>
                                    <div style={{ fontSize: 11.5, color: 'var(--strong-text)', opacity: 0.7, marginTop: 1 }}>No mandatory skill gaps found</div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '14px 16px', borderRadius: 10, background: 'var(--low-bg)', border: '1px solid var(--low-border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                                    <AlertCircle size={14} color="var(--low-text)" />
                                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--low-text)' }}>Missing Must-Have Skills</p>
                                </div>
                                {candidate.mustHaveViolations.map(v => (
                                    <div key={v} style={{ fontSize: 12.5, color: 'var(--low-text)', marginBottom: 4, paddingLeft: 8 }}>· {v}</div>
                                ))}
                            </div>
                        )}

                        {/* Score Breakdown */}
                        <div className="card" style={{ padding: '18px 20px' }}>
                            <p style={sectionLabel}>Score Breakdown</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {candidate.dimensions.map(dim => (
                                    <DimensionBar key={dim.label} label={dim.label} score={dim.score} max={dim.max} reasoning={dim.reasoning} />
                                ))}
                            </div>
                            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Composite Score</span>
                                <span style={{
                                    fontSize: 20, fontWeight: 800, fontFamily: 'Outfit, sans-serif',
                                    color: candidate.compositeScore >= 80 ? 'var(--strong-text)' : candidate.compositeScore >= 50 ? 'var(--potential-text)' : 'var(--low-text)'
                                }}>
                                    {candidate.compositeScore}%
                                </span>
                            </div>
                        </div>

                        {/* Override Record */}
                        {candidate.overriddenBucket && candidate.overrideReason && (
                            <div style={{ padding: '14px 16px', borderRadius: 10, background: 'hsla(38,92%,45%,0.06)', border: '1px solid hsla(38,92%,45%,0.2)' }}>
                                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Override on Record</p>
                                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 4 }}><strong>Reason:</strong> {candidate.overrideReason}</p>
                                {candidate.overrideNote && <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{candidate.overrideNote}</p>}
                            </div>
                        )}
                    </div>

                    {/* ====== RIGHT: CANDIDATE CONTEXT ====== */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                        {/* Recruiter Summary */}
                        <div className="card" style={{ padding: '18px 22px' }}>
                            <p style={sectionLabel}>Recruiter Summary</p>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.85 }}>{candidate.summary}</p>
                        </div>

                        {/* Work Experience */}
                        <div className="card" style={{ padding: '18px 22px' }}>
                            <p style={sectionLabel}>Experience & Background</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                {[
                                    { icon: <Briefcase size={13} />, val: `${candidate.currentRole} at ${candidate.currentCompany}` },
                                    { icon: <Clock size={13} />, val: `${candidate.yearsOfExperience} years of experience` },
                                    { icon: <MapPin size={13} />, val: candidate.location },
                                ].map(item => (
                                    <div key={item.val} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, color: 'var(--text-secondary)', padding: '8px 14px', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                                        <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{item.icon}</span>
                                        {item.val}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Education */}
                        <div className="card" style={{ padding: '18px 22px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <GraduationCap size={14} color="var(--text-muted)" />
                                <p style={sectionLabel}>Education</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-purple-dim)', border: '1px solid var(--border-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <GraduationCap size={18} color="var(--accent-purple)" />
                                </div>
                                <div>
                                    {edu.degree && <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 2, color: 'var(--text-primary)' }}>{edu.degree}</p>}
                                    {edu.university && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 2 }}>{edu.university}</p>}
                                    {edu.year && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Class of {edu.year}</p>}
                                    {edu.cert && (
                                        <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 100, background: 'var(--accent-purple-dim)', border: '1px solid var(--border-glow)' }}>
                                            <span style={{ fontSize: 12, color: 'var(--accent-purple)', fontWeight: 600 }}>🏅 {edu.cert}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* All Skills */}
                        <div className="card" style={{ padding: '18px 22px' }}>
                            <p style={sectionLabel}>Skills</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {candidate.skills.map(skill => (
                                    <span key={skill} className="tag" style={{ fontSize: 12 }}>{skill}</span>
                                ))}
                            </div>
                        </div>

                        {/* Contact info */}
                        <div className="card" style={{ padding: '15px 22px' }}>
                            <p style={sectionLabel}>Contact</p>
                            <div style={{ display: 'flex', gap: 20 }}>
                                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>✉ {candidate.email}</span>
                                {candidate.phone && <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>📞 {candidate.phone}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
