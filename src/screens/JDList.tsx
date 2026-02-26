// src/screens/JDList.tsx
import { Briefcase, MapPin, Calendar, ArrowRight, Plus } from 'lucide-react';
import type { JobDescription } from '../types';

interface JDListProps {
    jds: JobDescription[];
    onSelect: (jd: JobDescription) => void;
    onCreateNew: () => void;
}

export default function JDList({ jds, onSelect, onCreateNew }: JDListProps) {
    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', padding: '48px 32px' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                    <div>
                        <h1 style={{ fontSize: 32, marginBottom: 8 }}>Job Descriptions</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Select an active JD to screen resumes or create a new one.</p>
                    </div>
                    <button className="btn-primary" onClick={onCreateNew}>
                        <Plus size={18} /> Create New JD
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 20 }}>
                    {jds.map(jd => (
                        <div
                            key={jd.id}
                            className="card"
                            style={{
                                padding: 24, cursor: 'pointer', transition: 'transform 0.2s',
                                border: '1px solid var(--border-subtle)',
                            }}
                            onClick={() => onSelect(jd)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{jd.title}</h3>
                                <span className={`badge badge-${jd.status.toLowerCase()}`}>
                                    {jd.status}
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-muted)' }}>
                                    <Briefcase size={14} /> {jd.department}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-muted)' }}>
                                    <MapPin size={14} /> {jd.location}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-muted)' }}>
                                    <Calendar size={14} /> {new Date(jd.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
                                {jd.mustHaveSkills.slice(0, 3).map(s => (
                                    <span key={s} className="tag" style={{ fontSize: 11 }}>{s}</span>
                                ))}
                                {jd.mustHaveSkills.length > 3 && (
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>+{jd.mustHaveSkills.length - 3} move</span>
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--accent-purple)', fontSize: 14, fontWeight: 600, gap: 4 }}>
                                Screen Resumes <ArrowRight size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
