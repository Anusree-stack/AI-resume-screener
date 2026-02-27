// src/screens/JDSetup.tsx
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Plus, X, Sparkles, Briefcase, MapPin, Clock } from 'lucide-react';
import type { JobDescription } from '../types';
import { mockJD } from '../mockData';

// Skills Repository — comprehensive master list
const SKILLS_REPO = [
    'JavaScript', 'TypeScript', 'React', 'React Native', 'Vue.js', 'Angular', 'Next.js', 'Node.js',
    'Express.js', 'NestJS', 'Python', 'Django', 'FastAPI', 'Flask', 'Go', 'Golang', 'Java', 'Spring Boot',
    'Kotlin', 'Swift', 'C++', 'C#', '.NET', 'Ruby on Rails', 'PHP', 'Laravel',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB', 'SQLite',
    'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'GitHub Actions', 'Jenkins',
    'Microservices', 'REST API', 'GraphQL', 'gRPC', 'WebSockets', 'System Design', 'Architecture',
    'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy',
    'SQL', 'Data Analysis', 'Power BI', 'Tableau', 'Apache Spark', 'Airflow', 'dbt',
    'React Query', 'Redux', 'Zustand', 'Tailwind CSS', 'CSS', 'SASS', 'Webpack', 'Vite',
    'Agile', 'Scrum', 'Product Strategy', 'Roadmapping', 'User Research', 'A/B Testing',
    'Team Leadership', 'People Management', 'Cross-functional Collaboration',
    'Communication', 'Problem Solving', 'Critical Thinking',
];

const DEPARTMENTS = ['Engineering', 'Product', 'Data Science', 'Design', 'Analytics', 'Marketing', 'Sales', 'HR', 'Finance', 'Infrastructure'];
const LOCATIONS = ['Remote', 'Bangalore, India', 'Mumbai, India', 'Hyderabad, India', 'Chennai, India', 'Pune, India', 'Delhi NCR'];

interface JDSetupProps {
    onSave: (jd: JobDescription, action: 'draft' | 'publish' | 'upload') => void;
    initialJd?: JobDescription;
}

function SkillInput({
    placeholder,
    onAdd,
    id,
}: {
    placeholder: string;
    onAdd: (skill: string) => void;
    id: string;
}) {
    const [input, setInput] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleInput = (val: string) => {
        setInput(val);
        if (val.trim().length > 0) {
            const filtered = SKILLS_REPO.filter(s =>
                s.toLowerCase().includes(val.toLowerCase())
            ).slice(0, 8);
            setSuggestions(filtered);
            setOpen(filtered.length > 0);
        } else {
            setOpen(false);
        }
    };

    const commit = (skill: string) => {
        const cleaned = skill.trim();
        if (cleaned) {
            onAdd(cleaned);
            setInput('');
            setOpen(false);
        }
    };

    return (
        <div ref={ref} style={{ position: 'relative', flex: 1 }}>
            <div style={{ display: 'flex', gap: 8 }}>
                <input
                    id={id}
                    className="input-field"
                    value={input}
                    onChange={e => handleInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && commit(input)}
                    placeholder={placeholder}
                    autoComplete="off"
                    style={{ flex: 1 }}
                />
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => commit(input)}
                    style={{ padding: '10px 14px' }}
                >
                    <Plus size={16} />
                </button>
            </div>
            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 40,
                    background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                    borderRadius: 8, boxShadow: 'var(--shadow-md)', zIndex: 50,
                    maxHeight: 220, overflowY: 'auto',
                }}>
                    {suggestions.map(s => (
                        <button
                            key={s}
                            type="button"
                            onMouseDown={() => commit(s)}
                            style={{
                                display: 'block', width: '100%', textAlign: 'left',
                                padding: '8px 14px', background: 'none', border: 'none',
                                cursor: 'pointer', fontSize: 13, color: 'var(--text-primary)',
                                fontFamily: 'Inter, sans-serif',
                                transition: 'background 80ms',
                            }}
                            onMouseOver={e => (e.currentTarget.style.background = 'var(--accent-purple-dim)')}
                            onMouseOut={e => (e.currentTarget.style.background = 'none')}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function SkillTag({ label, onRemove, variant }: { label: string; onRemove: () => void; variant: 'must' | 'nice' }) {
    const style = variant === 'must'
        ? { bg: 'var(--accent-purple-dim)', color: 'var(--accent-purple)', border: 'hsla(262,72%,52%,0.2)' }
        : { bg: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: 'var(--border-subtle)' };
    return (
        <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 100,
            background: style.bg, border: `1px solid ${style.border}`,
            fontSize: 12.5, fontWeight: 500, color: style.color,
        }}>
            {label}
            <button
                onClick={onRemove}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: 'inherit', opacity: 0.6, lineHeight: 1 }}
            >
                <X size={11} />
            </button>
        </div>
    );
}

