// src/candidateStore.ts
// Pre-generates one unique, role-appropriate candidate pool per JD at startup.
// This ensures every number in the app is perfectly consistent.

import type { Candidate, JobDescription, Bucket } from './types';

// ─── Name / Location Pools ────────────────────────────────────────────────────

const FIRST_NAMES = [
    'Aarav', 'Aditi', 'Akash', 'Amrita', 'Ananya', 'Arjun', 'Arnav', 'Avni',
    'Chirag', 'Deepika', 'Dev', 'Divya', 'Gaurav', 'Ishaan', 'Karthik', 'Kavya',
    'Kiran', 'Manish', 'Megha', 'Mihir', 'Nandini', 'Nikhil', 'Pallavi', 'Pranav',
    'Priya', 'Rahul', 'Rajeev', 'Riya', 'Rohan', 'Sakshi', 'Sanya', 'Shweta',
    'Siddharth', 'Sneha', 'Suresh', 'Tanvi', 'Tushar', 'Uday', 'Varun', 'Vikram',
    'Yash', 'Aishwarya', 'Bhavesh', 'Chetan', 'Dhruv', 'Esha', 'Farhan', 'Geeta',
    'Harsh', 'Isha', 'Jayesh', 'Komal', 'Lata', 'Mayank', 'Neha', 'Om',
];

const LAST_NAMES = [
    'Agarwal', 'Bhatia', 'Chandra', 'Choudhary', 'Das', 'Deshpande', 'Gandhi',
    'Gupta', 'Iyer', 'Jain', 'Joshi', 'Kapoor', 'Kaur', 'Khan', 'Kumar',
    'Malik', 'Mehta', 'Menon', 'Mishra', 'Nair', 'Patel', 'Pillai', 'Rao',
    'Reddy', 'Saxena', 'Shah', 'Sharma', 'Singh', 'Sinha', 'Srivastava',
    'Tiwari', 'Varma', 'Verma', 'Yadav', 'Desai', 'Bose', 'Roy', 'Chatterjee',
];

const LOCATIONS = [
    'Bangalore', 'Hyderabad', 'Mumbai', 'Pune', 'Chennai', 'Delhi NCR',
    'Gurgaon', 'Noida', 'Kolkata', 'Ahmedabad', 'Remote (India)',
];

const EDUCATION_LEVELS = [
    'B.Tech (CS)', 'B.Tech (CS)', 'B.Tech (CS)', // Majority: Bachelors
    'B.Tech (ECE)', 'B.Tech (ECE)',
    'B.E. (CS)',
    'B.Sc (CS)',
    'M.Tech (CS)', 'M.Tech (CS)', // Some: Masters
    'M.S. (CS)',
    'MBA (Technology)',
    'PhD (CS)', // Fewest: PhD
];

const SENIORITIES = ['Mid', 'Mid', 'Senior', 'Senior', 'Senior', 'Lead', 'Entry'];
const DOMAINS = ['Fintech', 'SaaS', 'E-commerce', 'Healthcare', 'EdTech', 'Logistics', 'B2B'];

const TECH_COMPANIES = [
    'Razorpay', 'CRED', 'Zepto', 'Meesho', 'Swiggy', 'Zomato', 'PhonePe', 'Paytm',
    'Flipkart', 'Ola', 'Groww', 'Slice', 'Jupiter', 'Fi', 'BrowserStack',
    'Postman', 'CleverTap', 'MoEngage', 'Whatfix', 'Darwinbox', 'Freshworks',
    'Zoho', 'InfraCloud', 'HashedIn', 'ThoughtWorks', 'Airtel', 'Jio', 'Tata Digital',
    'Infosys', 'Wipro', 'HCL Technologies', 'TCS Digital', 'Licious', 'Spinny', 'Exotel',
];

const PREV_COMPANIES = [
    'Accenture', 'Deloitte', 'EY GDS', 'PwC Technology', 'Capgemini', 'Cognizant',
    'Mphasis', 'Tech Mahindra', 'LTIMindtree', 'Hexaware', 'Persistent Systems',
    'Publicis Sapient', 'GlobalLogic', 'Nagarro', 'EPAM Systems',
];

// ─── Role-Specific Profile Templates ─────────────────────────────────────────

interface RoleProfile {
    titles: string[];
    prevTitles: string[];
    skillPool: string[];
    techStack: string[];
    summaryFn: (company: string, tech: string) => string;
    prevSummaryFn: (company: string) => string;
}

