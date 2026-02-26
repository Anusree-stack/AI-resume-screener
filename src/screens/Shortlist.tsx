// src/screens/Shortlist.tsx
import { useState } from 'react';
import {
    ArrowLeft, Send, Star, User, CheckCircle2, Edit3,
    Mail, Clock, MapPin, AlertTriangle, Check, X
} from 'lucide-react';
import type { Candidate } from '../types';
import ScoreRing from '../components/ScoreRing';

interface ShortlistProps {
    candidates: Candidate[];
    onBack: () => void;
    onRemove: (id: string) => void;
}

export default function Shortlist({ candidates, onBack, onRemove }: ShortlistProps) {
    const [note, setNote] = useState('');
    const [sent, setSent] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const shortlisted = candidates.filter(c => c.isShortlisted)
        .sort((a, b) => b.compositeScore - a.compositeScore);

    const handleSend = () => {
        setSent(true);
        setConfirmOpen(false);
    };

    if (sent) {
        return (
            <div style={{
                minHeight: 'calc(100vh - 64px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '48px 32px',
            }}>
                <div style={{ maxWidth: 520, textAlign: 'center' }}>
                    <div style={{
                        width: 100, height: 100, borderRadius: 28,
                        background: 'var(--strong-bg)', border: '1px solid var(--strong-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 28px',
                        boxShadow: 'var(--shadow-glow-green)',
                    }}>
                        <CheckCircle2 size={48} color="var(--accent-green)" />
                    </div>
                    <h1 style={{ fontSize: 30, letterSpacing: '-0.03em', marginBottom: 12 }}>Shortlist Sent!</h1>
                    <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32 }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{shortlisted.length} candidate{shortlisted.length !== 1 ? 's' : ''}</strong> have been submitted to the Hiring Manager for review.
                    </p>
                    <div style={{
                        padding: '16px 20px', borderRadius: 12,
                        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                        display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                        marginBottom: 32,
                    }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-purple-dim)', border: '1px solid var(--border-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Mail size={16} color="var(--accent-purple)" />
                        </div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Sent to Hiring Manager</p>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>hiringmanager@company.com · Just now</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {shortlisted.map(c => (
                            <div key={c.id} style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '10px 14px', borderRadius: 10,
                                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                            }}>
                                <Check size={14} color="var(--accent-green)" />
                                <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{c.name}</span>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.compositeScore}%</span>
                            </div>
                        ))}
                    </div>
                    <button className="btn-primary" onClick={onBack} style={{ marginTop: 32 }} id="sent-back-btn">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', padding: '32px 32px 64px' }}>
            <div style={{ maxWidth: 820, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
                    <div>
                        <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 12 }} id="shortlist-back-btn">
                            <ArrowLeft size={15} /> Back to Dashboard
                        </button>
                        <h1 style={{ fontSize: 30, letterSpacing: '-0.03em', marginBottom: 6 }}>Review Shortlist</h1>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                            {shortlisted.length} candidate{shortlisted.length !== 1 ? 's' : ''} selected for Hiring Manager
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Star size={18} fill="var(--accent-amber)" color="var(--accent-amber)" />
                        <span style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>{shortlisted.length}</span>
                    </div>
                </div>

                {shortlisted.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 32px' }}>
                        <Star size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No candidates shortlisted</h3>
                        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
                            Go back to the dashboard and star candidates to shortlist them.
                        </p>
                        <button className="btn-primary" onClick={onBack} id="no-shortlist-back-btn">Back to Dashboard</button>
                    </div>
                ) : (
                    <>
                        {/* Candidate List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
                            {shortlisted.map((candidate, i) => {
                                const activeBucket = candidate.overriddenBucket ?? candidate.bucket;
                                return (
                                    <div key={candidate.id} className="card" style={{ padding: 20 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            {/* Rank */}
                                            <div style={{
                                                width: 32, height: 32, borderRadius: 10,
                                                background: i === 0 ? 'linear-gradient(135deg, var(--accent-amber), hsl(50,95%,60%))' : 'var(--bg-secondary)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 13, fontWeight: 800, flexShrink: 0,
                                                color: i === 0 ? 'hsl(30,60%,20%)' : 'var(--text-muted)',
                                                border: `1px solid ${i === 0 ? 'transparent' : 'var(--border-subtle)'}`,
                                            }}>
                                                #{i + 1}
                                            </div>

                                            {/* Score */}
                                            <ScoreRing score={candidate.compositeScore} size={52} strokeWidth={5} showLabel={false} />

                                            {/* Info */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                                    <h3 style={{ fontSize: 15, fontWeight: 700 }}>{candidate.name}</h3>
                                                    <span className={`badge badge-${activeBucket}`} style={{ fontSize: 10 }}>
                                                        {activeBucket === 'strong' ? 'Strong' : activeBucket === 'potential' ? 'Potential' : 'Low'}
                                                    </span>
                                                    {candidate.overriddenBucket && (
                                                        <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 100, background: 'hsla(38,95%,62%,0.1)', color: 'var(--accent-amber)', border: '1px solid hsla(38,95%,62%,0.2)', fontWeight: 600 }}>
                                                            Overridden
                                                        </span>
                                                    )}
                                                </div>
                                                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                                                    {candidate.currentRole} · {candidate.currentCompany}
                                                </p>
                                                <div style={{ display: 'flex', gap: 12 }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--text-muted)' }}>
                                                        <Clock size={11} /> {candidate.yearsOfExperience}y
                                                    </span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--text-muted)' }}>
                                                        <MapPin size={11} /> {candidate.location}
                                                    </span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--text-muted)' }}>
                                                        <Mail size={11} /> {candidate.email}
                                                    </span>
                                                </div>
                                                {candidate.mustHaveViolations.length > 0 && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 11.5, color: 'var(--accent-amber)' }}>
                                                        <AlertTriangle size={11} /> {candidate.mustHaveViolations.length} violation{candidate.mustHaveViolations.length !== 1 ? 's' : ''} noted
                                                    </div>
                                                )}
                                            </div>

                                            {/* Remove */}
                                            <button
                                                onClick={() => onRemove(candidate.id)}
                                                className="btn-ghost"
                                                style={{ color: 'var(--text-muted)', padding: '8px' }}
                                                id={`remove-shortlist-${candidate.id}`}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Message to HM */}
                        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                                <Edit3 size={15} color="var(--text-secondary)" />
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Message to Hiring Manager (optional)</span>
                            </div>
                            <textarea
                                className="input-field"
                                placeholder="Add context about these candidates, your assessment, or recommended next steps..."
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                style={{ minHeight: 100, fontSize: 13 }}
                                id="hm-message-input"
                            />
                        </div>

                        {/* Governance Note */}
                        <div style={{
                            padding: '14px 18px', borderRadius: 12, marginBottom: 24,
                            background: 'var(--accent-purple-dim)',
                            border: '1px solid hsla(262,83%,68%,0.2)',
                            fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
                        }}>
                            <strong style={{ color: 'var(--accent-purple)' }}>Governance Reminder:</strong> This shortlist is a recruiter recommendation only.
                            The Hiring Manager retains full authority to accept, reject, or expand the candidate pool.
                            All AI scores are informational and do not constitute automated hiring decisions.
                        </div>

                        {/* Send CTA */}
                        {!confirmOpen ? (
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    className="btn-primary"
                                    onClick={() => setConfirmOpen(true)}
                                    style={{ fontSize: 15, padding: '14px 28px' }}
                                    id="send-shortlist-btn"
                                >
                                    <Send size={16} />
                                    Send to Hiring Manager
                                </button>
                            </div>
                        ) : (
                            <div style={{
                                padding: '20px 24px', borderRadius: 14,
                                background: 'var(--bg-card)', border: '1px solid var(--border-glow)',
                            }}>
                                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Confirm submission?</p>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                                    This will notify the Hiring Manager with your {shortlisted.length} selected candidates.
                                </p>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <button className="btn-primary" onClick={handleSend} style={{ flex: 1 }} id="confirm-send-btn">
                                        <Send size={15} /> Yes, Send Now
                                    </button>
                                    <button className="btn-secondary" onClick={() => setConfirmOpen(false)} style={{ flex: 1 }} id="cancel-send-btn">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
