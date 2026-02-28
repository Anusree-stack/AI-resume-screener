// src/screens/CVUpload.tsx
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, ArrowLeft, CheckCircle2, Database, Zap, Users } from 'lucide-react';

interface CVUploadProps {
    onNext: (files: File[]) => void;
    onBack: () => void;
}

// Mock Action Center candidates
const ACTION_CENTER_POOL = [
    { name: 'Shreya Patil', role: 'SDE II at Flipkart', source: 'Action Center' },
    { name: 'Rahul Verma', role: 'Senior Engineer at Zomato', source: 'Action Center' },
    { name: 'Kavya Nair', role: 'Full-Stack Dev at Swiggy', source: 'Action Center' },
    { name: 'Arjun Mehta', role: 'Tech Lead at Razorpay', source: 'Action Center' },
    { name: 'Priya Sharma', role: 'Product Engineer at CRED', source: 'Action Center' },
    { name: 'Deepak Kumar', role: 'SDE III at PhonePe', source: 'Action Center' },
    { name: 'Ananya Singh', role: 'Backend Engineer at Zepto', source: 'Action Center' },
    { name: 'Vikash Gupta', role: 'Cloud Architect at HCL', source: 'Action Center' },
    { name: 'Neha Joshi', role: 'Senior Dev at Paytm', source: 'Action Center' },
    { name: 'Harsh Malhotra', role: 'Platform Engineer at InMobi', source: 'Action Center' },
    { name: 'Sonal Tiwari', role: 'Data Engineer at Dunzo', source: 'Action Center' },
    { name: 'Rohan Saxena', role: 'SDE II at Ola', source: 'Action Center' },
];