const ROLE_PROFILES: Record<string, RoleProfile> = {
    fullstack: {
        titles: [
            'Senior Full-Stack Engineer', 'Software Development Engineer II',
            'Full-Stack Engineer', 'Senior Software Engineer', 'Staff Engineer',
            'Technology Lead', 'Principal Engineer',
        ],
        prevTitles: [
            'Software Development Engineer', 'Full-Stack Developer',
            'Junior Software Engineer', 'Associate Engineer', 'Software Engineer I',
        ],
        skillPool: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL', 'AWS', 'Redis', 'Docker', 'MongoDB', 'Express.js', 'Next.js', 'Git', 'CSS', 'HTML', 'JavaScript'],
        techStack: [
            'React, Node.js, TypeScript, PostgreSQL',
            'Next.js, Express.js, MongoDB, Redis',
            'React, Python (FastAPI), PostgreSQL, Docker',
            'Vue.js, Node.js, TypeScript, MySQL',
            'React, Node.js, GraphQL, AWS',
        ],
        summaryFn: (company, tech) => `Leading full-stack feature development on ${company}'s core product. Architected a microservice layer that reduced API response times by 38%. Mentors a team of 3 junior engineers and drives sprint planning alongside the product team. Tech stack: ${tech}.`,
        prevSummaryFn: (company) => `Contributed to ${company}'s core platform team. Built RESTful APIs consumed by over 200k daily active users. Reduced database query latency by 40% through indexing strategy improvements.`,
    },
    product: {
        titles: [
            'Senior Product Manager', 'Product Manager', 'Group Product Manager',
            'Associate Director – Product', 'VP of Product', 'Director of Product',
        ],
        prevTitles: [
            'Associate Product Manager', 'Business Analyst', 'Product Analyst',
            'Junior PM', 'Strategy Consultant',
        ],
        skillPool: ['Product Strategy', 'User Research', 'SQL', 'Fintech Experience', 'Analytics', 'Agile', 'Roadmapping', 'A/B Testing', 'OKRs', 'Stakeholder Management', 'Data Analysis', 'Jira', 'Figma'],
        techStack: [
            'Mixpanel, SQL, Jira, Figma',
            'Amplitude, Tableau, Confluence, Looker',
            'Google Analytics, SQL, Power BI',
        ],
        summaryFn: (company, tech) => `Driving the product roadmap at ${company} for the core payments platform. Partnered with engineering and design to ship 6 major features impacting 3M+ active users. Uses ${tech} to track KPIs and inform product decisions. Led a pricing revamp that increased ARPU by 18%.`,
        prevSummaryFn: (company) => `Built the initial product analytics framework at ${company}. Wrote detailed PRDs and user stories for a 12-engineer team. Launched 2 beta features that each gained 30k+ users in the first 30 days.`,
    },
    backend: {
        titles: [
            'Backend Lead', 'Senior Backend Engineer', 'Staff Backend Engineer',
            'Platform Engineer', 'Node.js Lead', 'Tech Lead (Backend)',
            'Principal Backend Engineer', 'Cloud Architect',
        ],
        prevTitles: [
            'Backend Developer', 'Software Engineer (Node.js)',
            'Server-Side Engineer', 'API Engineer',
        ],
        skillPool: ['Node.js', 'PostgreSQL', 'Redis', 'System Design', 'Cloud Architecture', 'Kubernetes', 'Go', 'Python', 'Microservices', 'AWS', 'Docker', 'Kafka', 'gRPC', 'TypeScript', 'MongoDB'],
        techStack: [
            'Node.js, PostgreSQL, Redis, AWS',
            'Node.js, TypeScript, Kafka, Kubernetes',
            'Go, PostgreSQL, Redis, Docker',
            'Node.js, MongoDB, RabbitMQ, GCP',
        ],
        summaryFn: (company, tech) => `Architecting and operating ${company}'s backend infrastructure at scale. Designed a distributed event-driven system processing 5M events/day using ${tech}. Leads a team of 6 backend engineers, drives system design reviews, and owns the reliability roadmap. Reduced P99 latency from 800ms to 120ms across core APIs.`,
        prevSummaryFn: (company) => `Built RESTful and gRPC services at ${company}, serving high-traffic consumer applications. Contributed to the migration of a monolithic system to microservices. Introduced connection pooling strategies that reduced database load by 55%.`,
    },
    dataanalyst: {
        titles: [
            'Senior Data Analyst', 'Data Analyst', 'Growth Analyst',
            'Business Intelligence Analyst', 'Analytics Lead', 'Product Analyst',
        ],
        prevTitles: [
            'Junior Data Analyst', 'Analyst Trainee', 'BI Developer',
            'Data Associate', 'Research Analyst',
        ],
        skillPool: ['SQL', 'Python', 'Tableau', 'Statistics', 'dbt', 'BigQuery', 'Looker', 'Excel', 'Power BI', 'Pandas', 'Numpy', 'A/B Testing', 'Data Modeling', 'Airflow'],
        techStack: [
            'SQL, Python (Pandas), Tableau, Airflow',
            'BigQuery, dbt, Looker, Python',
            'SQL, Power BI, Excel, Python',
            'Redshift, SQL, Tableau, dbt',
        ],
        summaryFn: (company, tech) => `Leading analytics for ${company}'s growth and retention team. Uses ${tech} to build automated dashboards and run weekly product experiments. Designed an attribution model that improved marketing ROI measurement by 45%. Partnered with product on a feature adoption analysis that drove a 12% improvement in D30 retention.`,
        prevSummaryFn: (company) => `Developed self-serve reporting infrastructure at ${company} using SQL and Tableau. Ran 10+ A/B tests quarterly with rigorous statistical significance checks. Documented data dictionaries adopted company-wide.`,
    },
    devops: {
        titles: [
            'Senior DevOps Engineer', 'DevOps Lead', 'Platform Engineer',
            'Site Reliability Engineer', 'Infrastructure Lead', 'Cloud DevOps Engineer',
        ],
        prevTitles: [
            'DevOps Engineer', 'Systems Engineer', 'Linux Administrator',
            'CI/CD Engineer', 'Cloud Engineer',
        ],
        skillPool: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD', 'Go', 'Prometheus', 'Grafana', 'Docker', 'Helm', 'GitHub Actions', 'Ansible', 'GCP', 'Linux', 'Bash', 'Python'],
        techStack: [
            'Kubernetes, Terraform, AWS, Prometheus',
            'Docker, Helm, GCP, ArgoCD',
            'Terraform, AWS EKS, Grafana, GitHub Actions',
            'Ansible, Jenkins, AWS, Datadog',
        ],
        summaryFn: (company, tech) => `Managing ${company}'s entire cloud infrastructure across 3 regions using ${tech}. Achieved 99.97% uptime SLA over 12 consecutive months. Reduced infrastructure costs by 34% through right-sizing and spot-instance adoption. Owns the complete CI/CD pipeline used by 80+ engineers daily.`,
        prevSummaryFn: (company) => `Managed containerized workloads and CI/CD at ${company}. Automated routine infrastructure tasks, saving the team 20+ engineering hours per month. Introduced centralized observability using ELK stack and PagerDuty integrations.`,
    },
};

