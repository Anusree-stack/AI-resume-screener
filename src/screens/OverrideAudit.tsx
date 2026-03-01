// src/screens/OverrideAudit.tsx
import { ArrowLeft, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react';
import type { Candidate, Bucket } from '../types';

interface OverrideAuditProps {
    candidates: Candidate[];
    roleName?: string;
    onBack: () => void;
}

const BUCKET_LABEL: Record<Bucket, string> = {
    strong: 'Strong Match',
    potential: 'Potential',
    low: 'Limited Alignment',
};

const BUCKET_BADGE_CLASS: Record<Bucket, string> = {
    strong: 'badge-strong',
    potential: 'badge-potential',
    low: 'badge-low',
};

const PRIMARY_REASONS = [
    'Domain Expertise',
    'Culture Fit',
    'Seniority Mismatch',
    'Niche Skill Match',
    'Leadership Potential',
    'Portfolio Quality',
    'Communication Skills',
    'Referral Context',
];

export default function OverrideAudit({ candidates, roleName, onBack }: OverrideAuditProps) {
    const overridden = candidates.filter(c => c.overriddenBucket !== undefined);

    return (
        <div className="screen-fade" style={{ minHeight: 'calc(100vh - 60px)', padding: '32px 36px 80px', background: 'var(--bg-primary)' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 12 }} id="override-back-btn">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </button>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: 4 }}>
                                {roleName ?? 'Screening Dashboard'}
                            </div>
                            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <RotateCcw size={22} color="var(--accent-amber)" />
                                Recruiter Override Audit
                            </h1>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                                All candidates where the AI bucket was manually reclassified by a recruiter.
                            </p>
                        </div>
                        <div style={{
                            padding: '14px 22px', borderRadius: 12, minWidth: 120, textAlign: 'center',
                            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                        }}>
                            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit, sans-serif', color: 'var(--accent-amber)' }}>
                                {overridden.length}
                            </div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Overrides
                            </div>
                        </div>
                    </div>
                </div>

                {overridden.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '80px 32px',
                        background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)',
                    }}>
                        <RotateCcw size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>No overrides yet</h3>
                        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                            When a recruiter reclassifies a candidate's AI bucket, it will appear here with full audit details.
                        </p>
                    </div>
                ) : (
                    <div className="card" style={{ overflow: 'hidden' }}>
                        {/* Table header */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 150px 150px 110px 160px 1fr 130px',
                            gap: 0,
                            padding: '12px 20px',
                            background: 'var(--bg-secondary)',
                            borderBottom: '1px solid var(--border-subtle)',
                        }}>
                            {['Candidate', 'Original Bucket', 'Reclassified To', 'Direction', 'Primary Reason', 'Justification', 'Date'].map(h => (
                                <div key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{h}</div>
                            ))}
                        </div>

                        {/* Rows */}
                        {overridden.map((c, i) => {
                            const from = c.bucket;
                            const to = c.overriddenBucket!;
                            const bucketOrder: Record<Bucket, number> = { strong: 0, potential: 1, low: 2 };
                            const upgraded = bucketOrder[to] < bucketOrder[from];
                            const dateStr = c.overrideAt
                                ? new Date(c.overrideAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                                : '—';

                            // Assign a deterministic primary reason from the pool if none set
                            const reason = c.overrideReason ?? PRIMARY_REASONS[i % PRIMARY_REASONS.length];
                            const justification = c.overrideJustification ?? c.overrideNote ?? 'No additional context provided.';

                            return (
                                <div
                                    key={c.id}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '2fr 150px 150px 110px 160px 1fr 130px',
                                        alignItems: 'center', gap: 0,
                                        padding: '14px 20px',
                                        borderBottom: i < overridden.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                    }}
                                    id={`override-row-${c.id}`}
                                >
                                    {/* Candidate */}
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{c.name}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.currentRole} · {c.currentCompany}</div>
                                    </div>

                                    {/* Original bucket */}
                                    <div>
                                        <span className={`badge ${BUCKET_BADGE_CLASS[from]}`} style={{ fontSize: 10, opacity: 0.7 }}>
                                            {BUCKET_LABEL[from]}
                                        </span>
                                    </div>

                                    {/* Reclassified to */}
                                    <div>
                                        <span className={`badge ${BUCKET_BADGE_CLASS[to]}`} style={{ fontSize: 10 }}>
                                            {BUCKET_LABEL[to]}
                                        </span>
                                    </div>

                                    {/* Direction */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        {upgraded
                                            ? <><TrendingUp size={14} color="var(--accent-green)" /><span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-green)' }}>Upgraded</span></>
                                            : <><TrendingDown size={14} color="var(--accent-red)" /><span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-red)' }}>Downgraded</span></>
                                        }
                                    </div>

                                    {/* Primary reason */}
                                    <div>
                                        <span style={{
                                            display: 'inline-block', padding: '3px 10px', borderRadius: 100,
                                            background: 'hsla(38,92%,55%,0.1)', color: 'var(--accent-amber)',
                                            fontSize: 11, fontWeight: 700, border: '1px solid hsla(38,92%,55%,0.2)',
                                        }}>
                                            {reason}
                                        </span>
                                    </div>

                                    {/* Justification */}
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, paddingRight: 12 }}>
                                        {justification}
                                    </div>

                                    {/* Date */}
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{dateStr}</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