export default function CVUpload({ onNext, onBack }: CVUploadProps) {
    const [files, setFiles] = useState<{ name: string; size: number; source?: string }[]>([]);
    const [actionCenterTab, setActionCenterTab] = useState(false);
    const [acSelected, setAcSelected] = useState<Set<string>>(new Set());
    const [acImported, setAcImported] = useState(false);
    // NOTE: acImported is intentionally false by default. The banner only appears
    // after user explicitly imports from the Action Center tab.

    const onDrop = useCallback((accepted: File[]) => {
        setFiles(prev => [...prev, ...accepted.map(f => ({ name: f.name, size: f.size }))]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc', '.docx'] },
        multiple: true,
    });

    const removeFile = (name: string) => setFiles(prev => prev.filter(f => f.name !== name));
    const formatBytes = (bytes: number) => bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;

    const toggleAcCandidate = (name: string) => {
        setAcSelected(prev => {
            const next = new Set(prev);
            if (next.has(name)) next.delete(name); else next.add(name);
            return next;
        });
    };
    const selectAllAc = () => {
        if (acSelected.size === ACTION_CENTER_POOL.length) setAcSelected(new Set());
        else setAcSelected(new Set(ACTION_CENTER_POOL.map(c => c.name)));
    };
    const importFromAC = () => {
        const newFiles = ACTION_CENTER_POOL
            .filter(c => acSelected.has(c.name))
            .map(c => ({ name: `${c.name.replace(/ /g, '_')}_resume.pdf`, size: 450000 + Math.random() * 300000, source: 'Action Center' }));
        setFiles(prev => [...prev, ...newFiles]);
        setAcImported(true);
        setActionCenterTab(false);
        setAcSelected(new Set());
    };

    const totalCount = files.length;
    const canProcess = totalCount > 0;

    const tabStyle = (active: boolean): React.CSSProperties => ({
        flex: 1,
        padding: '12px',
        background: active ? 'var(--bg-card)' : 'transparent',
        border: 'none',
        borderBottom: active ? '2px solid var(--accent-purple)' : '2px solid transparent',
        color: active ? 'var(--accent-purple)' : 'var(--text-muted)',
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        transition: 'all 120ms ease',
    });

    return (
        <div style={{ minHeight: 'calc(100vh - 60px)', background: 'var(--bg-primary)' }}>
            {/* Sticky top bar with process button */}
            <div style={{
                position: 'sticky', top: 60, zIndex: 40,
                background: 'var(--bg-card)',
                borderBottom: '1px solid var(--border-subtle)',
                padding: '12px 40px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                backdropFilter: 'blur(12px)',
            }}>
                <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Step 2</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Import Candidate Resumes</div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {canProcess && (
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                            <strong style={{ color: 'var(--accent-purple)' }}>{totalCount}</strong> resume{totalCount !== 1 ? 's' : ''} ready
                        </span>
                    )}
                    <button
                        className="btn-primary"
                        onClick={() => onNext(files as unknown as File[])}
                        disabled={!canProcess}
                        style={{ fontSize: 13.5, padding: '10px 24px' }}
                        id="cv-process-btn"
                    >
                        <Zap size={15} />
                        Run AI Screening
                    </button>
                </div>
            </div>

            <div style={{ maxWidth: 820, margin: '0 auto', padding: '36px 40px 80px' }}>
                {/* Source Tabs */}
                <div style={{
                    display: 'flex',
                    borderRadius: '12px 12px 0 0',
                    border: '1px solid var(--border-subtle)',
                    borderBottom: 'none',
                    overflow: 'hidden',
                    background: 'var(--bg-secondary)',
                    marginBottom: 0,
                }}>
                    <button style={tabStyle(!actionCenterTab)} onClick={() => setActionCenterTab(false)} id="tab-upload">
                        <Upload size={14} /> Upload Files
                    </button>
                    <button style={tabStyle(actionCenterTab)} onClick={() => setActionCenterTab(true)} id="tab-action-center">
                        <Database size={14} /> Microsoft Action Center
                        <span style={{
                            padding: '1px 7px', borderRadius: 100,
                            background: 'var(--accent-purple-dim)', color: 'var(--accent-purple)',
                            fontSize: 10, fontWeight: 700, border: '1px solid var(--border-glow)',
                        }}>
                            {ACTION_CENTER_POOL.length} available
                        </span>
                    </button>
                </div>

                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '0 0 12px 12px', background: 'var(--bg-card)', overflow: 'hidden' }}>
                    {/* Upload Tab */}
                    {!actionCenterTab && (
                        <div style={{ padding: 24 }}>
                            <div
                                {...getRootProps()}
                                id="cv-dropzone"
                                style={{
                                    border: `2px dashed ${isDragActive ? 'var(--accent-purple)' : 'var(--border-subtle)'}`,
                                    borderRadius: 12,
                                    padding: '48px 32px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: isDragActive ? 'var(--accent-purple-dim)' : 'var(--bg-secondary)',
                                    transition: 'all 0.2s ease',
                                    marginBottom: 20,
                                }}
                            >
                                <input {...getInputProps()} />
                                <div style={{
                                    width: 60, height: 60, borderRadius: 16,
                                    background: isDragActive ? 'var(--accent-purple-dim)' : 'var(--bg-card)',
                                    border: `1px solid ${isDragActive ? 'var(--border-glow)' : 'var(--border-subtle)'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 16px',
                                }}>
                                    <Upload size={24} color={isDragActive ? 'var(--accent-purple)' : 'var(--text-muted)'} />
                                </div>
                                <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: isDragActive ? 'var(--accent-purple)' : 'var(--text-primary)' }}>
                                    {isDragActive ? 'Drop files here...' : 'Drag & drop resumes here'}
                                </p>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>PDF, DOC, DOCX — multiple files at once</p>
                                <button className="btn-secondary" style={{ pointerEvents: 'none', fontSize: 13 }}>Browse Files</button>
                            </div>

                            {/* Demo loader */}
                            {files.length === 0 && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    padding: '13px 20px', borderRadius: 10,
                                    background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                                }}>
                                    <Zap size={14} color="var(--accent-purple)" />
                                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Want to see enterprise scale?</span>
                                    <button
                                        className="btn-ghost"
                                        onClick={() => setFiles(Array(850).fill(null).map((_, i) => ({ name: `candidate_resume_${i + 1}.pdf`, size: Math.floor(Math.random() * 800000) + 200000 })))}
                                        style={{ color: 'var(--accent-purple)', fontSize: 13, fontWeight: 600 }}
                                        id="load-demo-btn"
                                    >
                                        Load 850 demo resumes →
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Center Tab */}
                    {actionCenterTab && (
                        <div>
                            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)' }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Microsoft Action Center — Candidate Pool</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Candidates in your ATS matched to this role's criteria</div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <button className="btn-ghost" style={{ fontSize: 12 }} onClick={selectAllAc} id="ac-select-all">
                                        {acSelected.size === ACTION_CENTER_POOL.length ? 'Deselect All' : 'Select All'}
                                    </button>
                                    <button
                                        className="btn-primary"
                                        onClick={importFromAC}
                                        disabled={acSelected.size === 0}
                                        style={{ fontSize: 12, padding: '7px 16px' }}
                                        id="ac-import-btn"
                                    >
                                        <Users size={13} />
                                        Import {acSelected.size > 0 ? acSelected.size : ''} Selected
                                    </button>
                                </div>
                            </div>
                            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                                {ACTION_CENTER_POOL.map(c => (
                                    <div
                                        key={c.name}
                                        className="table-row"
                                        onClick={() => toggleAcCandidate(c.name)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 14,
                                            padding: '12px 20px',
                                            borderBottom: '1px solid var(--border-subtle)',
                                            cursor: 'pointer',
                                            background: acSelected.has(c.name) ? 'var(--accent-purple-dim)' : undefined,
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={acSelected.has(c.name)}
                                            readOnly
                                            style={{ cursor: 'pointer', accentColor: 'var(--accent-purple)' }}
                                        />
                                        <div style={{
                                            width: 34, height: 34, borderRadius: 10,
                                            background: 'var(--accent-purple-dim)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0, fontSize: 13, fontWeight: 700, color: 'var(--accent-purple)',
                                        }}>
                                            {c.name.charAt(0)}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.role}</div>
                                        </div>
                                        <span style={{
                                            fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100,
                                            background: 'var(--bg-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)',
                                        }}>ACTION CENTER</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Imported success banner */}
                {acImported && (
                    <div style={{
                        marginTop: 16, padding: '12px 18px', borderRadius: 10,
                        background: 'var(--strong-bg)', border: '1px solid var(--strong-border)',
                        display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--strong-text)',
                    }}>
                        <CheckCircle2 size={15} /> Candidates imported from Microsoft Action Center successfully.
                    </div>
                )}

                {/* File list */}
                {files.length > 0 && (
                    <div style={{ marginTop: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                <CheckCircle2 size={15} color="var(--accent-green)" />
                                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{files.length} resume{files.length !== 1 ? 's' : ''} ready</span>
                            </div>
                            <button className="btn-ghost" onClick={() => setFiles([])} style={{ fontSize: 12 }} id="clear-files-btn">Clear all</button>
                        </div>
                        <div className="card" style={{ padding: 16, maxHeight: 240, overflowY: 'auto' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {files.slice(0, 20).map(file => (
                                    <div key={file.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                                        <FileText size={14} color="var(--accent-red)" />
                                        <span style={{ flex: 1, fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>{file.name}</span>
                                        {file.source && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 100, background: 'var(--accent-purple-dim)', color: 'var(--accent-purple)', fontWeight: 600 }}>{file.source}</span>}
                                        <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{formatBytes(file.size)}</span>
                                        <button onClick={() => removeFile(file.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 2 }}><X size={13} /></button>
                                    </div>
                                ))}
                                {files.length > 20 && <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', padding: '8px 0' }}>...and {files.length - 20} more files</div>}
                            </div>
                        </div>
                    </div>
                )}

                {/* Back */}
                <div style={{ marginTop: 24 }}>
                    <button className="btn-ghost" onClick={onBack} style={{ fontSize: 13 }} id="cv-back-btn">
                        <ArrowLeft size={14} /> Back to JD Setup
                    </button>
                </div>
            </div>
        </div>
    );
}
