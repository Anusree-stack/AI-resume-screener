// src/types.ts

export type Bucket = 'strong' | 'potential' | 'low';

export type LifecycleStage =
    | 'Draft'
    | 'Live – Accepting Applications'
    | 'Screening in Progress'
    | 'Interview'
    | 'Offer Extended'
    | 'Offer Closed';

export interface ScoreDimension {
    label: string;
    score: number;
    max: number;
    reasoning: string;
}

export interface Candidate {
    id: string;
    name: string;
    email: string;
    phone: string;
    currentRole: string;
    currentCompany: string;
    yearsOfExperience: number;
    location: string;
    education: string;
    educationInstitution: string;
    skills: string[];

    compositeScore: number;   // 0–100
    bucket: Bucket;
    overriddenBucket?: Bucket;
    overrideReason?: string;
    overrideNote?: string;

    dimensions: ScoreDimension[];
    mustHaveViolations: string[];
    summary: string;

    isShortlisted: boolean;
    isUnderHMReview?: boolean;
    isReferral?: boolean;
    seniority?: string;
    domain?: string;
    resumeFileName: string;
    experienceHistory?: ExperienceItem[];
}

export interface ExperienceItem {
    role: string;
    company: string;
    duration: string;
    summary: string;
}

export interface JobDescription {
    id: string;
    title: string;
    department: string;
    location: string;
    experienceMin: number;
    experienceMax: number;
    description: string;
    mustHaveSkills: string[];
    niceToHave: string[];
    status: LifecycleStage;
    createdAt: string;
    applicationCount?: number;
    strongCount?: number;
    shortlistedCount?: number;
    daysOpen?: number;
}

export type AppScreen =
    | 'home'
    | 'jd-list'
    | 'jd-setup'
    | 'cv-upload'
    | 'processing'
    | 'dashboard'
    | 'candidate-detail'
    | 'shortlist';
