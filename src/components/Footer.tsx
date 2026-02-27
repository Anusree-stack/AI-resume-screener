// src/components/Footer.tsx
export default function Footer() {
    return (
        <footer style={{
            marginTop: 64,
            padding: '20px 0 0',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: 'var(--text-muted)',
        }}>
            <span>TalentIQ · Recruiter Decision OS</span>
            <span>AI scores are informational only and do not constitute automated hiring decisions.</span>
        </footer>
    );
}
