// src/components/CandidateCard.tsx
import { MapPin, Briefcase, Clock, AlertTriangle, Star, ChevronRight } from 'lucide-react';
import ScoreRing from './ScoreRing';
import type { Candidate } from '../types';

interface CandidateCardProps {
    candidate: Candidate;
    onClick: () => void;
    onToggleShortlist: (id: string) => void;
    rank?: number;
}

const bucketLabel: Record<string, string> = {
    strong: 'Strong',
    potential: 'Potential',
    low: 'Low Match',
};

export default function CandidateCard({ candidate, onClick, onToggleShortlist, rank }: CandidateCardProps) {
    const activeBucket = candidate.overriddenBucket ?? candidate.bucket;

    return (
        <div
            className="card"
            style={{
                padding: 20,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.25s ease',
            }}
            onClick={onClick}
            id={`candidate-card-${candidate.id}`}
        >
            {/* Override indicator */}
            {candidate.overriddenBucket && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    height: 3,
                    background: 'linear-gradient(90deg, var(--accent-amber), hsl(50, 95%, 60%))',
                }} />
            )}

            {/* Shortlist star */}
            <button
                onClick={e => { e.stopPropagation(); onToggleShortlist(candidate.id); }}
                style={{
                    position: 'absolute', top: 14, right: 14,
                    background: candidate.isShortlisted ? 'hsla(38,95%,62%,0.15)' : 'transparent',
                    border: `1px solid ${candidate.isShortlisted ? 'var(--potential-border)' : 'transparent'}`,
                    borderRadius: 8,
                    padding: '4px 6px',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease',
                }}
                id={`shortlist-btn-${candidate.id}`}
            >
                <Star
                    size={15}
                    fill={candidate.isShortlisted ? 'var(--potential-text)' : 'none'}
                    color={candidate.isShortlisted ? 'var(--potential-text)' : 'var(--text-muted)'}
                />
            </button>

            {/* Top: Score ring + name */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14, paddingRight: 28 }}>
                <div style={{ position: 'relative' }}>
                    <ScoreRing score={candidate.compositeScore} size={60} strokeWidth={6} showLabel={false} />
                    {rank && (
                        <div style={{
                            position: 'absolute', top: -5, left: -5,
                            width: 20, height: 20, borderRadius: '50%',
                            background: 'var(--accent-purple)', color: 'white',
                            fontSize: 10, fontWeight: 800,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '2px solid var(--bg-card)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}>
                            {rank}
                        </div>
                    )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{candidate.name}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {candidate.currentRole} · {candidate.currentCompany}
                    </p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span className={`badge badge-${activeBucket}`}>{bucketLabel[activeBucket]}</span>
                        {candidate.overriddenBucket && (
                            <span style={{
                                fontSize: 10, padding: '3px 8px', borderRadius: 100,
                                background: 'hsla(38,95%,62%,0.1)', color: 'var(--accent-amber)',
                                border: '1px solid hsla(38,95%,62%,0.2)', fontWeight: 600,
                            }}>Overridden</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Meta row */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--text-muted)' }}>
                    <Clock size={11} /> {candidate.yearsOfExperience}y exp
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--text-muted)' }}>
                    <MapPin size={11} /> {candidate.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--text-muted)' }}>
                    <Briefcase size={11} /> {candidate.education}
                </span>
            </div>

            {/* Skills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
                {candidate.skills.slice(0, 4).map(skill => (
                    <span key={skill} className="tag" style={{ fontSize: 11, padding: '3px 8px' }}>{skill}</span>
                ))}
                {candidate.skills.length > 4 && (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', padding: '3px 4px' }}>+{candidate.skills.length - 4}</span>
                )}
            </div>

            {/* Violations */}
            {candidate.mustHaveViolations.length > 0 && (
                <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 6,
                    padding: '8px 10px', borderRadius: 8,
                    background: 'var(--low-bg)', border: '1px solid var(--low-border)',
                    marginBottom: 12,
                }}>
                    <AlertTriangle size={12} color="var(--low-text)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 11, color: 'var(--low-text)', lineHeight: 1.4 }}>
                        {candidate.mustHaveViolations[0]}{candidate.mustHaveViolations.length > 1 ? ` +${candidate.mustHaveViolations.length - 1} more` : ''}
                    </span>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, color: 'var(--text-muted)' }}>
                <span style={{ fontSize: 11, fontWeight: 500 }}>View Details</span>
                <ChevronRight size={13} />
            </div>
        </div>
    );
}
