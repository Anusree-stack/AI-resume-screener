// src/screens/Shortlist.tsx
import { useState } from 'react';
import {
    ArrowLeft, Send, Star, CheckCircle2, Edit3,
    Mail, Clock, MapPin, Check, X
} from 'lucide-react';
import type { Candidate } from '../types';
import ScoreRing from '../components/ScoreRing';

interface ShortlistProps {
    candidates: Candidate[];
    onBack: () => void;
    onRemove: (id: string) => void;
    roleName?: string;
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
            <div className="screen-fade" style={{
                minHeight: 'calc(100vh - 60px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '48px 32px',
            }}>
                <div style={{ maxWidth: 500, textAlign: 'center' }}>
                    <div style={{
                        width: 88, height: 88, borderRadius: 24,
                        background: 'var(--strong-bg)', border: '1px solid var(--strong-border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 24px',
                    }}>
                        <CheckCircle2 size={40} color="var(--accent-green)" />
                    </div>
                    <h1 style={{ fontSize: 26, marginBottom: 10 }}>Shortlist Submitted</h1>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{shortlisted.length} candidate{shortlisted.length !== 1 ? 's' : ''}</strong> have been submitted to the Hiring Manager for review.
                    </p>
                    <div style={{
                        padding: '14px 18px', borderRadius: 10,
                        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                        display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                        marginBottom: 28,
                    }}>
                        <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--accent-purple-dim)', border: '1px solid var(--border-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Mail size={15} color="var(--accent-purple)" />
                        </div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 1 }}>Sent to Hiring Manager</p>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>hiringmanager@company.com · Just now</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 28 }}>
                        {shortlisted.map(c => (
                            <div key={c.id} style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '9px 14px', borderRadius: 9,
                                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                            }}>
                                <Check size={13} color="var(--accent-green)" />
                                <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{c.name}</span>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.compositeScore}%</span>
                            </div>
                        ))}
                    </div>
                    <button className="btn-primary" onClick={onBack} id="sent-back-btn">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="screen-fade" style={{ minHeight: 'calc(100vh - 60px)', padding: '32px 32px 80px' }}>
            <div style={{ maxWidth: 820, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
                    <div>
                        <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 10 }} id="shortlist-back-btn">
                            <ArrowLeft size={14} /> Back to Dashboard
                        </button>
                        <h1 style={{ fontSize: 26, marginBottom: 5 }}>Review Shortlist</h1>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                            {shortlisted.length} candidate{shortlisted.length !== 1 ? 's' : ''} selected for Hiring Manager
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 36 }}>
                        <Star size={18} fill="var(--accent-amber)" color="var(--accent-amber)" />
                        <span style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>{shortlisted.length}</span>
                    </div>
                </div>

                {shortlisted.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '72px 32px' }}>
                        <Star size={36} color="var(--text-muted)" style={{ margin: '0 auto 14px' }} />
                        <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>No candidates starred</h3>
                        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 22 }}>
                            Go back to the dashboard and star candidates to shortlist them.
                        </p>
                        <button className="btn-primary" onClick={onBack} id="no-shortlist-back-btn">Back to Dashboard</button>
                    </div>
                ) : (
                    <>
                        {/* Candidate List */}
                        <div className="card" style={{ overflow: 'hidden', marginBottom: 20 }}>
                            {shortlisted.map((candidate, i) => {
                                const activeBucket = candidate.overriddenBucket ?? candidate.bucket;
                                return (
                                    <div
                                        key={candidate.id}
                                        className="table-row"
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px',
                                            borderBottom: i < shortlisted.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                        }}
                                    >
                                        {/* Rank */}
                                        <div style={{
                                            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                                            background: i === 0 ? 'linear-gradient(135deg, var(--accent-amber), hsl(50,95%,60%))' : 'var(--bg-secondary)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 12, fontWeight: 800,
                                            color: i === 0 ? 'hsl(30,60%,20%)' : 'var(--text-muted)',
                                            border: `1px solid ${i === 0 ? 'transparent' : 'var(--border-subtle)'}`,
                                        }}>
                                            #{i + 1}
                                        </div>

                                        <ScoreRing score={candidate.compositeScore} size={46} strokeWidth={4} showLabel={false} />

                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                                                <h3 style={{ fontSize: 14, fontWeight: 700 }}>{candidate.name}</h3>
                                                <span className={`badge badge-${activeBucket}`} style={{ fontSize: 10 }}>
                                                    {activeBucket === 'low' ? 'Limited' : activeBucket === 'strong' ? 'Strong' : 'Potential'}
                                                </span>
                                                {candidate.overriddenBucket && (
                                                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 100, background: 'hsla(38,95%,62%,0.1)', color: 'var(--accent-amber)', border: '1px solid hsla(38,95%,62%,0.2)', fontWeight: 600 }}>
                                                        Overridden
                                                    </span>
                                                )}
                                                {candidate.isUnderHMReview && (
                                                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 100, background: 'hsla(175,70%,50%,0.1)', color: 'hsl(175,70%,55%)', border: '1px solid hsla(175,70%,50%,0.25)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                                        HM Review
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
                                        </div>

                                        {/* Star (remove from shortlist) */}
                                        <button
                                            onClick={() => onRemove(candidate.id)}
                                            style={{
                                                background: 'hsla(38,95%,62%,0.1)',
                                                border: '1px solid var(--potential-border)',
                                                borderRadius: 7, padding: '5px 8px', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 5,
                                                fontSize: 11.5, color: 'var(--accent-amber)',
                                            }}
                                            title="Remove from shortlist"
                                            id={`remove-shortlist-${candidate.id}`}
                                        >
                                            <Star size={13} fill="var(--accent-amber)" color="var(--accent-amber)" />
                                            <X size={11} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Message to HM */}
                        <div className="card" style={{ padding: 22, marginBottom: 18 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <Edit3 size={14} color="var(--text-muted)" />
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Message to Hiring Manager (optional)</span>
                            </div>
                            <textarea
                                className="input-field"
                                placeholder="Add context, your assessment, or recommended next steps..."
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                style={{ minHeight: 88, fontSize: 13 }}
                                id="hm-message-input"
                            />
                        </div>

                        {/* Governance Note */}
                        <div style={{
                            padding: '12px 16px', borderRadius: 10, marginBottom: 20,
                            background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                            fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6,
                        }}>
                            <strong style={{ color: 'var(--text-secondary)' }}>Governance notice:</strong> This shortlist is a recruiter recommendation only. The Hiring Manager retains full authority over all hiring decisions. AI scores are informational only.
                        </div>

                        {/* Send CTA */}
                        {!confirmOpen ? (
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    className="btn-primary"
                                    onClick={() => setConfirmOpen(true)}
                                    style={{ fontSize: 14, padding: '12px 26px' }}
                                    id="send-shortlist-btn"
                                >
                                    <Send size={15} />
                                    Send to Hiring Manager
                                </button>
                            </div>
                        ) : (
                            <div style={{
                                padding: '20px 22px', borderRadius: 12,
                                background: 'var(--bg-card)', border: '1px solid var(--border-glow)',
                            }}>
                                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Confirm submission?</p>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 18 }}>
                                    {shortlisted.length} candidate{shortlisted.length !== 1 ? 's' : ''} will be sent for Hiring Manager Review. Continue?
                                </p>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button className="btn-primary" onClick={handleSend} style={{ flex: 1 }} id="confirm-send-btn">
                                        <Send size={14} /> Yes, Send Now
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