// ─── Deterministic Seeded RNG ─────────────────────────────────────────────────
// Ensures the same data is generated every page load

function seededRng(seed: number) {
    let s = seed;
    return () => {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        return (s >>> 0) / 0xffffffff;
    };
}

function pick<T>(arr: T[], rng: () => number): T {
    return arr[Math.floor(rng() * arr.length)];
}

// ─── Reasoning Templates ──────────────────────────────────────────────────────

function skillReasoning(score: number, max: number, matched: number, total: number, company: string): string {
    const pct = Math.round((score / max) * 100);
    if (pct >= 85) return `Exceptional coverage of all ${total} required skills with deep production experience at ${company}. Skill recency is excellent, indicating active use of the primary tech stack. Semantic match with JD requirements is near-perfect, showing both breadth and specialized depth.`;
    if (pct >= 60) return `Covers ${matched} of ${total} mandatory skills. Missing criteria are partially offset by adjacent technology experience. Recency is moderate; some skills haven't been utilized in the most recent role. Overall technical alignment is solid but requires minor upskilling.`;
    return `Significant skill gap detected; only ${matched} of ${total} required skills are evidenced. Recency modifier is low, suggesting dated familiarity with the core stack. Technical alignment is below the threshold for immediate productivity in this specific role.`;
}

