// src/components/TopNav.tsx
import { CheckCircle, Briefcase } from 'lucide-react';
import type { AppScreen } from '../types';

interface Step {
    id: AppScreen;
    label: string;
    index: number;
}

const steps: Step[] = [
    { id: 'jd-setup', label: 'Job Setup', index: 1 },
    { id: 'cv-upload', label: 'Upload CVs', index: 2 },
    { id: 'processing', label: 'Processing', index: 3 },
    { id: 'dashboard', label: 'Dashboard', index: 4 },
    { id: 'shortlist', label: 'Shortlist', index: 5 },
];

const screenOrder: AppScreen[] = ['jd-setup', 'cv-upload', 'processing', 'dashboard', 'candidate-detail', 'shortlist'];

function getStepStatus(stepId: AppScreen, currentScreen: AppScreen): 'done' | 'active' | 'pending' {
    const stepIdx = screenOrder.indexOf(stepId);
    const currentIdx = screenOrder.indexOf(currentScreen === 'candidate-detail' ? 'dashboard' : currentScreen);
    if (stepIdx < currentIdx) return 'done';
    if (stepIdx === currentIdx) return 'active';
    return 'pending';
}

export default function TopNav({ currentScreen }: { currentScreen: AppScreen }) {
    return (
        <header style={{
            position: 'sticky', top: 0, zIndex: 100,
            background: 'hsla(222, 30%, 7%, 0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '0 32px',
        }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'linear-gradient(135deg, var(--accent-purple), hsl(240, 83%, 68%))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Briefcase size={16} color="white" />
                    </div>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>
                        TalentIQ
                    </span>
                    <span style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 8px',
                        background: 'var(--accent-purple-dim)', color: 'var(--accent-purple)',
                        borderRadius: 100, border: '1px solid hsla(262,83%,68%,0.2)',
                        letterSpacing: '0.05em',
                    }}>MVP</span>
                </div>

                {/* Steps */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    {steps.map((step, i) => {
                        const status = getStepStatus(step.id, currentScreen);
                        return (
                            <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 11, fontWeight: 700,
                                        border: `2px solid ${status === 'active' ? 'var(--accent-purple)' : status === 'done' ? 'var(--accent-green)' : 'var(--border-subtle)'}`,
                                        background: status === 'active' ? 'var(--accent-purple-dim)' : status === 'done' ? 'hsla(158,72%,52%,0.12)' : 'transparent',
                                        color: status === 'active' ? 'var(--accent-purple)' : status === 'done' ? 'var(--accent-green)' : 'var(--text-muted)',
                                        transition: 'all 0.3s ease',
                                    }}>
                                        {status === 'done' ? <CheckCircle size={13} /> : step.index}
                                    </div>
                                    <span style={{
                                        fontSize: 10, fontWeight: 500,
                                        color: status === 'active' ? 'var(--accent-purple)' : status === 'done' ? 'var(--accent-green)' : 'var(--text-muted)',
                                        whiteSpace: 'nowrap',
                                    }}>{step.label}</span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div style={{
                                        width: 48, height: 2, margin: '0 4px', marginBottom: 16,
                                        background: getStepStatus(steps[i + 1].id, currentScreen) !== 'pending'
                                            ? 'var(--accent-purple)'
                                            : 'var(--border-subtle)',
                                        transition: 'background 0.3s ease',
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* AI Assist Badge */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 100,
                    background: 'var(--accent-purple-dim)',
                    border: '1px solid hsla(262,83%,68%,0.2)',
                }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-purple)', animation: 'pulse-glow 2s infinite' }} />
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--accent-purple)' }}>AI Assist Active</span>
                </div>
            </div>
        </header>
    );
}
