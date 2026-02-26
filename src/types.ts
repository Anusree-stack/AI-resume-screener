// src/types.ts

export type Bucket = 'strong' | 'potential' | 'low';

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
    skills: string[];

    compositeScore: number;   // 0–100
    bucket: Bucket;
    overriddenBucket?: Bucket;

    dimensions: ScoreDimension[];
    mustHaveViolations: string[];
    summary: string;

    isShortlisted: boolean;
    resumeFileName: string;
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
    status: 'Draft' | 'Open' | 'Closed';
    createdAt: string;
}

export type AppScreen =
    | 'landing'
    | 'jd-list'
    | 'jd-setup'
    | 'cv-upload'
    | 'processing'
    | 'dashboard'
    | 'candidate-detail'
    | 'shortlist';
