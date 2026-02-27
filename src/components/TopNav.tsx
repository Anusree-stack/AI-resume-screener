// src/components/TopNav.tsx
import { useState, useEffect } from 'react';
import { Moon, Sun, Plus } from 'lucide-react';
import type { AppScreen } from '../types';

interface TopNavProps {
    currentScreen: AppScreen;
    onHome: () => void;
    onCreateJD: () => void;
}

export default function TopNav({ currentScreen, onHome, onCreateJD }: TopNavProps) {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    }, [dark]);

    const isActive = (screens: AppScreen[]) => screens.includes(currentScreen);

    const navLinkStyle = (active: boolean): React.CSSProperties => ({
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 14px',
        borderRadius: 7,
        fontSize: 13.5,
        fontWeight: active ? 600 : 500,
        color: active ? 'var(--accent-purple)' : 'var(--text-secondary)',
        background: active ? 'var(--accent-purple-dim)' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 120ms ease',
        fontFamily: 'Inter, sans-serif',
        textDecoration: 'none',
    });

    return (
        <nav style={{
            position: 'sticky', top: 0, zIndex: 100,
            height: 60,
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center',
            padding: '0 32px',
            gap: 8,
            backdropFilter: 'blur(12px)',
        }}>
            {/* Logo */}
            <button
                onClick={onHome}
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: 8 }}
                id="nav-logo"
            >
                <div style={{
                    width: 32, height: 32, borderRadius: 9,
                    background: 'var(--accent-purple)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                </div>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    TalentIQ
                </span>
            </button>

            {/* Divider */}
            <div style={{ width: 1, height: 24, background: 'var(--border-subtle)', margin: '0 8px' }} />

            {/* Nav links */}
            <button
                onClick={onHome}
                style={navLinkStyle(isActive(['home']))}
                id="nav-overview"
            >
                Overview
            </button>

            {/* Right side */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Create JD button */}
                <button
                    onClick={onCreateJD}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '7px 16px',
                        background: 'var(--accent-purple)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'background 120ms ease',
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = 'hsl(262,72%,46%)')}
                    onMouseOut={e => (e.currentTarget.style.background = 'var(--accent-purple)')}
                    id="nav-create-jd"
                >
                    <Plus size={14} />
                    Create JD
                </button>

                {/* Theme toggle */}
                <button
                    onClick={() => setDark(d => !d)}
                    title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                    style={{
                        width: 34, height: 34,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 8,
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        transition: 'all 120ms ease',
                    }}
                    id="theme-toggle"
                >
                    {dark ? <Sun size={15} /> : <Moon size={15} />}
                </button>

                {/* Status pill */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px',
                    background: 'var(--strong-bg)',
                    border: '1px solid var(--strong-border)',
                    borderRadius: 100,
                    fontSize: 12, fontWeight: 600,
                    color: 'var(--strong-text)',
                }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)', display: 'inline-block' }} />
                    Screening Mode
                </div>
            </div>
        </nav>
    );
}
