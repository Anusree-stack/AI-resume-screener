// src/components/Breadcrumbs.tsx
import { ChevronRight, Home } from 'lucide-react';
import type { AppScreen } from '../types';

interface BreadcrumbsProps {
    currentScreen: AppScreen;
    onNavigate: (screen: AppScreen) => void;
}

const SCREENS: { id: AppScreen; label: string }[] = [
    { id: 'jd-list', label: 'JD Library' },
    { id: 'jd-setup', label: 'Job Setup' },
    { id: 'cv-upload', label: 'Upload CVs' },
    { id: 'dashboard', label: 'Screening Dashboard' },
    { id: 'shortlist', label: 'Final Shortlist' },
];

export default function Breadcrumbs({ currentScreen, onNavigate }: BreadcrumbsProps) {
    const currentIndex = SCREENS.findIndex(s => s.id === currentScreen);

    // Don't show on landing
    if (currentScreen === 'home' || currentScreen === 'candidate-detail') return null;

    return (
        <nav style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 32px', borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-card)',
        }}>
            <button
                onClick={() => onNavigate('home')}
                style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', display: 'flex', alignItems: 'center'
                }}
            >
                <Home size={14} />
            </button>

            {SCREENS.map((screen, idx) => {
                const isActive = screen.id === currentScreen;
                const isPast = idx < currentIndex;

                if (idx > currentIndex && screen.id !== 'jd-list') return null;

                return (
                    <div key={screen.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ChevronRight size={14} color="var(--text-muted)" opacity={0.5} />
                        <button
                            onClick={() => (isPast || screen.id === 'jd-list') && onNavigate(screen.id)}
                            disabled={!isPast && screen.id !== 'jd-list' && !isActive}
                            style={{
                                background: 'none', border: 'none',
                                cursor: (isPast || screen.id === 'jd-list') ? 'pointer' : 'default',
                                fontSize: 12, fontWeight: isActive ? 700 : 500,
                                color: isActive ? 'var(--accent-purple)' : (isPast ? 'var(--text-primary)' : 'var(--text-muted)'),
                                transition: 'color 0.2s',
                            }}
                        >
                            {screen.label}
                        </button>
                    </div>
                );
            })}
        </nav>
    );
}