export default function JDSetup({ onSave, initialJd }: JDSetupProps) {
    const [jd, setJd] = useState<JobDescription>(initialJd || {
        ...mockJD,
        id: `jd-${Date.now()}`,
        status: 'Draft' as const,
        createdAt: new Date().toISOString(),
    });

    const [extracting, setExtracting] = useState(false);

    const extractSkills = () => {
        if (!jd.description.trim()) return;
        setExtracting(true);

        // Simulate AI extraction delay
        setTimeout(() => {
            const descLower = jd.description.toLowerCase();
            const found = SKILLS_REPO.filter(s => descLower.includes(s.toLowerCase()));

            // Heuristic for Demo: first 60% are must-have, rest nice-to-have
            const mid = Math.ceil(found.length * 0.6);
            const mustHave = found.slice(0, mid);
            const nice = found.slice(mid);

            // Default fallback if nothing found but description exists
            const fallbackMust = found.length === 0 ? ['Communication', 'Team Leadership'] : mustHave;

            setJd(prev => ({
                ...prev,
                mustHaveSkills: Array.from(new Set([...prev.mustHaveSkills, ...fallbackMust])),
                niceToHave: Array.from(new Set([...prev.niceToHave, ...nice])),
            }));
            setExtracting(false);
        }, 1200);
    };

    const addMust = (skill: string) => {
        if (!jd.mustHaveSkills.includes(skill)) setJd(prev => ({ ...prev, mustHaveSkills: [...prev.mustHaveSkills, skill] }));
    };
    const addNice = (skill: string) => {
        if (!jd.niceToHave.includes(skill)) setJd(prev => ({ ...prev, niceToHave: [...prev.niceToHave, skill] }));
    };
    const removeMust = (s: string) => setJd(prev => ({ ...prev, mustHaveSkills: prev.mustHaveSkills.filter(x => x !== s) }));
    const removeNice = (s: string) => setJd(prev => ({ ...prev, niceToHave: prev.niceToHave.filter(x => x !== s) }));

    const canPublish = jd.title.trim() && jd.mustHaveSkills.length > 0;

    const sectionCard: React.CSSProperties = {
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
        padding: '24px 28px',
        marginBottom: 20,
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 60px)', padding: '40px 40px 120px', background: 'var(--bg-primary)' }}>
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 36 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
                        {initialJd ? 'Edit Job Description' : 'Create Job Description'}
                    </h1>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                        Define role requirements. The AI will use this to score and rank incoming candidates.
                    </p>
                </div>

                {/* Role Details */}
                <div style={sectionCard}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <Briefcase size={15} color="var(--accent-purple)" />
                        <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>Role Details</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                        <div>
                            <label className="form-label">Job Title *</label>
                            <input className="input-field" value={jd.title} onChange={e => setJd(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Senior Full-Stack Engineer" id="jd-title" />
                        </div>
                        <div>
                            <label className="form-label">Department</label>
                            <select className="input-field" value={jd.department} onChange={e => setJd(p => ({ ...p, department: e.target.value }))} id="jd-dept">
                                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="form-label"><MapPin size={11} style={{ display: 'inline', marginRight: 4 }} />Location</label>
                            <select className="input-field" value={jd.location} onChange={e => setJd(p => ({ ...p, location: e.target.value }))} id="jd-location">
                                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="form-label"><Clock size={11} style={{ display: 'inline', marginRight: 4 }} />Experience (Years)</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                <input className="input-field" type="number" value={jd.experienceMin} onChange={e => setJd(p => ({ ...p, experienceMin: Number(e.target.value) }))} placeholder="Min" id="jd-exp-min" />
                                <input className="input-field" type="number" value={jd.experienceMax} onChange={e => setJd(p => ({ ...p, experienceMax: Number(e.target.value) }))} placeholder="Max" id="jd-exp-max" />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <label className="form-label" style={{ marginBottom: 0 }}>Job Description *</label>
                            <button
                                type="button"
                                onClick={extractSkills}
                                disabled={extracting || !jd.description.trim()}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '6px 14px', borderRadius: 7, border: '1px solid var(--border-glow)',
                                    background: extracting ? 'var(--bg-secondary)' : 'var(--accent-purple-dim)',
                                    color: extracting ? 'var(--text-muted)' : 'var(--accent-purple)',
                                    fontSize: 12, fontWeight: 600, cursor: extracting ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif',
                                    transition: 'all 0.2s ease',
                                }}
                                id="auto-extract-btn"
                            >
                                <Sparkles size={13} style={{ animation: extracting ? 'spin 1s linear infinite' : 'none' }} />
                                {extracting ? 'Extracting Skills...' : 'Auto-Extract Skills with AI'}
                            </button>
                        </div>
                        <textarea
                            className="input-field"
                            value={jd.description}
                            onChange={e => setJd(p => ({ ...p, description: e.target.value }))}
                            placeholder="Describe the role, responsibilities, and team context. Paste the full JD for best AI extraction results."
                            style={{ minHeight: 150 }}
                            id="jd-description"
                        />
                    </div>
                </div>

                {/* Must-Have Skills */}
                <div style={sectionCard}>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>Must-Have Skills</span>
                            <span style={{
                                padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                                background: 'var(--low-bg)', color: 'var(--low-text)', border: '1px solid var(--low-border)',
                            }}>Required</span>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Candidates missing any of these will be flagged during screening.</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16, minHeight: 36 }}>
                        {jd.mustHaveSkills.map(s => <SkillTag key={s} label={s} onRemove={() => removeMust(s)} variant="must" />)}
                        {jd.mustHaveSkills.length === 0 && <span style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>No skills added yet. Type below or use Auto-Extract.</span>}
                    </div>
                    <SkillInput placeholder="Add must-have skill (type to search repository)..." onAdd={addMust} id="must-have-input" />
                </div>

                {/* Nice-to-Have Skills */}
                <div style={sectionCard}>
                    <div style={{ marginBottom: 16 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>Nice-to-Have Skills</span>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>Bonus points — not disqualifying.</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16, minHeight: 36 }}>
                        {jd.niceToHave.map(s => <SkillTag key={s} label={s} onRemove={() => removeNice(s)} variant="nice" />)}
                        {jd.niceToHave.length === 0 && <span style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>No skills added yet.</span>}
                    </div>
                    <SkillInput placeholder="Add nice-to-have skill (type to search repository)..." onAdd={addNice} id="nice-to-have-input" />
                </div>
            </div>

            {/* Sticky Footer CTAs */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: 'var(--bg-card)',
                borderTop: '1px solid var(--border-subtle)',
                padding: '16px 40px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                zIndex: 50,
                backdropFilter: 'blur(12px)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 13 }}>
                    <ArrowLeft size={14} />
                    <span>Creating a new role</span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    {/* Save as Draft */}
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => onSave({ ...jd, status: 'Draft' }, 'draft')}
                        disabled={!jd.title.trim()}
                        style={{ fontSize: 13 }}
                        id="save-draft-btn"
                    >
                        Save as Draft
                    </button>
                    {/* Save & Publish */}
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => onSave({ ...jd, status: 'Live – Accepting Applications' }, 'publish')}
                        disabled={!canPublish}
                        style={{ fontSize: 13, borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }}
                        id="save-publish-btn"
                    >
                        Save & Publish
                    </button>
                    {/* Upload CV */}
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={() => onSave({ ...jd, status: 'Screening in Progress' }, 'upload')}
                        disabled={!canPublish}
                        style={{ fontSize: 13 }}
                        id="save-upload-btn"
                    >
                        Upload CVs for Screening
                        <Sparkles size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
