// src/screens/Processing.tsx
import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, FileText, Brain, BarChart3, Archive, Sparkles } from 'lucide-react';

interface ProcessingProps {
    fileCount: number;
    onComplete: () => void;
}

const STAGE_CONFIG = [
    { id: 'extracting', label: 'Extracting Text', duration: 2800 },
    { id: 'analyzing', label: 'AI Analysis', duration: 3600 },
    { id: 'scoring', label: 'Computing Scores', duration: 2400 },
    { id: 'bucketing', label: 'Assigning Buckets', duration: 1200 },
];

const TOTAL_DURATION = STAGE_CONFIG.reduce((s, st) => s + st.duration, 0);

const STAGE_CUMULATIVE = STAGE_CONFIG.reduce<number[]>((acc, s, i) => {
    acc.push((acc[i - 1] ?? 0) + s.duration);
    return acc;
}, []);

export default function Processing({ fileCount, onComplete }: ProcessingProps) {
    // React state only for coarse transitions (4 stage changes + done)
    const [currentStage, setCurrentStage] = useState(0);
    const [done, setDone] = useState(false);

    // DOM refs for high-frequency updates (bypasses React batching)
    const overallBarRef = useRef<HTMLDivElement>(null);
    const overallPctRef = useRef<HTMLSpanElement>(null);
    const stageBarRef = useRef<HTMLDivElement>(null);
    const stagePctRef = useRef<HTMLSpanElement>(null);
    const processedRef = useRef<HTMLSpanElement>(null);

    const onCompleteRef = useRef(onComplete);
    useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

    // Track current stage in a ref so the animation loop doesn't need React state
    const currentStageRef = useRef(0);

    useEffect(() => {
        let raf: number;
        let start: number | null = null;

        const animate = (timestamp: number) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const clamped = Math.min(elapsed, TOTAL_DURATION);

            // Overall progress — update DOM directly for smoothness
            const pct = Math.max((clamped / TOTAL_DURATION) * 100, elapsed > 30 ? 1 : 0);
            if (overallBarRef.current) overallBarRef.current.style.width = `${pct.toFixed(2)}%`;
            if (overallPctRef.current) overallPctRef.current.textContent = `${Math.round(pct)}%`;

            // Processed count
            const processed = Math.round((clamped / TOTAL_DURATION) * fileCount);
            if (processedRef.current) processedRef.current.textContent = `Processed ${processed} of ${fileCount} candidates`;

            // Resolve current stage
            let idx = 0;
            for (let i = 0; i < STAGE_CUMULATIVE.length; i++) {
                if (clamped >= STAGE_CUMULATIVE[i]) idx = i + 1;
                else break;
            }
            idx = Math.min(idx, STAGE_CONFIG.length - 1);

            // Only trigger React re-render on stage transitions (rare)
            if (idx !== currentStageRef.current) {
                currentStageRef.current = idx;
                setCurrentStage(idx);
            }

            // Per-stage progress — also direct DOM
            const prevCum = idx === 0 ? 0 : STAGE_CUMULATIVE[idx - 1];
            const stagePct = Math.min(Math.max(((clamped - prevCum) / STAGE_CONFIG[idx].duration) * 100, elapsed > 30 ? 2 : 0), 100);
            if (stageBarRef.current) stageBarRef.current.style.width = `${stagePct.toFixed(2)}%`;
            if (stagePctRef.current) stagePctRef.current.textContent = `${Math.round(stagePct)}%`;

            if (elapsed < TOTAL_DURATION) {
                raf = requestAnimationFrame(animate);
            } else {
                if (overallBarRef.current) overallBarRef.current.style.width = '100%';
                if (overallPctRef.current) overallPctRef.current.textContent = '100%';
                if (stageBarRef.current) stageBarRef.current.style.width = '100%';
                if (processedRef.current) processedRef.current.textContent = `${fileCount} candidates scored and bucketed`;
                setDone(true);
                setTimeout(() => onCompleteRef.current(), 1200);
            }
        };

        const t = setTimeout(() => { raf = requestAnimationFrame(animate); }, 60);
        return () => { clearTimeout(t); cancelAnimationFrame(raf); };
    }, [fileCount]);

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
                    {/* Updated via DOM ref */}
                    <span ref={processedRef}>Processed 0 of {fileCount} candidates</span>
                </p>

                {/* Overall Progress */}
                <div style={{ marginBottom: 48 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Overall Progress</span>
                        <span ref={overallPctRef} style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-purple)' }}>0%</span>
                    </div>
                    <div className="progress-bar" style={{ height: 8 }}>
                        {/* width updated via DOM ref — no CSS transition */}
                        <div ref={overallBarRef} className="progress-fill" style={{ width: '0%' }} />
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
                                        {/* Stage % text updated via DOM ref when active */}
                                        {isActive && <span ref={stagePctRef} style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-purple)' }}>0%</span>}
                                        {isDoneStage && <span style={{ fontSize: 12, color: 'var(--accent-green)', fontWeight: 500 }}>✓ Done</span>}
                                    </div>
                                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stage.sublabel}</p>
                                    {isActive && (
                                        <div className="progress-bar" style={{ marginTop: 10 }}>
                                            {/* width updated via DOM ref — no CSS transition */}
                                            <div ref={stageBarRef} className="progress-fill" style={{ width: '0%' }} />
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
