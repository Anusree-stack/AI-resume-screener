// src/components/ScoreRing.tsx
interface ScoreRingProps {
    score: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
    showLabel?: boolean;
}

function getScoreColor(score: number) {
    if (score >= 80) return 'hsl(158, 72%, 52%)';
    if (score >= 50) return 'hsl(38, 95%, 62%)';
    return 'hsl(0, 82%, 65%)';
}

function getScoreGlow(score: number) {
    if (score >= 80) return 'hsla(158, 72%, 52%, 0.3)';
    if (score >= 50) return 'hsla(38, 95%, 62%, 0.3)';
    return 'hsla(0, 82%, 65%, 0.3)';
}

export default function ScoreRing({ score, size = 80, strokeWidth = 7, label, showLabel = true }: ScoreRingProps) {
    const radius = (size - strokeWidth * 2) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;
    const color = getScoreColor(score);
    const glow = getScoreGlow(score);
    const id = `gradient-${score}-${size}`;

    return (
        <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ position: 'relative', filter: `drop-shadow(0 0 8px ${glow})` }}>
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                    <defs>
                        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                            <stop offset="100%" stopColor={color} />
                        </linearGradient>
                    </defs>
                    {/* Track */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="hsla(210, 20%, 60%, 0.1)"
                        strokeWidth={strokeWidth}
                    />
                    {/* Progress */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={`url(#${id})`}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                </svg>
                {/* Score Text */}
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    fontSize: size < 60 ? 13 : 18,
                    fontWeight: 800,
                    fontFamily: 'Outfit, sans-serif',
                    color: color,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                }}>
                    {score}
                    {size >= 60 && <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginTop: 1 }}>/ 100</span>}
                </div>
            </div>
            {showLabel && label && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
            )}
        </div>
    );
}
