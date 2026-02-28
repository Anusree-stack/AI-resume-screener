// src/screens/Home.tsx
import { useMemo, useState } from 'react';
import { Clock, Layers, Briefcase, CheckCircle, Search, Filter } from 'lucide-react';
import type { JobDescription, AppScreen, LifecycleStage } from '../types';
import Footer from '../components/Footer';

interface HomeProps {
    jds: JobDescription[];
    onNavigate: (screen: AppScreen, jd?: JobDescription) => void;
}

const LIFECYCLE_PRIORITY: Record<LifecycleStage, number> = {
    'Screening in Progress': 0,
    'Live – Accepting Applications': 1,
    'Interview': 2,
    'Offer Extended': 3,
    'Draft': 4,
    'Offer Closed': 5,
};

const STAGE_BADGE_CLASS: Record<LifecycleStage, string> = {
    'Draft': 'stage-badge stage-draft',
    'Live – Accepting Applications': 'stage-badge stage-live',
    'Screening in Progress': 'stage-badge stage-screening',
    'Interview': 'stage-badge stage-interview',
    'Offer Extended': 'stage-badge stage-offer',
    'Offer Closed': 'stage-badge stage-closed',
};

const STAGE_DISPLAY: Record<LifecycleStage, string> = {
    'Draft': 'Draft',
    'Live – Accepting Applications': 'Live',
    'Screening in Progress': 'Screening',
    'Interview': 'Interview',
    'Offer Extended': 'Offer Extended',
    'Offer Closed': 'Closed',
};

const STAGE_CTA: Record<LifecycleStage, { label: string; screen: AppScreen }> = {
    'Draft': { label: 'Edit JD', screen: 'jd-setup' },
    'Live – Accepting Applications': { label: 'Import CVs', screen: 'cv-upload' },
    'Screening in Progress': { label: 'Open Dashboard', screen: 'dashboard' },
    'Interview': { label: 'View Candidates', screen: 'dashboard' },
    'Offer Extended': { label: 'View Status', screen: 'dashboard' },
    'Offer Closed': { label: 'View Archive', screen: 'dashboard' },
};

const ALL_DEPARTMENTS = ['All Departments', 'Engineering', 'Product', 'Data Science', 'Analytics', 'Infrastructure', 'Design', 'Marketing', 'Sales', 'HR', 'Finance'];
const ALL_LOCATIONS = ['All Locations', 'Remote', 'Bangalore', 'Mumbai', 'Hyderabad', 'Chennai', 'Pune', 'Delhi NCR'];
const ALL_STAGES: (LifecycleStage | '')[] = ['', 'Draft', 'Live – Accepting Applications', 'Screening in Progress', 'Interview', 'Offer Extended', 'Offer Closed'];
const STAGE_FILTER_LABELS: Record<string, string> = {
    '': 'All Stages',
    'Draft': 'Draft',
    'Live – Accepting Applications': 'Live',
    'Screening in Progress': 'Screening',
    'Interview': 'Interview',
    'Offer Extended': 'Offer Extended',
    'Offer Closed': 'Closed',
};

