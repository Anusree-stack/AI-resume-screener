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

// ─── Realistic Data Pools ─────────────────────────────────────────────────────

const FIRST_NAMES = [
    'Aarav', 'Aditi', 'Akash', 'Amrita', 'Ananya', 'Arjun', 'Arnav', 'Avni',
    'Chirag', 'Deepika', 'Dev', 'Divya', 'Gaurav', 'Ishaan', 'Karthik', 'Kavya', 'Kiran',
    'Manish', 'Megha', 'Mihir', 'Nandini', 'Nikhil', 'Pallavi', 'Pranav', 'Priya',
    'Rahul', 'Rajeev', 'Riya', 'Rohan', 'Sakshi', 'Sanya', 'Shweta', 'Siddharth',
    'Sneha', 'Suresh', 'Tanvi', 'Tushar', 'Uday', 'Varun', 'Vikram', 'Yash',
];

const LAST_NAMES = [
    'Agarwal', 'Bhatia', 'Chandra', 'Choudhary', 'Das', 'Deshpande', 'Gandhi',
    'Gupta', 'Iyer', 'Jain', 'Joshi', 'Kapoor', 'Kaur', 'Khan', 'Kumar',
    'Malik', 'Mehta', 'Menon', 'Mishra', 'Nair', 'Patel', 'Pillai', 'Rao',
    'Reddy', 'Saxena', 'Shah', 'Sharma', 'Singh', 'Sinha', 'Srivastava',
    'Tiwari', 'Varma', 'Verma',
];

const COMPANIES = [
    'Razorpay', 'CRED', 'Zepto', 'Meesho', 'Swiggy', 'Zomato', 'PhonePe', 'Paytm',
    'Flipkart', 'Ola', 'Udaan', 'Groww', 'Slice', 'Jupiter', 'Fi', 'Jar',
    'BrowserStack', 'Postman', 'CleverTap', 'MoEngage', 'Whatfix', 'Darwinbox',
    'Freshworks', 'Zoho', 'InfraCloud', 'HashedIn', 'ThoughtWorks', 'Sigmoid',
    'Licious', 'Spinny', 'FarEye', 'Exotel', 'Airtel', 'Jio', 'Tata Digital',
    'Infosys', 'Wipro', 'HCL Technologies', 'TCS Digital',
];

const PREV_COMPANIES = [
    'Accenture', 'Deloitte', 'EY GDS', 'PwC Technology', 'Capgemini', 'Cognizant',
    'Mphasis', 'Tech Mahindra', 'LTIMindtree', 'Hexaware', 'Persistent Systems',
    'Publicis Sapient', 'GlobalLogic', 'Nagarro', 'EPAM Systems',
];

const ROLES = [
    'Software Development Engineer II', 'Senior Software Engineer', 'Staff Engineer',
    'Senior Full-Stack Engineer', 'Backend Engineer', 'Frontend Engineer',
    'Platform Engineer', 'Site Reliability Engineer', 'Cloud Engineer',
    'Technology Lead', 'Engineering Manager', 'Principal Engineer',
];

const PREV_ROLES = [
    'Software Development Engineer', 'Junior Software Engineer', 'Associate Engineer',
    'Software Engineer I', 'Graduate Engineer Trainee', 'Intern → Full-time',
    'Full-Stack Developer', 'Backend Developer',
];

const LOCATIONS = [
    'Bangalore', 'Hyderabad', 'Mumbai', 'Pune', 'Chennai', 'Delhi NCR',
    'Gurgaon', 'Noida', 'Kolkata', 'Ahmedabad', 'Remote (India)',
];

const INSTITUTIONS = [
    'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
    'IIT Roorkee', 'BITS Pilani', 'BITS Hyderabad', 'BITS Goa',
    'NIT Trichy', 'NIT Surathkal', 'NIT Warangal', 'NIT Calicut',
    'Delhi University', 'Mumbai University', 'Anna University',
    'VIT Vellore', 'SRM University', 'Manipal University',
    'Christ University', 'Amity University', 'Symbiosis Institute',
];

