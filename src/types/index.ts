export interface JobDescription {
  id: string;
  title: string;
  department: string;
  location: string;
  experienceMinYears: number;
  experienceMaxYears: number;
  requiredEducation: 'High School' | 'Bachelor' | 'Master' | 'PhD';
  requiredSkills: string[];
  preferredSkills: string[];
  description: string;
  responsibilities: string[];
  weights: {
    semantic: number;  // %
    skills: number;    // %
    experience: number;// %
    education: number; // %
  };
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string; // YYYY or YYYY-MM
  endDate: string;   // YYYY, YYYY-MM or 'Present'
  startYear: number;
  endYear: number;   // Current year if Present
  isCurrent?: boolean;
  description: string[];
  skillsUsed: string[];
}

export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  graduationYear: number;
}

export interface AnomalyFlag {
  id: string;
  type: 'TIMELINE_ANACHRONISM' | 'DATE_OVERLAP' | 'GRADUATION_MISMATCH' | 'UNSUBSTANTIATED_SKILL' | 'SENIORITY_MISMATCH' | 'KEYWORD_STUFFING';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  claim: string;
  evidence: string;
}

export interface CandidateResume {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  summary: string;
  extractedSkills: string[];
  experience: WorkExperience[];
  education: Education[];
  certifications: string[];
  rawText: string;
  fileName?: string;
  uploadTimestamp: string;
  pipelineStage?: 'INBOX' | 'SHORTLISTED' | 'INTERVIEW' | 'REJECTED';
}

export interface SkillMatchDetail {
  skill: string;
  status: 'MATCHED' | 'PARTIAL' | 'MISSING';
  isBonus?: boolean;
  evidenceSnippets: string[];
  proficiencyConfidence: number; // 0-100
}

export interface InterviewQuestion {
  id: string;
  category: 'TECHNICAL_VERIFICATION' | 'ANOMALY_PROBING' | 'GAP_ASSESSMENT' | 'BEHAVIORAL';
  question: string;
  rationale: string;
  expectedAnswerHint: string;
}

export interface CandidateEvaluation {
  candidateId: string;
  overallScore: number;       // 0-100
  semanticScore: number;      // 0-100
  skillScore: number;         // 0-100
  experienceScore: number;    // 0-100
  educationScore: number;     // 0-100
  integrityScore: number;     // 0-100 (100 = perfect integrity, <70 = flags)
  calculatedExperienceYears: number;
  
  matchedSkills: SkillMatchDetail[];
  missingSkills: string[];
  bonusSkills: SkillMatchDetail[];
  
  anomalies: AnomalyFlag[];
  
  executiveSummary: string;
  strengths: string[];
  gaps: string[];
  hiringRecommendation: 'STRONG_HIRE' | 'CONSIDER' | 'NEEDS_VERIFICATION' | 'REJECT';
  recommendationReason: string;
}

export interface FilterState {
  searchQuery: string;
  minScore: number;
  minExperienceYears: number;
  selectedSkills: string[];
  selectedEducation: string[];
  integrityFilter: 'ALL' | 'VERIFIED_ONLY' | 'FLAGGED_ONLY';
  recommendationFilter: string;
  sortBy: 'SCORE_DESC' | 'SCORE_ASC' | 'EXP_DESC' | 'INTEGRITY_DESC' | 'NAME_ASC';
}