export default function Home({ jds, onNavigate }: HomeProps) {
    const [search, setSearch] = useState('');
    const [dept, setDept] = useState('All Departments');
    const [loc, setLoc] = useState('All Locations');
    const [stage, setStage] = useState<LifecycleStage | ''>('');

    const rolesInScreening = jds.filter(j => j.status === 'Screening in Progress').length;
    const openRoles = jds.filter(j => ['Live – Accepting Applications', 'Screening in Progress', 'Interview'].includes(j.status)).length;
    const rolesClosed = jds.filter(j => j.status === 'Offer Closed').length;

    const metrics = [
        {
            icon: <Clock size={16} />,
            label: 'Avg Time to Shortlist',
            value: '4.2d',
            sub: '7-Day Avg',
            trend: { val: '70%', down: true, label: 'vs prev week' }
        },
        {
            icon: <Briefcase size={16} />,
            label: 'Open for Application',
            value: openRoles,
            sub: 'Current'
        },
        {
            icon: <Layers size={16} />,
            label: 'Roles in Screening',
            value: rolesInScreening,
            sub: 'Current'
        },
        {
            icon: <Search size={16} />,
            label: 'Resumes Screened / Day',
            value: '128',
            sub: '7-Day Avg',
            trend: { val: '20%', down: false, label: 'vs prev week' }
        },
        {
            icon: <CheckCircle size={16} />,
            label: 'Roles Closed',
            value: rolesClosed,
            sub: 'Last 30 days'
        },
    ];

    const filtered = useMemo(() => {
        return [...jds]
            .filter(j => {
                const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.department.toLowerCase().includes(search.toLowerCase());
                const matchDept = dept === 'All Departments' || j.department === dept;
                const matchLoc = loc === 'All Locations' || j.location.includes(loc);
                const matchStage = !stage || j.status === stage;
                return matchSearch && matchDept && matchLoc && matchStage;
            })
            .sort((a, b) => (LIFECYCLE_PRIORITY[a.status] ?? 99) - (LIFECYCLE_PRIORITY[b.status] ?? 99));
    }, [jds, search, dept, loc, stage]);

    const handleRowCTA = (jd: JobDescription) => {
        const cta = STAGE_CTA[jd.status];
        onNavigate(cta.screen, jd);
    };

    const selectStyle: React.CSSProperties = {
        padding: '8px 32px 8px 12px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        color: 'var(--text-primary)',
        fontSize: 13,
        fontFamily: 'Inter, sans-serif',
        outline: 'none',
        cursor: 'pointer',
        appearance: 'none' as const,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
    };

    return (
        <div className="screen-fade" style={{ minHeight: 'calc(100vh - 60px)', padding: '36px 40px 80px', background: 'var(--bg-primary)' }}>
            <div style={{ maxWidth: 1240, margin: '0 auto' }}>

                {/* Page Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.03em' }}>Recruiter Overview</h1>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Operational awareness and active pipeline management.</p>
                </div>

                {/* Metric Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 36 }}>
                    {metrics.map(m => (
                        <div key={m.label} className="card metric-card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12, color: 'var(--text-muted)' }}>
                                    <div style={{ color: 'var(--accent-purple)' }}>{m.icon}</div>
                                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</span>
                                </div>
                                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--text-primary)', marginBottom: 6 }}>
                                    {m.value}
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{m.sub}</span>
                                    {m.trend && (
                                        <span style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            padding: '2px 6px',
                                            borderRadius: 4,
                                            background: m.trend.down ? 'hsla(0,100%,50%,0.08)' : 'hsla(145,100%,40%,0.08)',
                                            color: m.trend.down ? 'hsl(0,80%,55%)' : 'hsl(145,100%,35%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2
                                        }}>
                                            {m.trend.down ? '↓' : '↑'} {m.trend.val}
                                        </span>
                                    )}
                                </div>
                                {m.trend && <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 3 }}>{m.trend.label}</div>}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Roles Section */}
                <div className="card" style={{ overflow: 'hidden' }}>
                    {/* Filters bar */}
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', background: 'var(--bg-secondary)' }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search roles by title or department..."
                                style={{ width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid var(--border-subtle)', borderRadius: 8, fontSize: 13, background: 'var(--bg-card)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                                id="home-search"
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
                            <Filter size={13} />
                        </div>
                        <select value={dept} onChange={e => setDept(e.target.value)} style={{ ...selectStyle, minWidth: 140 }} id="home-dept-filter">
                            {ALL_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select value={loc} onChange={e => setLoc(e.target.value)} style={{ ...selectStyle, minWidth: 140 }} id="home-loc-filter">
                            {ALL_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <select value={stage} onChange={e => setStage(e.target.value as LifecycleStage | '')} style={{ ...selectStyle, minWidth: 130 }} id="home-stage-filter">
                            {ALL_STAGES.map(s => <option key={s} value={s}>{STAGE_FILTER_LABELS[s]}</option>)}
                        </select>
                        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                            {filtered.length} active roles
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-card)' }}>
                                    {[
                                        { label: 'Role', width: '22%' },
                                        { label: 'Department', width: '13%' },
                                        { label: 'Location', width: '13%' },
                                        { label: 'Stage', width: '10%' },
                                        { label: 'Apps', width: '10%', align: 'center' },
                                        { label: 'Strong', width: '10%', align: 'center' },
                                        { label: 'Days Open', width: '10%', align: 'center' },
                                        { label: 'Next Action', width: '12%', align: 'right' }
                                    ].map((col) => (
                                        <th key={col.label} style={{
                                            padding: '16px 24px',
                                            fontSize: 10.5, fontWeight: 700,
                                            color: 'var(--text-muted)',
                                            textAlign: col.align === 'center' ? 'center' : col.align === 'right' ? 'right' : 'left',
                                            textTransform: 'uppercase', letterSpacing: '0.08em',
                                            borderBottom: '1px solid var(--border-subtle)',
                                            width: col.width,
                                        }}>
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)', fontSize: 14, background: 'var(--bg-primary)' }}>No roles found matching your criteria.</td></tr>
                                ) : filtered.map((jd, i) => (
                                    <tr
                                        key={jd.id}
                                        className="table-row"
                                        style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                                    >
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{jd.title}</div>
                                            <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                                                Experience: {jd.experienceMin}–{jd.experienceMax}y
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px', fontSize: 13, color: 'var(--text-secondary)' }}>{jd.department}</td>
                                        <td style={{ padding: '20px 24px', fontSize: 13, color: 'var(--text-secondary)' }}>{jd.location}</td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <span className={STAGE_BADGE_CLASS[jd.status]} style={{ fontSize: 10.5, padding: '3px 8px' }}>
                                                {STAGE_DISPLAY[jd.status]}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px 24px', fontSize: 13, fontWeight: 700, textAlign: 'center', fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>
                                            {jd.applicationCount ?? '—'}
                                        </td>
                                        <td style={{ padding: '20px 24px', fontSize: 13, fontWeight: 700, color: 'var(--strong-text)', textAlign: 'center', fontFamily: 'Outfit, sans-serif' }}>
                                            {jd.strongCount ?? '—'}
                                        </td>
                                        <td style={{ padding: '20px 24px', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
                                            {jd.daysOpen != null ? `${jd.daysOpen}d` : '—'}
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                            <button
                                                className="btn-primary"
                                                style={{ fontSize: 12.5, padding: '9px 18px', fontWeight: 700, minWidth: 110 }}
                                                onClick={() => handleRowCTA(jd)}
                                                id={`home-cta-${jd.id}`}
                                            >
                                                {STAGE_CTA[jd.status].label}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
