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
    status: 'Screening in Progress',
    createdAt: '2026-02-07T10:00:00Z',
    applicationCount: 214,
    strongCount: 38,
    shortlistedCount: 12,
    daysOpen: 20,
};

export const jdLibrary: JobDescription[] = [
    mockJD,
    {
        id: 'jd2',
        title: 'Product Manager – Fintech',
        department: 'Product',
        location: 'Bangalore',
        experienceMin: 5,
        experienceMax: 10,
        description: 'Drive the roadmap for our core payment products. Work with engineering to define requirements and deliver high-impact features.',
        mustHaveSkills: ['Product Strategy', 'User Research', 'SQL', 'Fintech Experience'],
        niceToHave: ['MBA', 'Analytics', 'Agile'],
        status: 'Live – Accepting Applications',
        createdAt: '2026-02-10T09:00:00Z',
        applicationCount: 87,
        strongCount: 14,
        shortlistedCount: 0,
        daysOpen: 17,
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
        status: 'Offer Closed',
        createdAt: '2026-01-12T14:00:00Z',
        applicationCount: 143,
        strongCount: 22,
        shortlistedCount: 5,
        daysOpen: 38,
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
        applicationCount: 0,
        strongCount: 0,
        shortlistedCount: 0,
        daysOpen: 2,
    },
    {
        id: 'jd5',
        title: 'Data Analyst – Growth',
        department: 'Analytics',
        location: 'Hyderabad',
        experienceMin: 2,
        experienceMax: 5,
        description: 'Work with cross-functional teams to generate insights from product and marketing data.',
        mustHaveSkills: ['SQL', 'Python', 'Tableau', 'Statistics'],
        niceToHave: ['dbt', 'BigQuery', 'Looker'],
        status: 'Interview',
        createdAt: '2026-01-28T10:00:00Z',
        applicationCount: 96,
        strongCount: 19,
        shortlistedCount: 6,
        daysOpen: 30,
    },
    {
        id: 'jd6',
        title: 'DevOps Engineer',
        department: 'Infrastructure',
        location: 'Remote',
        experienceMin: 4,
        experienceMax: 8,
        description: 'Manage CI/CD pipelines, Kubernetes infrastructure, and cloud observability tooling.',
        mustHaveSkills: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD'],
        niceToHave: ['Go', 'Prometheus', 'Grafana'],
        status: 'Offer Extended',
        createdAt: '2026-01-20T09:00:00Z',
        applicationCount: 61,
        strongCount: 11,
        shortlistedCount: 3,
        daysOpen: 37,
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

        if (yoe < jd.experienceMin) {
            violations.push(`Experience below minimum (${yoe} years vs ${jd.experienceMin} required)`);
        }

        const score = Math.floor(Math.random() * 60) + 30;
        const finalScore = Math.max(0, Math.min(100, score - (violations.length * 8)));

        let bucket: Bucket = 'low';
        if (finalScore >= 80) bucket = 'strong';
        else if (finalScore >= 50) bucket = 'potential';

        const seniorities = ['Entry', 'Mid', 'Senior', 'Lead', 'Director'];
        const domains = ['Fintech', 'SaaS', 'Healthcare', 'E-commerce', 'EdTech'];
        const educations = ['Bachelors', 'Masters', 'PhD'];

        candidates.push({
            id: `gen-${i}`,
            name,
            email,
            phone: `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`,
            currentRole: 'Software Engineer',
            currentCompany: 'Tech Corp',
            yearsOfExperience: yoe,
            location: 'Multiple',
            seniority: seniorities[Math.floor(Math.random() * seniorities.length)],
            domain: domains[Math.floor(Math.random() * domains.length)],
            education: educations[Math.floor(Math.random() * educations.length)],
            isReferral: Math.random() < 0.15,
            experienceHistory: [
                {
                    role: 'Full Stack Developer',
                    company: 'InnovaTech Solutions',
                    duration: '2022 – Present',
                    summary: 'Leading frontend migration to Next.js and optimizing database queries for high-scale traffic.'
                },
                {
                    role: 'Junior Engineer',
                    company: 'DataStream Inc',
                    duration: '2019 – 2022',
                    summary: 'Developed core features for a real-time analytics dashboard used by 50+ enterprise clients.'
                }
            ],
            skills: [...matchedSkills, 'JavaScript', 'HTML', 'CSS'],
            compositeScore: finalScore,
            bucket,
            dimensions: [
                { label: 'Skill Alignment', score: Math.floor(finalScore * 0.4), max: 40, reasoning: 'Simulated based on JD alignment.' },
                { label: 'Relevant Experience', score: Math.floor(finalScore * 0.3), max: 30, reasoning: 'Simulated years of experience check.' },
                { label: 'Role Context', score: Math.floor(finalScore * 0.15), max: 15, reasoning: 'Simulated context match.' },
                { label: 'Career Trajectory', score: Math.floor(finalScore * 0.15), max: 15, reasoning: 'Simulated career growth.' },
            ],
            mustHaveViolations: violations,
            summary: `Programmatically generated candidate for load testing. Composite score: ${finalScore}.`,
            isShortlisted: false,
            isUnderHMReview: false,
            resumeFileName: 'mock_resume.pdf'
        });
    }

    return candidates;
};

