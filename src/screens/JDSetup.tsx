// src/screens/JDSetup.tsx
import { useState } from 'react';
import { ArrowRight, Plus, X, Sparkles, Briefcase, MapPin, Clock } from 'lucide-react';
import type { JobDescription } from '../types';
import { mockJD } from '../mockData';



const DEPARTMENTS = ['Engineering', 'Product', 'Data Science', 'Design', 'Marketing', 'Sales', 'HR', 'Finance'];
const LOCATIONS = ['Remote', 'Bangalore, India', 'Mumbai, India', 'Hyderabad, India', 'Chennai, India', 'Pune, India', 'Delhi NCR'];

export default function JDSetup({ onNext, initialJd }: { onNext: (jd: JobDescription) => void; initialJd?: JobDescription }) {
    const [jd, setJd] = useState<JobDescription>(initialJd || {
        ...mockJD,
        id: `jd-${Date.now()}`,
        status: 'Open',
        createdAt: new Date().toISOString()
    });
    const [newSkill, setNewSkill] = useState('');
    const [newNice, setNewNice] = useState('');

    const handleAutoExtract = () => {
        const commonSkills = ['React', 'Node.js', 'TypeScript', 'SQL', 'PostgreSQL', 'AWS', 'Docker', 'Python', 'Go', 'System Design'];
        const found = commonSkills.filter(s => jd.description.toLowerCase().includes(s.toLowerCase()));

        if (found.length > 0) {
            setJd(prev => ({
                ...prev,
                mustHaveSkills: Array.from(new Set([...prev.mustHaveSkills, ...found.slice(0, 3)])),
                niceToHave: Array.from(new Set([...prev.niceToHave, ...found.slice(3, 5)]))
            }));
        }
    };

    const addMustHave = () => {
        if (newSkill.trim() && !jd.mustHaveSkills.includes(newSkill.trim())) {
            setJd(prev => ({ ...prev, mustHaveSkills: [...prev.mustHaveSkills, newSkill.trim()] }));
            setNewSkill('');
        }
    };

    const removeMustHave = (skill: string) => {
        setJd(prev => ({ ...prev, mustHaveSkills: prev.mustHaveSkills.filter(s => s !== skill) }));
    };

    const addNiceToHave = () => {
        if (newNice.trim() && !jd.niceToHave.includes(newNice.trim())) {
            setJd(prev => ({ ...prev, niceToHave: [...prev.niceToHave, newNice.trim()] }));
            setNewNice('');
        }
    };

    const removeNiceToHave = (skill: string) => {
        setJd(prev => ({ ...prev, niceToHave: prev.niceToHave.filter(s => s !== skill) }));
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', padding: '48px 32px' }}>
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 48 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{
                            padding: '6px 12px', borderRadius: 100,
                            background: 'var(--accent-purple-dim)',
                            border: '1px solid hsla(262,83%,68%,0.2)',
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                            <Sparkles size={12} color="var(--accent-purple)" />
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-purple)' }}>Step 1 of 5</span>
                        </div>
                    </div>
                    <h1 style={{ fontSize: 36, marginBottom: 10, letterSpacing: '-0.03em' }}>
                        Set Up Job Description
                    </h1>
                    <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 560 }}>
                        Define the role requirements. The AI will use this to score and rank incoming candidates.
                    </p>
                </div>

                <div style={{ display: 'grid', gap: 24 }}>
                    {/* Role Info Card */}
                    <div className="card" style={{ padding: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                            <Briefcase size={16} color="var(--accent-purple)" />
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Role Details</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div>
                                <label className="form-label">Job Title *</label>
                                <input
                                    className="input-field"
                                    value={jd.title}
                                    onChange={e => setJd(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="e.g. Senior Full-Stack Engineer"
                                    id="jd-title"
                                />
                            </div>
                            <div>
                                <label className="form-label">Department</label>
                                <select
                                    className="input-field"
                                    value={jd.department}
                                    onChange={e => setJd(prev => ({ ...prev, department: e.target.value }))}
                                    id="jd-department"
                                >
                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">
                                    <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
                                    Location
                                </label>
                                <select
                                    className="input-field"
                                    value={jd.location}
                                    onChange={e => setJd(prev => ({ ...prev, location: e.target.value }))}
                                    id="jd-location"
                                >
                                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="form-label">
                                    <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                                    Experience Range (Years)
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <input
                                        className="input-field"
                                        type="number"
                                        value={jd.experienceMin}
                                        onChange={e => setJd(prev => ({ ...prev, experienceMin: Number(e.target.value) }))}
                                        placeholder="Minimum"
                                        id="jd-exp-min"
                                    />
                                    <input
                                        className="input-field"
                                        type="number"
                                        value={jd.experienceMax}
                                        onChange={e => setJd(prev => ({ ...prev, experienceMax: Number(e.target.value) }))}
                                        placeholder="Maximum"
                                        id="jd-exp-max"
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <label className="form-label" style={{ marginBottom: 0 }}>Job Description *</label>
                                <button
                                    className="btn-ghost"
                                    onClick={handleAutoExtract}
                                    style={{ fontSize: 11, color: 'var(--accent-purple)', fontWeight: 700 }}
                                    id="magic-extract-btn"
                                >
                                    <Sparkles size={12} /> Auto-Extract Skills (AI)
                                </button>
                            </div>
                            <textarea
                                className="input-field"
                                value={jd.description}
                                onChange={e => setJd(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe the role, responsibilities, and team context..."
                                style={{ minHeight: 140 }}
                                id="jd-description"
                            />
                        </div>
                    </div>

                    {/* Must-Have Skills */}
                    <div className="card" style={{ padding: 28 }}>
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Must-Have Skills</span>
                                <span style={{
                                    padding: '2px 8px', borderRadius: 100,
                                    background: 'var(--low-bg)', color: 'var(--low-text)',
                                    fontSize: 10, fontWeight: 700,
                                    border: '1px solid var(--low-border)',
                                }}>GATE CRITERIA</span>
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                Candidates missing any of these will be flagged with a violation warning.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                            {jd.mustHaveSkills.map(skill => (
                                <div key={skill} style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '6px 12px',
                                    background: 'var(--low-bg)',
                                    border: '1px solid var(--low-border)',
                                    borderRadius: 100, fontSize: 13, fontWeight: 500,
                                    color: 'var(--low-text)',
                                }}>
                                    {skill}
                                    <button onClick={() => removeMustHave(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: 'var(--low-text)', opacity: 0.7 }}>
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <input
                                className="input-field"
                                style={{ flex: 1 }}
                                value={newSkill}
                                onChange={e => setNewSkill(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addMustHave()}
                                placeholder="Add must-have skill..."
                                id="jd-must-have-input"
                            />
                            <button className="btn-secondary" onClick={addMustHave} style={{ padding: '12px 16px' }} id="jd-add-must-have-btn">
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Nice-to-Have */}
                    <div className="card" style={{ padding: 28 }}>
                        <div style={{ marginBottom: 20 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nice-to-Have Skills</span>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                                Bonus points but not disqualifying.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                            {jd.niceToHave.map(skill => (
                                <div key={skill} style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '6px 12px',
                                    background: 'var(--accent-purple-dim)',
                                    border: '1px solid hsla(262,83%,68%,0.2)',
                                    borderRadius: 100, fontSize: 13, fontWeight: 500,
                                    color: 'var(--accent-purple)',
                                }}>
                                    {skill}
                                    <button onClick={() => removeNiceToHave(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: 'var(--accent-purple)', opacity: 0.7 }}>
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <input
                                className="input-field"
                                style={{ flex: 1 }}
                                value={newNice}
                                onChange={e => setNewNice(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && addNiceToHave()}
                                placeholder="Add nice-to-have skill..."
                                id="jd-nice-to-have-input"
                            />
                            <button className="btn-secondary" onClick={addNiceToHave} style={{ padding: '12px 16px' }} id="jd-add-nice-btn">
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Footer CTA */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
                        <button
                            className="btn-primary"
                            onClick={() => onNext(jd)}
                            disabled={!jd.title.trim() || jd.mustHaveSkills.length === 0}
                            style={{ fontSize: 15, padding: '14px 28px' }}
                            id="jd-next-btn"
                        >
                            Continue to Upload CVs
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