const EDUCATION_LEVELS = ['B.Tech (CS)', 'B.Tech (ECE)', 'B.E. (CS)', 'B.Sc (CS)', 'M.Tech (CS)', 'M.S. (CS)', 'MBA (Technology)', 'PhD (CS)'];

const SENIORITIES = ['Mid', 'Mid', 'Senior', 'Senior', 'Senior', 'Lead', 'Entry'];
const DOMAINS = ['Fintech', 'SaaS', 'E-commerce', 'Healthcare', 'EdTech', 'Logistics', 'B2B'];

// ─── Realistic Work Summary Templates ─────────────────────────────────────────

const CURRENT_SUMMARIES = [
    (company: string, tech: string) => `Leading full-stack feature development on ${company}'s core product. Architected a microservice layer that reduced API response times by 38%. Mentors a team of 3 junior engineers and drives sprint planning alongside the product team. Tech stack: ${tech}.`,
    (company: string, tech: string) => `Owns end-to-end delivery of ${company}'s internal tooling platform. Migrated a monolithic codebase to service-oriented architecture, cutting deployment frequency from bi-weekly to daily. Collaborates closely with infrastructure to maintain 99.9% SLA. Uses ${tech} extensively.`,
    (company: string, tech: string) => `Senior contributor on ${company}'s growth engineering team. Built experimentation infrastructure that powers 50+ A/B tests per quarter. Drove a checkout flow redesign that increased conversion by 14%. Works primarily with ${tech}.`,
    (company: string, tech: string) => `Technical lead on ${company}'s real-time data pipeline, processing over 2M events/day. Introduced event-driven patterns that improved system resilience during peak load. Instrumental in hiring 2 engineers this quarter. Stack: ${tech}.`,
];

const PREV_SUMMARIES = [
    (company: string) => `Contributed to ${company}'s core platform team. Built RESTful APIs consumed by over 200k daily active users. Reduced database query latency by 40% through indexing strategy improvements.`,
    (company: string) => `Worked within ${company}'s agile engineering team. Delivered 6 major feature releases across 2 product lines. Gained strong exposure to distributed systems and asynchronous job processing.`,
    (company: string) => `Part of the early engineering team at ${company}. Developed foundational CRUD services, dashboard UI, and third-party integrations. Received "Best New Joiner" award in first year.`,
    (company: string) => `Full-stack development at ${company}, primarily on customer-facing web applications. Improved frontend performance scores by 45% via code splitting and lazy loading. Collaborated with design team on component library.`,
];

const TECH_STACKS = [
    'React, Node.js, TypeScript, PostgreSQL',
    'Next.js, Express.js, MongoDB, Redis',
    'React, Python (FastAPI), PostgreSQL, Docker',
    'Vue.js, Node.js, TypeScript, MySQL',
    'React, Node.js, GraphQL, AWS',
];

// ─── Score Reasoning Templates (50+ words each) ──────────────────────────────

function skillAlignmentReasoning(score: number, max: number, matchedCount: number, totalRequired: number, company: string): string {
    const pct = Math.round((score / max) * 100);
    if (pct >= 85) {
        return `Exceptional coverage of all ${totalRequired} required skills with deep production experience at ${company}. Skill recency is excellent, indicating active use of the primary tech stack. Semantic match with JD requirements is near-perfect, showing both breadth and specialized depth.`;
    } else if (pct >= 60) {
        return `Covers ${matchedCount} of ${totalRequired} mandatory skills. Missing criteria are partially offset by adjacent technology experience. Recency is moderate; some skills haven't been utilized in the most recent role. Overall technical alignment is solid but requires minor upskilling.`;
    } else {
        return `Significant skill gap detected; only ${matchedCount} of ${totalRequired} required skills are evidenced. Recency modifier is low, suggesting dated familiarity with the core stack. Technical alignment is below the threshold for immediate productivity in this specific role.`;
    }
}

