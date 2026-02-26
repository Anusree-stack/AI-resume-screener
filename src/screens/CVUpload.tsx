// src/screens/CVUpload.tsx
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

interface CVUploadProps {
    onNext: (files: File[]) => void;
    onBack: () => void;
}


export default function CVUpload({ onNext, onBack }: CVUploadProps) {
    const [files, setFiles] = useState<{ name: string; size: number }[]>([]);

    const onDrop = useCallback((accepted: File[]) => {
        setFiles(prev => [...prev, ...accepted.map(f => ({ name: f.name, size: f.size }))]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc', '.docx'] },
        multiple: true,
    });

    const removeFile = (name: string) => {
        setFiles(prev => prev.filter(f => f.name !== name));
    };

    const formatBytes = (bytes: number) => {
        if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
        return `${(bytes / 1024).toFixed(0)} KB`;
    };

    return (
        <div style={{ minHeight: 'calc(100vh - 64px)', padding: '48px 32px' }}>
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
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
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-purple)' }}>Step 2 of 5</span>
                        </div>
                    </div>
                    <h1 style={{ fontSize: 36, marginBottom: 10, letterSpacing: '-0.03em' }}>Upload Candidate Resumes</h1>
                    <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        Upload PDF or DOCX files. Bulk upload supported.
                    </p>
                </div>

                {/* Dropzone */}
                <div
                    {...getRootProps()}
                    id="cv-dropzone"
                    style={{
                        border: `2px dashed ${isDragActive ? 'var(--accent-purple)' : 'var(--border-subtle)'}`,
                        borderRadius: 20,
                        padding: '56px 32px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: isDragActive ? 'var(--accent-purple-dim)' : 'var(--bg-card)',
                        transition: 'all 0.25s ease',
                        marginBottom: 24,
                    }}
                >
                    <input {...getInputProps()} />
                    <div style={{
                        width: 72, height: 72, borderRadius: 20,
                        background: isDragActive ? 'var(--accent-purple-dim)' : 'var(--bg-secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                        border: `1px solid ${isDragActive ? 'var(--border-glow)' : 'var(--border-subtle)'}`,
                        transition: 'all 0.25s ease',
                    }}>
                        <Upload size={28} color={isDragActive ? 'var(--accent-purple)' : 'var(--text-muted)'} />
                    </div>
                    <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, color: isDragActive ? 'var(--accent-purple)' : 'var(--text-primary)' }}>
                        {isDragActive ? 'Drop files here...' : 'Drag & drop resumes here'}
                    </p>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>
                        Supports PDF, DOC, DOCX — multiple files at once
                    </p>
                    <button className="btn-secondary" style={{ pointerEvents: 'none' }}>
                        Browse Files
                    </button>
                </div>

                {/* Demo Loader */}
                {files.length === 0 && (
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                        padding: '14px 20px', borderRadius: 12,
                        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                        marginBottom: 24,
                    }}>
                        <Sparkles size={14} color="var(--accent-purple)" />
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Want to see enterprise scale?</span>
                        <button className="btn-ghost" onClick={() => {
                            const bulk = Array(850).fill(null).map((_, i) => ({
                                name: `candidate_resume_${i + 1}.pdf`,
                                size: Math.floor(Math.random() * 800000) + 200000
                            }));
                            setFiles(bulk);
                        }} style={{ color: 'var(--accent-purple)', fontSize: 13 }} id="load-demo-btn">
                            Load 850 demo resumes →
                        </button>
                    </div>
                )}

                {/* File List */}
                {files.length > 0 && (
                    <div className="card" style={{ padding: 20, marginBottom: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <CheckCircle2 size={16} color="var(--accent-green)" />
                                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {files.length} file{files.length !== 1 ? 's' : ''} ready
                                </span>
                            </div>
                            <button
                                className="btn-ghost"
                                onClick={() => { setFiles([]); }}
                                style={{ fontSize: 12, color: 'var(--text-muted)' }}
                                id="clear-files-btn"
                            >
                                Clear all
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {files.map(file => (
                                <div key={file.name} style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '10px 14px',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 10,
                                    border: '1px solid var(--border-subtle)',
                                }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 8,
                                        background: 'hsla(0, 82%, 65%, 0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <FileText size={14} color="var(--accent-red)" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {file.name}
                                        </p>
                                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatBytes(file.size)}</p>
                                    </div>
                                    <button
                                        onClick={() => removeFile(file.name)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4, borderRadius: 4 }}
                                        className="btn-ghost"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8 }}>
                    <button className="btn-secondary" onClick={onBack} id="cv-back-btn">
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => onNext(files as unknown as File[])}
                        disabled={files.length === 0}
                        style={{ fontSize: 15, padding: '14px 28px' }}
                        id="cv-process-btn"
                    >
                        Process Resumes
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