function expReasoning(score: number, max: number, yoe: number, minRequired: number, company: string): string {
    const pct = Math.round((score / max) * 100);
    if (pct >= 85) return `Strong ${yoe}-year history with consistent domain advancement. Seniority level perfectly matches JD expectations, with clear evidence of ownership at ${company}. Stability signal is high, showing consistent tenure and increasing responsibility across all prior engineering positions.`;
    if (pct >= 60) return `Meets the ${minRequired}-year threshold with ${yoe} years of total experience. Seniority alignment is good, though depth in specific domain verticals is slightly thinner than ideal. Stability is acceptable, hampered only by one relatively short tenure early in the career.`;
    return `${yoe} years of experience falls ${yoe < minRequired ? 'below the mandatory minimum' : 'short of the ideal range'}. Domain-aligned tenure is limited, and seniority level is slightly junior for the role context. Stability signals are mixed due to frequent role transitions.`;
}

function roleContextReasoning(score: number, max: number, company: string): string {
    const pct = Math.round((score / max) * 100);
    if (pct >= 80) return `Clear ownership signals detected; architected revenue-critical systems at ${company}. Scale indicators are strong, including mentions of high-traffic user bases and system-level impact. Responsibilities align with a high-bandwidth senior individual contributor managing significant technical complexity.`;
    if (pct >= 55) return `Moderate ownership signals with evidence of lead-level contributions in collaborative settings. Scale of systems handled is respectable but lacks the massive throughput required for top-tier scores. Role context shows a steady progression toward autonomous project ownership.`;
    return `Limited evidence of broad ownership or system-scale complexity. Work reflects execution of well-scoped tasks under close guidance. Scope of impact is primarily feature-level rather than architecture-level, suggesting a more junior responsibility profile relative to JD needs.`;
}

function trajectoryReasoning(score: number, max: number, yoe: number, company: string): string {
    const pct = Math.round((score / max) * 100);
    if (pct >= 80) return `Excellent career trajectory over ${yoe} years with rapid title progression. Consistent domain focus and increasing scope indicate high performance recognition. Directional consistency is perfect, with each role at ${company} and earlier showing logical career growth.`;
    if (pct >= 55) return `Healthy career trajectory with steady advancement. Title progression is industry-standard for a ${yoe}-year career. Some lateral domain shifts introduce minor noise, but overall growth remains positive toward senior-level contributions.`;
    return `Trajectory signals are below expectations for this tenure. Title progression has been slower than peer averages, and domain consistency is variable. Responsibility growth isn't clearly demonstrated across different company stages or role history.`;
}

// ─── Core Generator ───────────────────────────────────────────────────────────