function experienceAlignmentReasoning(score: number, max: number, yoe: number, minRequired: number, company: string): string {
    const pct = Math.round((score / max) * 100);
    if (pct >= 85) {
        return `Strong ${yoe}-year history with consistent domain advancement. Seniority level perfectly matches JD expectations, with clear evidence of ownership at ${company}. Stability signal is high, showing consistent tenure and increasing responsibility across all prior engineering positions.`;
    } else if (pct >= 60) {
        return `Meets the ${minRequired}-year threshold with ${yoe} years of total experience. Seniority alignment is good, though depth in specific domain verticals is slightly thinner than ideal. Stability is acceptable, hampered only by one relatively short tenure early in the career.`;
    } else {
        return `${yoe} years of experience falls ${yoe < minRequired ? 'below the mandatory minimum' : 'short of the ideal range'}. Domain-aligned tenure is limited, and seniority level is slightly junior for the role context. Stability signals are mixed due to frequent role transitions.`;
    }
}

function roleContextReasoning(score: number, max: number, company: string): string {
    const pct = Math.round((score / max) * 100);
    if (pct >= 80) {
        return `Clear ownership signals detected; architected revenue-critical systems at ${company}. Scale indicators are strong, including mentions of high-traffic user bases and system-level impact. Responsibilities align with a high-bandwidth senior individual contributor managing significant technical complexity.`;
    } else if (pct >= 55) {
        return `Moderate ownership signals with evidence of lead-level contributions in collaborative settings. Scale of systems handled is respectable but lacks the massive throughput required for top-tier scores. Role context shows a steady progression toward autonomous project ownership.`;
    } else {
        return `Limited evidence of broad ownership or system-scale complexity. Work reflects execution of well-scoped tasks under close guidance. Scope of impact is primarily feature-level rather than architecture-level, suggesting a more junior responsibility profile relative to JD needs.`;
    }
}

function trajectoryReasoning(score: number, max: number, yoe: number, company: string): string {
    const pct = Math.round((score / max) * 100);
    if (pct >= 80) {
        return `Excellent career trajectory over ${yoe} years with rapid title progression. Consistent domain focus and increasing scope indicate high performance recognition. Directional consistency is perfect, with each role at ${company} and earlier showing logical career growth.`;
    } else if (pct >= 55) {
        return `Healthy career trajectory with steady advancement. Title progression is industry-standard for a ${yoe}-year career. Some lateral domain shifts introduce minor noise, but overall growth remains positive toward senior-level contributions and ownership.`;
    } else {
        return `Trajectory signals are below expectations for this tenure. Title progression has been slower than peer averages, and domain consistency is variable. Responsibility growth isn't clearly demonstrated across different company stages or role history.`;
    }
}

// ─── Generate Realistic Mock Candidates ──────────────────────────────────────

