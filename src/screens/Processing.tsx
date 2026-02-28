// src/screens/Processing.tsx
import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, FileText, Brain, BarChart3, Archive, Sparkles } from 'lucide-react';

interface ProcessingProps {
    fileCount: number;
    onComplete: () => void;
}

// ─── Static stage config (outside component to keep stable reference) ─────────
const STAGE_CONFIG = [
    { id: 'extracting', label: 'Extracting Text', duration: 1800 },
    { id: 'analyzing', label: 'AI Analysis', duration: 2400 },
    { id: 'scoring', label: 'Computing Scores', duration: 1500 },
    { id: 'bucketing', label: 'Assigning Buckets', duration: 800 },
];

const TOTAL_DURATION = STAGE_CONFIG.reduce((s, st) => s + st.duration, 0);

const STAGE_CUMULATIVE = STAGE_CONFIG.reduce<number[]>((acc, s, i) => {
    acc.push((acc[i - 1] ?? 0) + s.duration);
    return acc;
}, []);

export default function Processing({ fileCount, onComplete }: ProcessingProps) {
    const [currentStage, setCurrentStage] = useState(0);
    const [stageProgress, setStageProgress] = useState(0);
    const [overallProgress, setOverallProgress] = useState(0);
    const [done, setDone] = useState(false);
    const [processedCount, setProcessedCount] = useState(0);

    // Keep onComplete stable so it doesn't restart the effect
    const onCompleteRef = useRef(onComplete);
    useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

    useEffect(() => {
        let raf: number;
        let start: number | null = null;

        const animate = (timestamp: number) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const clamped = Math.min(elapsed, TOTAL_DURATION);

            // Overall progress — start from 1% on first frame so bar is visibly moving
            const pct = (clamped / TOTAL_DURATION) * 100;
            setOverallProgress(elapsed > 0 ? Math.max(pct, 1) : 0);

            // Resolve current stage index
            let idx = 0;
            for (let i = 0; i < STAGE_CUMULATIVE.length; i++) {
                if (clamped >= STAGE_CUMULATIVE[i]) idx = i + 1;
                else break;
            }
            idx = Math.min(idx, STAGE_CONFIG.length - 1);
            setCurrentStage(idx);

            // Per-stage progress
            const prevCum = idx === 0 ? 0 : STAGE_CUMULATIVE[idx - 1];
            const stagePct = ((clamped - prevCum) / STAGE_CONFIG[idx].duration) * 100;
            setStageProgress(Math.min(Math.max(stagePct, elapsed > 0 ? 2 : 0), 100));

            // Processed candidate count
            setProcessedCount(Math.round((clamped / TOTAL_DURATION) * fileCount));

            if (elapsed < TOTAL_DURATION) {
                raf = requestAnimationFrame(animate);
            } else {
                setOverallProgress(100);
                setStageProgress(100);
                setProcessedCount(fileCount);
                setDone(true);
                setTimeout(() => onCompleteRef.current(), 1200);
            }
        };

        // 60ms delay so the component mounts and renders before animation
        const t = setTimeout(() => { raf = requestAnimationFrame(animate); }, 60);

        return () => {
            clearTimeout(t);
            cancelAnimationFrame(raf);
        };
    }, [fileCount]); // ← only fileCount, not stages (stable now)

    // Render-time: combine static config with dynamic sublabel and icon
    const stages = [
        { ...STAGE_CONFIG[0], sublabel: `Parsing ${fileCount} resume${fileCount !== 1 ? 's' : ''} into structured data`, icon: <FileText size={18} /> },
        { ...STAGE_CONFIG[1], sublabel: 'Running skill alignment and context scoring', icon: <Brain size={18} /> },
        { ...STAGE_CONFIG[2], sublabel: 'Calculating composite scores across 4 dimensions', icon: <BarChart3 size={18} /> },
        { ...STAGE_CONFIG[3], sublabel: 'Classifying candidates into Strong / Potential / Low', icon: <Archive size={18} /> },
    ];

    return (
        <div style={{
            minHeight: 'calc(100vh - 64px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '48px 32px',
        }}>
            <div style={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>

                {/* Animated Icon */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
                    <div style={{
                        width: 100, height: 100, borderRadius: 28,
                        background: 'linear-gradient(135deg, var(--accent-purple-dim), hsla(213, 94%, 68%, 0.1))',
                        border: '1px solid var(--border-glow)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: done ? 'none' : 'pulse-glow 2s infinite',
                        boxShadow: 'var(--shadow-glow-purple)',
                    }}>
                        {done
                            ? <CheckCircle2 size={44} color="var(--accent-green)" />
                            : <Sparkles size={44} color="var(--accent-purple)" style={{ animation: 'float 3s ease-in-out infinite' }} />
                        }
                    </div>
                </div>

                <h1 style={{ fontSize: 30, marginBottom: 10, letterSpacing: '-0.03em' }}>
                    {done ? 'Analysis Complete!' : 'Screening in Progress...'}
                </h1>
                <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 48 }}>
                    {done
                        ? `${fileCount} candidates scored and bucketed`
                        : `Processed ${processedCount} of ${fileCount} candidates`
                    }
                </p>

                {/* Overall Progress */}
                <div style={{ marginBottom: 48 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Overall Progress</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-purple)' }}>{Math.round(overallProgress)}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: 6 }}>
                        <div className="progress-fill" style={{ width: `${overallProgress}%`, transition: 'width 120ms linear' }} />
                    </div>
                </div>

                {/* Stages */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
                    {stages.map((stage, i) => {
                        const isActive = i === currentStage && !done;
                        const isDoneStage = i < currentStage || done;
                        const isPending = i > currentStage && !done;

                        return (
                            <div key={stage.id} style={{
                                display: 'flex', alignItems: 'center', gap: 16,
                                padding: '16px 20px',
                                borderRadius: 14,
                                background: isActive ? 'var(--accent-purple-dim)' : isDoneStage ? 'hsla(158,72%,52%,0.06)' : 'var(--bg-card)',
                                border: `1px solid ${isActive ? 'var(--border-glow)' : isDoneStage ? 'var(--strong-border)' : 'var(--border-subtle)'}`,
                                opacity: isPending ? 0.5 : 1,
                                transition: 'all 0.4s ease',
                            }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 12,
                                    background: isActive ? 'var(--accent-purple-dim)' : isDoneStage ? 'hsla(158,72%,52%,0.12)' : 'var(--bg-secondary)',
                                    border: `1px solid ${isActive ? 'var(--border-glow)' : isDoneStage ? 'var(--strong-border)' : 'var(--border-subtle)'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                    color: isActive ? 'var(--accent-purple)' : isDoneStage ? 'var(--accent-green)' : 'var(--text-muted)',
                                }}>
                                    {isDoneStage ? <CheckCircle2 size={18} /> : stage.icon}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isActive ? 8 : 2 }}>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: isActive ? 'var(--accent-purple)' : isDoneStage ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                                            {stage.label}
                                        </span>
                                        {isActive && (
                                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-purple)' }}>{Math.round(stageProgress)}%</span>
                                        )}
                                        {isDoneStage && <span style={{ fontSize: 12, color: 'var(--accent-green)', fontWeight: 500 }}>✓ Done</span>}
                                    </div>
                                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stage.sublabel}</p>
                                    {isActive && (
                                        <div className="progress-bar" style={{ marginTop: 10 }}>
                                            <div className="progress-fill" style={{ width: `${stageProgress}%`, transition: 'width 120ms linear' }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 32 }}>
                    🔒 AI assists scoring only — all final decisions remain human
                </p>
            </div>
        </div>
    );
}