export function generateCandidatesForJD(jd: JobDescription, profileKey: string): Candidate[] {
    const profile = ROLE_PROFILES[profileKey] ?? ROLE_PROFILES.fullstack;
    const count = jd.applicationCount ?? 0;
    const mustHaves = jd.mustHaveSkills;
    const candidates: Candidate[] = [];

    // Seed based on JD id for determinism
    const seed = jd.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 42);
    const rng = seededRng(seed);

    // Track used names to avoid duplicates
    const usedNames = new Set<string>();

    for (let i = 1; i <= count; i++) {
        // Generate unique name
        let name = '';
        let attempts = 0;
        while (!name || usedNames.has(name)) {
            const fname = pick(FIRST_NAMES, rng);
            const lname = pick(LAST_NAMES, rng);
            name = `${fname} ${lname}`;
            if (++attempts > 20) { name = `${name} ${i}`; break; }
        }
        usedNames.add(name);

        const [fname, lname] = name.split(' ');
        const email = `${fname.toLowerCase()}.${lname.toLowerCase()}${i}@gmail.com`;
        const yoe = Math.max(1, Math.floor(rng() * 12) + 1);
        const company = pick(TECH_COMPANIES, rng);
        const prevCompany = pick(PREV_COMPANIES, rng);
        const currentRole = pick(profile.titles, rng);
        const prevRole = pick(profile.prevTitles, rng);
        const techStack = pick(profile.techStack, rng);

        // Skillset — must-haves first, then fill from pool
        const matchedSkills = mustHaves.filter(() => rng() > 0.3);
        const violations: string[] = mustHaves.filter(s => !matchedSkills.includes(s));
        if (yoe < jd.experienceMin) {
            violations.push(`Experience below minimum (${yoe}y vs ${jd.experienceMin}y required)`);
        }

        // Score computation — varies based on violations
        const baseScore = Math.floor(rng() * 55) + 35;
        const finalScore = Math.max(10, Math.min(100, baseScore - violations.length * 9));

        // Bucket assignment — strict gating
        let bucket: Bucket = 'low';
        if (violations.length === 0 && finalScore >= 80) {
            bucket = 'strong';
        } else if (finalScore >= 50) {
            bucket = 'potential';
        }

        // Profile extras
        const education = pick(EDUCATION_LEVELS, rng);
        const educationInstitution = pick([
            'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
            'BITS Pilani', 'BITS Hyderabad', 'NIT Trichy', 'NIT Surathkal', 'NIT Warangal',
            'Delhi University', 'Mumbai University', 'VIT Vellore', 'SRM University',
            'Manipal University', 'Amity University', 'Anna University',
        ], rng);
        const location = pick(LOCATIONS, rng);
        const seniority = pick(SENIORITIES, rng);
        const domain = pick(DOMAINS, rng);

        // Experience history
        const currentStart = 2026 - (yoe > 3 ? Math.min(4, Math.round(yoe * 0.5)) : yoe);
        const prevEnd = currentStart;
        const prevStart = prevEnd - Math.max(1, yoe - Math.round(yoe * 0.5));

        const extraPoolSkills = profile.skillPool.filter(s => !matchedSkills.includes(s) && rng() > 0.5).slice(0, 4);
        const allSkills = [...matchedSkills, ...extraPoolSkills, 'Git'];

        // Scoring dimensions (proportional)
        const skillAlignScore = Math.round((finalScore / 100) * 40);
        const expAlignScore = Math.round((finalScore / 100) * 30);
        const roleContextScore = Math.round((finalScore / 100) * 15);
        const trajectoryScore = Math.round((finalScore / 100) * 15);

        candidates.push({
            id: `${jd.id}-c${i}`,
            name,
            email,
            phone: `+91 ${Math.floor(7000000000 + rng() * 2999999999)}`,
            currentRole,
            currentCompany: company,
            yearsOfExperience: yoe,
            location,
            seniority,
            domain,
            education,
            educationInstitution,
            isReferral: rng() < 0.12,
            experienceHistory: [
                {
                    role: currentRole,
                    company,
                    duration: `${currentStart} – Present`,
                    summary: profile.summaryFn(company, techStack),
                },
                ...(yoe > 2 ? [{
                    role: prevRole,
                    company: prevCompany,
                    duration: `${prevStart} – ${prevEnd}`,
                    summary: profile.prevSummaryFn(prevCompany),
                }] : []),
            ],
            skills: allSkills,
            compositeScore: finalScore,
            bucket,
            dimensions: [
                { label: 'Skill Alignment', score: skillAlignScore, max: 40, reasoning: skillReasoning(skillAlignScore, 40, matchedSkills.length, mustHaves.length, company) },
                { label: 'Relevant Experience', score: expAlignScore, max: 30, reasoning: expReasoning(expAlignScore, 30, yoe, jd.experienceMin, company) },
                { label: 'Role Context & Complexity', score: roleContextScore, max: 15, reasoning: roleContextReasoning(roleContextScore, 15, company) },
                { label: 'Career Trajectory', score: trajectoryScore, max: 15, reasoning: trajectoryReasoning(trajectoryScore, 15, yoe, company) },
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
}

// ─── JD → Profile Key Mapping ─────────────────────────────────────────────────

const JD_PROFILE_MAP: Record<string, string> = {
    jd1: 'fullstack',
    jd2: 'product',
    jd3: 'backend',
    jd4: 'fullstack', // Frontend — use fullstack but JD has 0 apps so no candidates generated
    jd5: 'dataanalyst',
    jd6: 'devops',
};

// ─── Pre-generated Store ──────────────────────────────────────────────────────
// Computed once at module load. Every subsequent read is O(1).

export type CandidateStore = Record<string, Candidate[]>;

export function buildCandidateStore(jds: Pick<JobDescription, 'id' | 'title' | 'applicationCount' | 'mustHaveSkills' | 'experienceMin'>[]): CandidateStore {
    const store: CandidateStore = {};
    for (const jd of jds) {
        const profileKey = JD_PROFILE_MAP[jd.id] ?? 'fullstack';
        store[jd.id] = (jd.applicationCount ?? 0) > 0
            ? generateCandidatesForJD(jd as JobDescription, profileKey)
            : [];
    }
    return store;
}