export const generateMockCandidates = (count: number, jd: JobDescription): Candidate[] => {
    const candidates: Candidate[] = [];
    const mustHaves = jd.mustHaveSkills;

    for (let i = 1; i <= count; i++) {
        const fname = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const lname = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        const name = `${fname} ${lname}`;
        const email = `${fname.toLowerCase()}.${lname.toLowerCase()}${i}@gmail.com`;

        const yoe = Math.max(1, Math.floor(Math.random() * 12) + 1);
        const company = COMPANIES[Math.floor(Math.random() * COMPANIES.length)];
        const prevCompany = PREV_COMPANIES[Math.floor(Math.random() * PREV_COMPANIES.length)];
        const currentRole = ROLES[Math.floor(Math.random() * ROLES.length)];
        const prevRole = PREV_ROLES[Math.floor(Math.random() * PREV_ROLES.length)];
        const techStack = TECH_STACKS[Math.floor(Math.random() * TECH_STACKS.length)];

        const matchedSkills = mustHaves.filter(() => Math.random() > 0.3);
        const violations: string[] = mustHaves.filter(s => !matchedSkills.includes(s));
        if (yoe < jd.experienceMin) {
            violations.push(`Experience below minimum (${yoe}y vs ${jd.experienceMin}y required)`);
        }

        const baseScore = Math.floor(Math.random() * 55) + 35;
        const finalScore = Math.max(10, Math.min(100, baseScore - (violations.length * 9)));

        let bucket: Bucket = 'low';
        // STRICT GATING: Gating failures strictly prevent "Strong Match"
        if (violations.length === 0 && finalScore >= 80) {
            bucket = 'strong';
        } else if (finalScore >= 50) {
            bucket = 'potential';
        } else {
            bucket = 'low';
        }

        const institution = INSTITUTIONS[Math.floor(Math.random() * INSTITUTIONS.length)];
        const education = EDUCATION_LEVELS[Math.floor(Math.random() * EDUCATION_LEVELS.length)];
        const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
        const seniority = SENIORITIES[Math.floor(Math.random() * SENIORITIES.length)];
        const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];

        // Build realistic experience history based on years
        const currentStart = 2026 - (yoe > 3 ? Math.min(4, Math.round(yoe * 0.5)) : yoe);
        const prevEnd = currentStart;
        const prevStart = prevEnd - Math.max(1, yoe - Math.round(yoe * 0.5));

        const currentSummary = CURRENT_SUMMARIES[Math.floor(Math.random() * CURRENT_SUMMARIES.length)](company, techStack);
        const prevSummary = PREV_SUMMARIES[Math.floor(Math.random() * PREV_SUMMARIES.length)](prevCompany);

        const experienceHistory = [
            {
                role: currentRole,
                company,
                duration: `${currentStart} – Present`,
                summary: currentSummary,
            },
            ...(yoe > 2 ? [{
                role: prevRole,
                company: prevCompany,
                duration: `${prevStart} – ${prevEnd}`,
                summary: prevSummary,
            }] : []),
        ];

        const skillAlignScore = Math.round((finalScore / 100) * 40);
        const expAlignScore = Math.round((finalScore / 100) * 30);
        const roleContextScore = Math.round((finalScore / 100) * 15);
        const trajectoryScore = Math.round((finalScore / 100) * 15);

        candidates.push({
            id: `gen-${i}`,
            name,
            email,
            phone: `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`,
            currentRole,
            currentCompany: company,
            yearsOfExperience: yoe,
            location,
            seniority,
            domain,
            education,
            educationInstitution: institution,
            isReferral: Math.random() < 0.12,
            experienceHistory,
            skills: [...matchedSkills, 'JavaScript', 'HTML', 'CSS', 'Git'],
            compositeScore: finalScore,
            bucket,
            dimensions: [
                {
                    label: 'Skill Alignment',
                    score: skillAlignScore,
                    max: 40,
                    reasoning: skillAlignmentReasoning(skillAlignScore, 40, matchedSkills.length, mustHaves.length, company),
                },
                {
                    label: 'Relevant Experience',
                    score: expAlignScore,
                    max: 30,
                    reasoning: experienceAlignmentReasoning(expAlignScore, 30, yoe, jd.experienceMin, company),
                },
                {
                    label: 'Role Context & Complexity',
                    score: roleContextScore,
                    max: 15,
                    reasoning: roleContextReasoning(roleContextScore, 15, company),
                },
                {
                    label: 'Career Trajectory',
                    score: trajectoryScore,
                    max: 15,
                    reasoning: trajectoryReasoning(trajectoryScore, 15, yoe, company),
                },
            ],
            mustHaveSkills: mustHaves,
            mustHaveViolations: violations,
            summary: `${name} shows ${finalScore >= 80 ? 'strong' : finalScore >= 50 ? 'moderate' : 'limited'} alignment for ${jd.title}. ${yoe}y of experience, currently ${currentRole} at ${company}. Matched ${matchedSkills.length}/${mustHaves.length} core skills.${violations.length > 0 ? ` Note: ${violations[0]} gap identified.` : ' No gating violations identified.'}`,
            isShortlisted: false,
            isUnderHMReview: false,
            resumeFileName: `${fname.toLowerCase()}_${lname.toLowerCase()}_resume.pdf`,
        });
    }

    return candidates;
};

