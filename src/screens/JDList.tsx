// src/screens/JDList.tsx
import { useState, useMemo } from 'react';
import { Plus, Search, Briefcase, MapPin } from 'lucide-react';
import type { JobDescription, LifecycleStage } from '../types';

interface JDListProps {
    jds: JobDescription[];
    onSelect: (jd: JobDescription) => void;
    onCreateNew: () => void;
}

const STAGE_BADGE: Record<LifecycleStage, { bg: string; color: string; border: string }> = {
    'Draft': { bg: 'hsla(210,15%,45%,0.12)', color: 'hsl(210,15%,55%)', border: 'hsla(210,15%,45%,0.25)' },
    'Live – Accepting Applications': { bg: 'hsla(213,94%,68%,0.1)', color: 'hsl(213,94%,68%)', border: 'hsla(213,94%,68%,0.25)' },
    'Screening in Progress': { bg: 'hsla(38,95%,62%,0.1)', color: 'hsl(38,95%,62%)', border: 'hsla(38,95%,62%,0.25)' },
    'Interview': { bg: 'hsla(270,70%,65%,0.1)', color: 'hsl(270,70%,70%)', border: 'hsla(270,70%,65%,0.25)' },
    'Offer Extended': { bg: 'hsla(175,70%,50%,0.1)', color: 'hsl(175,70%,55%)', border: 'hsla(175,70%,50%,0.25)' },
    'Offer Closed': { bg: 'hsla(158,72%,52%,0.1)', color: 'hsl(158,72%,52%)', border: 'hsla(158,72%,52%,0.25)' },
};

const STAGE_CTA: Record<LifecycleStage, string> = {
    'Draft': 'Edit',
    'Live – Accepting Applications': 'Import Applications',
    'Screening in Progress': 'Open Dashboard',
    'Interview': 'View Candidates',
    'Offer Extended': 'View Status',
    'Offer Closed': 'View Archive',
};

const ALL_STAGES: LifecycleStage[] = [
    'Draft',
    'Live – Accepting Applications',
    'Screening in Progress',
    'Interview',
    'Offer Extended',
    'Offer Closed',
];

function StageBadge({ stage }: { stage: LifecycleStage }) {
    const s = STAGE_BADGE[stage];
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '3px 10px', borderRadius: 100,
            fontSize: 11, fontWeight: 600,
            background: s.bg, color: s.color, border: `1px solid ${s.border}`,
            whiteSpace: 'nowrap',
        }}>
            {stage}
        </span>
    );
}

export default function JDList({ jds, onSelect, onCreateNew }: JDListProps) {
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [stageFilter, setStageFilter] = useState<LifecycleStage | ''>('');

    const departments = useMemo(() => [...new Set(jds.map(j => j.department))].sort(), [jds]);
    const locations = useMemo(() => [...new Set(jds.map(j => j.location))].sort(), [jds]);

    const filtered = useMemo(() => jds.filter(jd => {
        const q = search.toLowerCase();
        const matchesSearch = !q || jd.title.toLowerCase().includes(q) || jd.department.toLowerCase().includes(q);
        const matchesDept = !deptFilter || jd.department === deptFilter;
        const matchesLocation = !locationFilter || jd.location === locationFilter;
        const matchesStage = !stageFilter || jd.status === stageFilter;
        return matchesSearch && matchesDept && matchesLocation && matchesStage;
    }), [jds, search, deptFilter, locationFilter, stageFilter]);

    const selectStyle: React.CSSProperties = {
        padding: '8px 12px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        color: 'var(--text-primary)',
        fontSize: 13,
        outline: 'none',
        cursor: 'pointer',
    };

    return (
        <div className="screen-fade" style={{ minHeight: 'calc(100vh - 64px)', padding: '40px 32px 80px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                    <div>
                        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Job Descriptions</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                            {jds.length} roles across {departments.length} departments
                        </p>
                    </div>
                    <button className="btn-primary" onClick={onCreateNew} id="create-new-jd-btn">
                        <Plus size={16} /> Create New JD
                    </button>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            className="input-field"
                            style={{ paddingLeft: 36, height: 38, fontSize: 13 }}
                            placeholder="Search roles..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            id="jd-search"
                        />
                    </div>
                    <select style={selectStyle} value={deptFilter} onChange={e => setDeptFilter(e.target.value)} id="jd-dept-filter">
                        <option value="">All Departments</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select style={selectStyle} value={locationFilter} onChange={e => setLocationFilter(e.target.value)} id="jd-location-filter">
                        <option value="">All Locations</option>
                        {locations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <select style={selectStyle} value={stageFilter} onChange={e => setStageFilter(e.target.value as LifecycleStage | '')} id="jd-stage-filter">
                        <option value="">All Stages</option>
                        {ALL_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {(search || deptFilter || locationFilter || stageFilter) && (
                        <button
                            className="btn-ghost"
                            style={{ fontSize: 12 }}
                            onClick={() => { setSearch(''); setDeptFilter(''); setLocationFilter(''); setStageFilter(''); }}
                            id="jd-clear-filters"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="card" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                {['Role Title', 'Department', 'Location', 'Stage', 'Applications', 'Strong', 'Days Open', ''].map((h, i) => (
                                    <th key={h + i} style={{
                                        padding: '10px 16px',
                                        fontSize: 11, fontWeight: 600,
                                        color: 'var(--text-muted)',
                                        textAlign: i >= 4 && i <= 6 ? 'right' : 'left',
                                        textTransform: 'uppercase', letterSpacing: '0.05em',
                                        borderBottom: '1px solid var(--border-subtle)',
                                        background: 'var(--bg-secondary)',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                                        No roles match your filters.
                                    </td>
                                </tr>
                            ) : filtered.map((jd, i) => (
                                <tr
                                    key={jd.id}
                                    className="table-row"
                                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                                >
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{jd.title}</div>
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--text-muted)' }}>
                                                <Briefcase size={11} /> {jd.experienceMin}–{jd.experienceMax}y
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--text-muted)' }}>
                                                {jd.mustHaveSkills.slice(0, 2).join(', ')}{jd.mustHaveSkills.length > 2 ? ` +${jd.mustHaveSkills.length - 2}` : ''}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                        {jd.department}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                            <MapPin size={12} /> {jd.location}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <StageBadge stage={jd.status} />
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, textAlign: 'right', fontFamily: 'Outfit, sans-serif', color: jd.applicationCount ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                        {jd.applicationCount ?? '—'}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, textAlign: 'right', fontFamily: 'Outfit, sans-serif', color: 'var(--strong-text)' }}>
                                        {jd.strongCount ?? '—'}
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: 13, textAlign: 'right', color: 'var(--text-muted)' }}>
                                        {jd.daysOpen ?? '—'}d
                                    </td>
                                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                        <button
                                            className="btn-ghost"
                                            style={{ fontSize: 12, padding: '6px 14px', whiteSpace: 'nowrap' }}
                                            onClick={() => onSelect(jd)}
                                            id={`jd-cta-${jd.id}`}
                                        >
                                            {STAGE_CTA[jd.status]}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