export const mockCandidates: Candidate[] = [
    {
        id: 'c1',
        name: 'Aditya Sharma',
        email: 'aditya.sharma@example.com',
        phone: '+91 98765 43210',
        currentRole: 'Senior Software Engineer',
        currentCompany: 'Razorpay',
        yearsOfExperience: 6,
        location: 'Bangalore',
        education: 'B.Tech CS · IIT Bombay · 2019',
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL', 'AWS'],
        compositeScore: 91,
        bucket: 'strong',
        experienceHistory: [
            { role: 'Senior Software Engineer', company: 'Razorpay', duration: '2021 – Present', summary: 'Architected and built a high-throughput merchant dashboard using React and TypeScript. Optimized Node.js background processors reducing latency by 45%.' },
            { role: 'Software Engineer', company: 'Zomato', duration: '2019 – 2021', summary: 'Contributed to the core ordering engine. Implemented real-time delivery tracking features using Node.js and Redis.' }
        ],
        dimensions: [
            { label: 'Skill Alignment', score: 37, max: 40, reasoning: 'Covers all 4 must-have skills. Strong match on React, Node.js, TypeScript, and PostgreSQL. Also proficient in GraphQL and AWS which are nice-to-haves. No skill gaps identified.' },
            { label: 'Relevant Experience', score: 28, max: 30, reasoning: '6 years in full-stack roles at high-growth fintech companies. Led end-to-end feature delivery on payment infrastructure. Experience directly maps to the team\'s scale and complexity.' },
            { label: 'Role Context', score: 13, max: 15, reasoning: 'Senior-level role at Razorpay — a directly comparable company in terms of technical depth and product scale. Has demonstrated ownership of critical product areas.' },
            { label: 'Career Trajectory', score: 13, max: 15, reasoning: 'Clear upward progression: SDE1 → SDE2 → Senior in 6 years. Active GitHub contributor with production OSS usage. Trajectory indicates continued growth.' },
        ],
        mustHaveViolations: [],
        summary: 'Aditya is an exceptional match for this role. With 6 years of high-impact full-stack engineering at Razorpay, he covers all four must-have skills and brings direct fintech product experience. His career trajectory is consistently upward with no red flags, making him a strong candidate for immediate advancement.',
        isShortlisted: false,
        isUnderHMReview: false,
        resumeFileName: 'aditya_sharma_resume.pdf',
    },
    {
        id: 'c2',
        name: 'Priya Nair',
        email: 'priya.nair@example.com',
        phone: '+91 91234 56789',
        currentRole: 'Full-Stack Engineer',
        currentCompany: 'CRED',
        yearsOfExperience: 4,
        location: 'Bangalore',
        education: 'B.E. CS · BITS Pilani · 2021',
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Redis'],
        compositeScore: 78,
        bucket: 'potential',
        experienceHistory: [
            { role: 'Full-Stack Engineer', company: 'CRED', duration: '2021 – Present', summary: 'Developed user onboarding flows and reward systems. Managed complex state transitions in React and scaled microservices in Node.js.' },
            { role: 'Intern', company: 'Microsoft', duration: '2020 – 2021', summary: 'Worked on developer tools and VS Code extensions. Improved telemetry collection efficiency.' }
        ],
        dimensions: [
            { label: 'Skill Alignment', score: 30, max: 40, reasoning: 'Strong match on React, Node.js, and TypeScript. PostgreSQL gap is notable — she uses MongoDB primarily. Redis experience partially compensates for backend depth.' },
            { label: 'Relevant Experience', score: 22, max: 30, reasoning: '4 years of full-stack experience. Currently at CRED, working on consumer-facing credit products. Good exposure but slightly below seniority expectations.' },
            { label: 'Role Context', score: 14, max: 15, reasoning: 'CRED is a high-velocity product environment with strong engineering culture. Transferable context, though the infrastructure scale differs.' },
            { label: 'Career Trajectory', score: 12, max: 15, reasoning: 'Steady progression. Led a rewrite of the onboarding flow at CRED. Some OSS activity. Trajectory is solid but not exceptional.' },
        ],
        mustHaveViolations: ['PostgreSQL'],
        summary: 'Priya is a capable full-stack engineer with 4 years of relevant experience at CRED. Her React and Node.js proficiency is solid, though the PostgreSQL gap warrants a technical discussion. Her fintech context and product sensibility are positives. Recommend advancing for a technical screen to assess database adaptability.',
        isShortlisted: false,
        isUnderHMReview: false,
        resumeFileName: 'priya_nair_resume.pdf',
    },
    {
        id: 'c3',
        name: 'Karthik Menon',
        email: 'karthik.menon@example.com',
        phone: '+91 90000 11111',
        currentRole: 'Frontend Engineer',
        currentCompany: 'PhonePe',
        yearsOfExperience: 5,
        location: 'Hyderabad',
        education: 'B.Tech ECE · NIT Trichy · 2020',
        skills: ['React', 'TypeScript', 'CSS', 'Webpack', 'GraphQL'],
        compositeScore: 54,
        bucket: 'potential',
        experienceHistory: [
            { role: 'Frontend Engineer', company: 'PhonePe', duration: '2020 – Present', summary: 'Owned the merchant-facing UI for the payment portal. Specialized in high-performance React components and design system implementation.' }
        ],
        dimensions: [
            { label: 'Skill Alignment', score: 20, max: 40, reasoning: 'Strong React and TypeScript skills, but Node.js and PostgreSQL are absent. This is a significant gap for a full-stack role requiring backend ownership.' },
            { label: 'Relevant Experience', score: 18, max: 30, reasoning: '5 years of experience, but predominantly frontend. Limited backend exposure is a mismatch for this Senior Full-Stack position.' },
            { label: 'Role Context', score: 9, max: 15, reasoning: 'PhonePe is a credible context with strong product complexity. However, the frontend specialization limits direct applicability.' },
            { label: 'Career Trajectory', score: 7, max: 15, reasoning: 'Stable progression as a frontend specialist. No clear signals of transitioning to full-stack roles in the term.' },
        ],
        mustHaveViolations: ['Node.js', 'PostgreSQL'],
        summary: 'Karthik has strong frontend credentials and 5 years of experience at PhonePe, but the absence of Node.js and PostgreSQL represents a significant gap for this full-stack role. Recommend for a frontend-specific opening if one becomes available.',
        isShortlisted: false,
        isUnderHMReview: false,
        resumeFileName: 'karthik_menon_resume.pdf',
    },
    {
        id: 'c4',
        name: 'Sneha Kapoor',
        email: 'sneha.kapoor@example.com',
        phone: '+91 88888 22222',
        currentRole: 'Junior Developer',
        currentCompany: 'StartupXYZ',
        yearsOfExperience: 2,
        location: 'Delhi',
        education: 'B.Sc CS · Delhi University · 2023',
        skills: ['JavaScript', 'React', 'HTML', 'CSS'],
        compositeScore: 31,
        bucket: 'low',
        experienceHistory: [
            { role: 'Junior Developer', company: 'StartupXYZ', duration: '2023 – Present', summary: 'Building the company landing page and internal admin tools. Gaining experience in React and Firebase.' }
        ],
        dimensions: [
            { label: 'Skill Alignment', score: 10, max: 40, reasoning: 'Basic JavaScript and React only. TypeScript, Node.js, and PostgreSQL are all absent. The must-have coverage falls significantly short of role requirements.' },
            { label: 'Relevant Experience', score: 9, max: 30, reasoning: '2 years of experience — significantly below the 4–8 year requirement. No exposure to production-scale engineering environments.' },
            { label: 'Role Context', score: 7, max: 15, reasoning: 'Early-stage startup context. Limited complexity of the engineering challenges compared to role requirements.' },
            { label: 'Career Trajectory', score: 5, max: 15, reasoning: 'Early career. Potential is unproven at this stage. Would need 2–3 more years of growth before being competitive.' },
        ],
        mustHaveViolations: ['Node.js', 'TypeScript', 'PostgreSQL', 'Experience below minimum (2 years vs 4 required)'],
        summary: 'Sneha is at an early stage of her engineering career with 2 years of experience. While she shows initiative, the skill and experience gaps are substantial for this senior role. Not a match at this time — recommend revisiting in 2–3 years.',
        isShortlisted: false,
        isUnderHMReview: false,
        resumeFileName: 'sneha_kapoor_resume.pdf',
    },
];
