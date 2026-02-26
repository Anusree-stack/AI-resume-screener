import type { Candidate, JobDescription, Bucket } from './types';

export const mockJD: JobDescription = {
    id: 'jd1',
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'Remote / Bangalore',
    experienceMin: 4,
    experienceMax: 8,
    description: `We're looking for a Senior Full-Stack Engineer to join our product team. You'll work on mission-critical features, lead technical architecture decisions, and mentor junior engineers.\n\nYou'll be embedded in a cross-functional team and collaborate closely with Product, Design, and Data.`,
    mustHaveSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    niceToHave: ['GraphQL', 'AWS', 'Redis', 'Docker', 'System Design'],
    status: 'Open',
    createdAt: '2026-02-15T10:00:00Z',
};

export const jdLibrary: JobDescription[] = [
    mockJD,
    {
        id: 'jd2',
        title: 'Product Manager - Fintech',
        department: 'Product',
        location: 'Bangalore',
        experienceMin: 5,
        experienceMax: 10,
        description: 'Drive the roadmap for our core payment products. Work with engineering to define requirements and deliver high-impact features.',
        mustHaveSkills: ['Product Strategy', 'User Research', 'SQL', 'Fintech Experience'],
        niceToHave: ['MBA', 'Analytics', 'Agile'],
        status: 'Open',
        createdAt: '2026-02-10T09:00:00Z',
    },
    {
        id: 'jd3',
        title: 'Backend Lead (Node.js)',
        department: 'Engineering',
        location: 'Remote',
        experienceMin: 7,
        experienceMax: 12,
        description: 'Lead the backend architecture for our scalable cloud systems. Ensure high performance and reliability.',
        mustHaveSkills: ['Node.js', 'PostgreSQL', 'Redis', 'System Design', 'Cloud Architecture'],
        niceToHave: ['Kubernetes', 'Go', 'Python'],
        status: 'Closed',
        createdAt: '2026-01-20T14:00:00Z',
    },
    {
        id: 'jd4',
        title: 'Frontend Engineer (React)',
        department: 'Engineering',
        location: 'Mumbai',
        experienceMin: 3,
        experienceMax: 6,
        description: 'Build beautiful and interactive user interfaces for our customer portal.',
        mustHaveSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux'],
        niceToHave: ['Next.js', 'Testing Library', 'Figma'],
        status: 'Draft',
        createdAt: '2026-02-25T11:30:00Z',
    },
];

// Helper to generate realistic random names
const firstNames = ['Amit', 'Priya', 'Suresh', 'Anjali', 'Vikram', 'Deepa', 'Rahul', 'Sneha', 'Karthik', 'Meera', 'Arjun', 'Riya', 'Sameer', 'Pooja', 'Vivek', 'Neha'];
const lastNames = ['Sharma', 'Verma', 'Nair', 'Menon', 'Kapoor', 'Reddy', 'Singh', 'Patel', 'Das', 'Iyer', 'Gupta', 'Chaudhary', 'Joshi', 'Mishra'];

export const generateMockCandidates = (count: number, jd: JobDescription): Candidate[] => {
    const candidates: Candidate[] = [];
    const mustHaves = jd.mustHaveSkills;

    for (let i = 1; i <= count; i++) {
        const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${fname} ${lname}`;
        const email = `${fname.toLowerCase()}.${lname.toLowerCase()}${i}@example.com`;
        const yoe = Math.max(0, Math.floor(Math.random() * 12)); // 0-12 years

        // Skill alignment logic
        const matchedSkills = mustHaves.filter(() => Math.random() > 0.3);
        const violations = mustHaves.filter(s => !matchedSkills.includes(s));

        // If YOE is less than min, add as violation
        if (yoe < jd.experienceMin) {
            violations.push(`Experience below minimum (${yoe} years vs ${jd.experienceMin} required)`);
        }

        const score = Math.floor(Math.random() * 60) + 30; // 30-90 base
        // Penalize for violations
        const finalScore = Math.max(0, Math.min(100, score - (violations.length * 8)));

        let bucket: Bucket = 'low';
        if (finalScore >= 80) bucket = 'strong';
        else if (finalScore >= 50) bucket = 'potential';

        candidates.push({
            id: `gen-${i}`,
            name,
            email,
            phone: `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`,
            currentRole: 'Software Engineer',
            currentCompany: 'Tech Corp',
            yearsOfExperience: yoe,
            location: 'Multiple',
            education: 'Bachelor Center',
            skills: [...matchedSkills, 'JavaScript', 'HTML', 'CSS'],
            compositeScore: finalScore,
            bucket,
            dimensions: [
                { label: 'Skill Alignment', score: Math.floor(finalScore * 0.4), max: 40, reasoning: 'Simulated based on JD alignment.' },
                { label: 'Experience', score: Math.floor(finalScore * 0.3), max: 30, reasoning: 'Simulated years of experience check.' },
                { label: 'Role Fit', score: Math.floor(finalScore * 0.15), max: 15, reasoning: 'Simulated context match.' },
                { label: 'Trajectory', score: Math.floor(finalScore * 0.15), max: 15, reasoning: 'Simulated career growth.' },
            ],
            mustHaveViolations: violations,
            summary: `This is a programmatically generated candidate profile for scaling tests. Total score: ${finalScore}%`,
            isShortlisted: false,
            resumeFileName: 'mock_resume.pdf'
        });
    }

    return candidates;
};

export const mockCandidates: Candidate[] = [
    // Keep a few manual ones for detail view richness
    {
        id: 'c1',
        name: 'Aditya Sharma',
        email: 'aditya.sharma@example.com',
        phone: '+91 98765 43210',
        currentRole: 'Senior Software Engineer',
        currentCompany: 'Razorpay',
        yearsOfExperience: 6,
        location: 'Bangalore',
        education: 'B.Tech CS, IIT Bombay',
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL', 'AWS'],
        compositeScore: 91,
        bucket: 'strong',
        dimensions: [
            { label: 'Skill Alignment', score: 37, max: 40, reasoning: 'Covers all 4 must-have skills. Strong match on React, Node.js, TypeScript, and PostgreSQL. Also proficient in GraphQL and AWS which are nice-to-haves.' },
            { label: 'Relevant Experience', score: 28, max: 30, reasoning: '6 years in full-stack roles at high-growth fintech companies. Led end-to-end feature delivery on payment infrastructure.' },
            { label: 'Role Context', score: 13, max: 15, reasoning: 'Senior-level experience with demonstrated ownership at a comparable company scale. Strong leadership signals.' },
            { label: 'Career Trajectory', score: 13, max: 15, reasoning: 'Clear upward progression from SDE1 → SDE2 → Senior in 6 years. Active open-source contributor.' },
        ],
        mustHaveViolations: [],
        summary: 'Excellent match. Aditya checks all must-have skill boxes and brings 6 years of high-impact full-stack experience from a comparable product environment. His trajectory is strong with no red flags.',
        isShortlisted: false,
        resumeFileName: 'aditya_sharma_resume.pdf',
    },
    // ... rest of the candidates can be generated or kept
];