// ─── Curated Showcase Candidates ─────────────────────────────────────────────

export const mockCandidates: Candidate[] = [
    {
        id: 'c1',
        name: 'Aditya Sharma',
        email: 'aditya.sharma@gmail.com',
        phone: '+91 98765 43210',
        currentRole: 'Senior Software Engineer (Full-Stack)',
        currentCompany: 'Razorpay',
        yearsOfExperience: 6,
        location: 'Bangalore',
        seniority: 'Senior',
        domain: 'Fintech',
        education: 'B.Tech (CS)',
        educationInstitution: 'IIT Bombay',
        isReferral: false,
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL', 'AWS', 'Redis', 'Docker'],
        compositeScore: 91,
        bucket: 'strong',
        experienceHistory: [
            {
                role: 'Senior Software Engineer',
                company: 'Razorpay',
                duration: '2021 – Present',
                summary: `Architected and owns the merchant dashboard platform serving 8 million+ merchants across India. Led a full rewrite of the payment analytics service using Node.js and TypeScript, reducing average report generation time from 12s to 1.4s. Introduced a feature flagging system that now powers over 200 controlled rollouts per quarter. Mentors a team of 3 junior engineers and conducts bi-weekly design reviews.`,
            },
            {
                role: 'Software Development Engineer II',
                company: 'Zomato',
                duration: '2019 – 2021',
                summary: `Core contributor on Zomato's real-time delivery tracking infrastructure, handling 400k+ concurrent sessions during peak hours. Built the event-driven location pipeline using Node.js and Redis Pub/Sub. Led the migration of the rider notification system to a new queue-based architecture, improving delivery accuracy by 22%. Worked directly with the CTO's office on a high-visibility reliability initiative.`,
            },
            {
                role: 'Software Engineer (Intern → Full-time)',
                company: 'Freshworks',
                duration: '2017 – 2019',
                summary: `Joined as summer intern and converted to full-time upon graduation. Developed core CRUD APIs for Freshdesk's ticketing engine using Node.js and PostgreSQL. Improved frontend render performance by 35% through component memoization and lazy loading strategies. First engineer to introduce TypeScript in the team, which later became a team-wide standard.`,
            },
        ],
        dimensions: [
            {
                label: 'Skill Alignment',
                score: 37,
                max: 40,
                reasoning: 'Covers all 4 required skills with evidence of active production use in the most recent role at Razorpay. TypeScript, React, and PostgreSQL appear across multiple positions, indicating deep, not superficial, familiarity. Also proficient in GraphQL and AWS which are JD nice-to-haves, further boosting semantic alignment. Recency modifier is maximum — all primary skills are actively used today.',
            },
            {
                label: 'Relevant Experience',
                score: 28,
                max: 30,
                reasoning: '6 years of experience in domain-aligned roles, all within high-scale fintech and consumer tech environments. Seniority alignment is strong — holds a Senior Engineer title with demonstrated scope that exceeds individual contribution. Stability signal is excellent: no tenure below 2 years across any position. Domain-aligned tenure is 100%, with all experience directly applicable to this JD\'s expectations.',
            },
            {
                label: 'Role Context & Complexity',
                score: 13,
                max: 15,
                reasoning: 'Strong ownership signals throughout — "architected", "owns", "led rewrite", and "mentors" appear in the primary role description. Scale indicators are present: 8 million+ merchants, 400k concurrent sessions, and 200 rollouts per quarter reflect real production complexity. Responsibility classification: Senior IC with active mentorship and cross-functional influence. Role context is directly comparable to the target position.',
            },
            {
                label: 'Career Trajectory',
                score: 13,
                max: 15,
                reasoning: 'Clear upward trajectory: Intern → SDE I → SDE II → Senior Engineer across 6 years, reflecting above-average promotion velocity. Scope of ownership has expanded at each step — from CRUD contributions at Freshworks to full platform ownership at Razorpay. Domain direction is consistent: all roles are in product engineering within high-growth consumer or fintech companies. No lateral drift or unexplained breaks in progression.',
            },
        ],
        mustHaveViolations: [],
        summary: 'Aditya is a high-fidelity match for this role. With 6 years of full-stack engineering experience at Razorpay and prior stints at Zomato and Freshworks, he covers every must-have skill with production-level depth. His ownership of a platform serving 8M+ merchants, combined with mentorship activity and consistent upward career progression, places him firmly in the Strong Match tier with no eligibility constraints.',
        isShortlisted: false,
        isUnderHMReview: false,
        resumeFileName: 'aditya_sharma_resume.pdf',
    },
    {
        id: 'c2',
        name: 'Priya Nair',
        email: 'priya.nair@gmail.com',
        phone: '+91 91234 56789',
        currentRole: 'Full-Stack Engineer',
        currentCompany: 'CRED',
        yearsOfExperience: 4,
        location: 'Bangalore',
        seniority: 'Mid',
        domain: 'Fintech',
        education: 'B.E. (CS)',
        educationInstitution: 'BITS Pilani',
        isReferral: false,
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Redis', 'GraphQL'],
        compositeScore: 78,
        bucket: 'potential',
        experienceHistory: [
            {
                role: 'Full-Stack Engineer',
                company: 'CRED',
                duration: '2021 – Present',
                summary: `Member of CRED's core credit management and onboarding squad. Designed and shipped the multi-step loan application flow, handling over 1 lakh submissions daily. Refactored the rewards redemption journey to reduce drop-off by 18%. Maintains the Node.js BFF layer that orchestrates 14 downstream microservices. Strong ownership of the React component library shared across 4 product squads.`,
            },
            {
                role: 'Software Engineering Intern',
                company: 'Microsoft',
                duration: '2020 – 2021',
                summary: `6-month internship within Microsoft's developer tooling division. Built a VS Code extension for real-time telemetry monitoring used by 1,200+ internal developers. Improved telemetry event batching efficiency by 28% through async processing refactors. Received a Pre-Placement Offer (PPO) on completion of the internship program.`,
            },
        ],
        dimensions: [
            {
                label: 'Skill Alignment',
                score: 30,
                max: 40,
                reasoning: 'Strong on 3 of 4 required skills — React, Node.js, and TypeScript are all actively used in the current role at CRED. PostgreSQL is the primary gap: Priya\'s primary database is MongoDB, and no PostgreSQL exposure is evidenced in either position. Redis experience partially compensates for backend depth. Recency modifier for the 3 confirmed skills is high; the missing skill represents a meaningful but potentially bridgeable gap.',
            },
            {
                label: 'Relevant Experience',
                score: 22,
                max: 30,
                reasoning: '4 years of total experience, meeting the minimum JD threshold. All experience is in fintech-adjacent consumer credit products, which is directly relevant. Seniority alignment is partial — performing senior-level tasks at CRED without formal title uplift. Stability signal is good with no short tenures. Domain-aligned tenure is approximately 3.5 years, slightly below what would be expected for a Senior-level benchmark.',
            },
            {
                label: 'Role Context & Complexity',
                score: 14,
                max: 15,
                reasoning: 'Good ownership signals — "designed and shipped", "maintains", "strong ownership" are evidenced. Scale indicators are meaningful: 1 lakh daily submissions and a shared component library across 4 squads indicate real product complexity. Responsibility classification: Mid-level IC trending toward senior, with demonstrated system-level thinking. CRED is a credible engineering environment with high engineering standards.',
            },
            {
                label: 'Career Trajectory',
                score: 12,
                max: 15,
                reasoning: 'Solid trajectory from a high-pedigree internship (Microsoft PPO) into a mid-level role at CRED. Scope within CRED has expanded over 3 years. However, title growth has been limited to a single level since joining, which is slightly below average velocity for the peer group. Domain progression is consistent — fintech engineering throughout. Trajectory signal is healthy but not exceptional given the years of experience.',
            },
        ],
        mustHaveViolations: ['PostgreSQL'],
        summary: 'Priya is a capable full-stack engineer with 4 years of high-quality experience at CRED and a Microsoft internship credential. Her React and Node.js depth is strong and her fintech context is a direct positive. The PostgreSQL gap is the only material flag — her primary database exposure is MongoDB. A technical screening conversation focused on database adaptability would clarify fit before advancing.',
        isShortlisted: false,
        isUnderHMReview: false,
        resumeFileName: 'priya_nair_resume.pdf',
    },
    {
        id: 'c3',
        name: 'Karthik Menon',
        email: 'karthik.menon@gmail.com',
        phone: '+91 90000 11111',
        currentRole: 'Senior Frontend Engineer',
        currentCompany: 'PhonePe',
        yearsOfExperience: 5,
        location: 'Hyderabad',
        seniority: 'Senior',
        domain: 'Fintech',
        education: 'B.Tech (ECE)',
        educationInstitution: 'NIT Trichy',
        isReferral: false,
        skills: ['React', 'TypeScript', 'CSS', 'Webpack', 'GraphQL', 'Next.js'],
        compositeScore: 54,
        bucket: 'potential',
        experienceHistory: [
            {
                role: 'Senior Frontend Engineer',
                company: 'PhonePe',
                duration: '2021 – Present',
                summary: `Owns the merchant-facing payments portal at PhonePe, serving 35 million+ merchant partners. Delivered a full UI redesign reducing task completion time by 24%. Leads the design system effort — built 80+ reusable components adopted across 6 product teams. Has deep expertise in React performance optimization, including virtual DOM diffing, memoization, and bundle splitting strategy.`,
            },
            {
                role: 'Frontend Developer',
                company: 'Juspay',
                duration: '2019 – 2021',
                summary: `Built front-end checkout experiences for 10+ enterprise banking clients including HDFC and Axis Bank. Specialised in cross-browser compatibility and accessibility compliance (WCAG 2.1 AA). Introduced Storybook for component documentation, which became standard across the engineering team.`,
            },
        ],
        dimensions: [
            {
                label: 'Skill Alignment',
                score: 20,
                max: 40,
                reasoning: 'Strong on React and TypeScript but Node.js and PostgreSQL are absent from the profile — both are must-have requirements for this full-stack role. GraphQL knowledge is a partial compensator but does not address the backend gap. The candidate excels in frontend specialisation, and their skills are deeply demonstrated in that domain. However, the semantic alignment with this JD\'s backend requirements is significantly below threshold.',
            },
            {
                label: 'Relevant Experience',
                score: 18,
                max: 30,
                reasoning: '5 years of experience, but entirely frontend-focused. Domain-aligned tenure from a JD perspective is limited to the React and TypeScript dimensions; backend relevance is negligible. Seniority alignment is partial — holds a Senior title, but the role scope is frontend-only, which does not fully map to a full-stack senior expectation. No Node.js or database engineering experience is evidenced in any position across the career history.',
            },
            {
                label: 'Role Context & Complexity',
                score: 9,
                max: 15,
                reasoning: 'Frontend ownership signals are strong — "owns", "leads design system", and "35 million+ merchants" are meaningful. However, from a full-stack perspective, scope is limited to the UI layer. No backend systems ownership, API design, or database modelling signals are present. Responsibility classification is Senior IC within a frontend-only domain — directly applicable to frontend roles, less so to full-stack expectations.',
            },
            {
                label: 'Career Trajectory',
                score: 7,
                max: 15,
                reasoning: 'Career progression within frontend engineering is consistent and upward — from developer to senior is well-evidenced. However, the trajectory is narrowing, not expanding. There are no signals of transitioning toward full-stack capabilities, backend ownership, or broader architectural influence. For a full-stack role, the directionality does not support the target scope, and no lateral expansion steps are indicated.',
            },
        ],
        mustHaveViolations: ['Node.js', 'PostgreSQL'],
        summary: 'Karthik is a strong senior frontend engineer with impressive credentials from PhonePe and Juspay, but this is a full-stack role. The absence of Node.js and PostgreSQL experience represents a critical gap — both are must-have requirements. His profile would be an excellent fit for a frontend-focused or UI Lead position. Recommend re-routing rather than advancing for this specific opening.',
        isShortlisted: false,
        isUnderHMReview: false,
        resumeFileName: 'karthik_menon_resume.pdf',
    },
    {
        id: 'c4',
        name: 'Sneha Kapoor',
        email: 'sneha.kapoor@gmail.com',
        phone: '+91 88888 22222',
        currentRole: 'Software Developer',
        currentCompany: 'Licious',
        yearsOfExperience: 2,
        location: 'Delhi NCR',
        seniority: 'Entry',
        domain: 'E-commerce',
        education: 'B.Sc (CS)',
        educationInstitution: 'Delhi University',
        isReferral: false,
        skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Firebase'],
        compositeScore: 31,
        bucket: 'low',
        experienceHistory: [
            {
                role: 'Software Developer',
                company: 'Licious',
                duration: '2024 – Present',
                summary: `Works on the consumer web app for Licious's online meat delivery platform. Primarily responsible for front-end bug fixes and minor UI feature additions. Recently contributed to the new product listing page redesign under close guidance from a senior engineer.`,
            },
            {
                role: 'Freelance Web Developer',
                company: 'Self-employed',
                duration: '2022 – 2024',
                summary: `Developed and deployed small business websites for 8 local clients, primarily using HTML, CSS, and JavaScript. Built 2 WordPress-based e-commerce storefronts. Gained practical experience with responsive design and basic SEO optimisation.`,
            },
        ],
        dimensions: [
            {
                label: 'Skill Alignment',
                score: 10,
                max: 40,
                reasoning: 'Only React and JavaScript partially overlap with the JD requirements, and these are not evidenced at a depth expected for a Senior role. TypeScript, Node.js, and PostgreSQL are entirely absent from the profile — three of the four must-have skills are missing. Skill recency modifier is low: even the confirmed React exposure is at an introductory complexity level. Semantic alignment with the JD is significantly below the minimum threshold for advancement.',
            },
            {
                label: 'Relevant Experience',
                score: 9,
                max: 30,
                reasoning: '2 years of total experience, which is below the JD minimum of 4 years. This places the candidate in the eligibility-gated category, making them ineligible for the Strong Match bucket by definition. Domain-aligned tenure is minimal — freelance web work and early-stage product contributions do not constitute the enterprise engineering experience this role demands. Seniority alignment is very low; the current role is junior-level by scope and title.',
            },
            {
                label: 'Role Context & Complexity',
                score: 7,
                max: 15,
                reasoning: 'Role scope is limited to bug fixes and UI feature additions under close supervision, as evidenced in the current position at Licious. No ownership language, no scale indicators, and no cross-functional engagement signals are present. Freelance work involves low-complexity static sites and WordPress installations, which do not translate to the product engineering complexity expected for this role. Responsibility classification: junior IC, early career.',
            },
            {
                label: 'Career Trajectory',
                score: 5,
                max: 15,
                reasoning: 'Career trajectory is at a very early stage — 2 years in, with a non-traditional background starting from freelance work. Progression from freelance to an employed developer role is a positive signal of initiative, but there is no consistent upward title movement or scope expansion observable yet. Domain consistency is low — freelance work and product engineering are different environments. Trajectory potential is present but unproven at relevant scale.',
            },
        ],
        mustHaveViolations: ['Node.js', 'TypeScript', 'PostgreSQL', 'Experience below minimum (2y vs 4y required)'],
        summary: 'Sneha is at an early stage of her software engineering career. While her initiative in transitioning from freelance to a product company is encouraging, this role requires a minimum of 4 years of JD-aligned experience and all 4 must-have technical skills, of which she meets none fully. Not a match for this opening — recommend revisiting in 2–3 years with focused backend skill development.',
        isShortlisted: false,
        isUnderHMReview: false,
        resumeFileName: 'sneha_kapoor_resume.pdf',
    },
];
