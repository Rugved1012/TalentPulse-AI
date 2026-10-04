import type { CandidateResume, JobDescription, CandidateEvaluation, SkillMatchDetail } from '../types';
import { detectResumeAnomalies } from './contradictionDetector';

export function evaluateCandidate(candidate: CandidateResume, jd: JobDescription): CandidateEvaluation {
  // 1. Calculate Anomalies & Integrity Score
  const anomalies = detectResumeAnomalies(candidate);
  let integrityScore = 100;
  for (const anomaly of anomalies) {
    if (anomaly.severity === 'CRITICAL') integrityScore -= 25;
    else if (anomaly.severity === 'WARNING') integrityScore -= 12;
    else if (anomaly.severity === 'INFO') integrityScore -= 5;
  }
  integrityScore = Math.max(0, integrityScore);

  // 2. Skill Match Scoring
  const matchedSkills: SkillMatchDetail[] = [];
  const missingSkills: string[] = [];
  const bonusSkills: SkillMatchDetail[] = [];

  const candidateSkillsLower = candidate.extractedSkills.map(s => s.toLowerCase());
  const fullTextLower = candidate.rawText.toLowerCase();

  let requiredSkillHits = 0;
  for (const reqSkill of jd.requiredSkills) {
    const reqLower = reqSkill.toLowerCase();
    
    const isDirectMatch = candidateSkillsLower.some(s => s.includes(reqLower) || reqLower.includes(s));
    const isTextMatch = fullTextLower.includes(reqLower);

    const evidenceSnippets: string[] = [];
    if (isTextMatch || isDirectMatch) {
      candidate.experience.forEach(exp => {
        exp.description.forEach(bullet => {
          if (bullet.toLowerCase().includes(reqLower)) {
            evidenceSnippets.push(`[${exp.company} - ${exp.title}]: "${bullet}"`);
          }
        });
      });
    }

    if (isDirectMatch || isTextMatch) {
      requiredSkillHits++;
      matchedSkills.push({
        skill: reqSkill,
        status: 'MATCHED',
        evidenceSnippets: evidenceSnippets.length > 0 ? evidenceSnippets : [`Mentioned in candidate skill profile`],
        proficiencyConfidence: evidenceSnippets.length > 1 ? 95 : (evidenceSnippets.length === 1 ? 80 : 65)
      });
    } else {
      missingSkills.push(reqSkill);
      matchedSkills.push({
        skill: reqSkill,
        status: 'MISSING',
        evidenceSnippets: [],
        proficiencyConfidence: 0
      });
    }
  }

  // Check Preferred / Bonus Skills
  for (const prefSkill of jd.preferredSkills) {
    const prefLower = prefSkill.toLowerCase();
    const isMatch = candidateSkillsLower.some(s => s.includes(prefLower) || prefLower.includes(s)) || fullTextLower.includes(prefLower);
    if (isMatch) {
      bonusSkills.push({
        skill: prefSkill,
        status: 'MATCHED',
        isBonus: true,
        evidenceSnippets: [`Bonus preferred skill matched`],
        proficiencyConfidence: 85
      });
    }
  }

  const reqSkillCoverage = jd.requiredSkills.length > 0 ? (requiredSkillHits / jd.requiredSkills.length) * 100 : 100;
  const bonusAddon = (bonusSkills.length / Math.max(1, jd.preferredSkills.length)) * 15;
  const skillScore = Math.min(100, Math.round(reqSkillCoverage * 0.85 + bonusAddon));

  // 3. Experience Scoring
  const calculatedExpYears = candidate.experience.reduce((sum, exp) => {
    const duration = Math.max(1, (exp.endYear || new Date().getFullYear()) - exp.startYear);
    return sum + duration;
  }, 0);

  let experienceScore = 50;
  if (calculatedExpYears >= jd.experienceMinYears) {
    if (calculatedExpYears <= jd.experienceMaxYears + 4) {
      experienceScore = 100;
    } else {
      experienceScore = 85;
    }
  } else {
    const gap = jd.experienceMinYears - calculatedExpYears;
    experienceScore = Math.max(20, Math.round(100 - (gap * 25)));
  }

  // 4. Education Scoring
  let educationScore = 70;
  const degreeHierarchy: Record<string, number> = {
    'High School': 1,
    'Bachelor': 2,
    'Master': 3,
    'PhD': 4
  };

  const reqLevel = degreeHierarchy[jd.requiredEducation] || 2;
  let highestCandLevel = 1;

  for (const edu of candidate.education) {
    const degreeLower = edu.degree.toLowerCase();
    if (degreeLower.includes('phd') || degreeLower.includes('doctor')) highestCandLevel = Math.max(highestCandLevel, 4);
    else if (degreeLower.includes('master') || degreeLower.includes('ms') || degreeLower.includes('mba')) highestCandLevel = Math.max(highestCandLevel, 3);
    else if (degreeLower.includes('bachelor') || degreeLower.includes('bs') || degreeLower.includes('ba') || degreeLower.includes('b.tech') || degreeLower.includes('be')) highestCandLevel = Math.max(highestCandLevel, 2);
  }

  if (highestCandLevel >= reqLevel) {
    educationScore = highestCandLevel > reqLevel ? 100 : 90;
  } else {
    educationScore = 60;
  }

  // 5. Semantic Match Score
  const semanticScore = calculateSemanticSimilarity(candidate, jd);

  // 6. Overall Weighted Score
  const rawWeightedScore = (
    (semanticScore * jd.weights.semantic) +
    (skillScore * jd.weights.skills) +
    (experienceScore * jd.weights.experience) +
    (educationScore * jd.weights.education)
  ) / 100;

  let overallScore = rawWeightedScore;
  if (integrityScore < 70) {
    overallScore = overallScore * (integrityScore / 100);
  }
  overallScore = Math.min(100, Math.max(0, Math.round(overallScore)));

  // 7. Generate Executive Summary & Hiring Recommendation
  const strengths: string[] = [];
  const gaps: string[] = [];

  if (reqSkillCoverage >= 80) strengths.push(`Strong core skill match (${requiredSkillHits}/${jd.requiredSkills.length} required skills matched)`);
  if (bonusSkills.length > 0) strengths.push(`Matches ${bonusSkills.length} preferred bonus skills (${bonusSkills.map(b => b.skill).join(', ')})`);
  if (calculatedExpYears >= jd.experienceMinYears) strengths.push(`Meets experience requirement (${calculatedExpYears} years vs ${jd.experienceMinYears}+ required)`);
  if (semanticScore >= 80) strengths.push(`High domain context relevance (${semanticScore}% semantic match score)`);

  if (missingSkills.length > 0) gaps.push(`Missing required skills: ${missingSkills.join(', ')}`);
  if (calculatedExpYears < jd.experienceMinYears) gaps.push(`Below minimum experience (${calculatedExpYears} yrs vs ${jd.experienceMinYears}+ required)`);
  if (anomalies.length > 0) gaps.push(`${anomalies.length} claim integrity flag(s) detected`);

  let hiringRecommendation: CandidateEvaluation['hiringRecommendation'] = 'CONSIDER';
  let recommendationReason = '';

  if (integrityScore < 60) {
    hiringRecommendation = 'NEEDS_VERIFICATION';
    recommendationReason = `Candidate flagged for critical resume claim anomalies (${anomalies.map(a => a.title).join('; ')}). Manual verification required before interview.`;
  } else if (overallScore >= 82 && requiredSkillHits >= jd.requiredSkills.length - 1) {
    hiringRecommendation = 'STRONG_HIRE';
    recommendationReason = `Excellent candidate match with ${overallScore}% overall score, strong skill coverage, and verified experience history.`;
  } else if (overallScore >= 65) {
    hiringRecommendation = 'CONSIDER';
    recommendationReason = `Solid candidate profile (${overallScore}% match). Good fit but has minor skill gaps: [${missingSkills.slice(0, 3).join(', ')}].`;
  } else {
    hiringRecommendation = 'REJECT';
    recommendationReason = `Match score (${overallScore}%) below threshold. Significant gaps in required core skills and experience alignment.`;
  }

  const executiveSummary = `${candidate.name} is a ${calculatedExpYears}-year experience ${candidate.experience[0]?.title || 'Professional'} with an overall match score of ${overallScore}%. ${recommendationReason}`;

  return {
    candidateId: candidate.id,
    overallScore,
    semanticScore,
    skillScore,
    experienceScore,
    educationScore,
    integrityScore,
    calculatedExperienceYears: calculatedExpYears,
    matchedSkills,
    missingSkills,
    bonusSkills,
    anomalies,
    executiveSummary,
    strengths,
    gaps,
    hiringRecommendation,
    recommendationReason
  };
}

function calculateSemanticSimilarity(candidate: CandidateResume, jd: JobDescription): number {
  const jdText = `${jd.title} ${jd.department} ${jd.description} ${jd.responsibilities.join(' ')} ${jd.requiredSkills.join(' ')}`.toLowerCase();
  const candText = `${candidate.summary} ${candidate.experience.map(e => `${e.title} ${e.company} ${e.description.join(' ')}`).join(' ')} ${candidate.extractedSkills.join(' ')}`.toLowerCase();

  const jdTokens = extractKeywords(jdText);
  const candTokens = extractKeywords(candText);

  const jdSet = new Set(jdTokens);
  let matches = 0;
  for (const token of candTokens) {
    if (jdSet.has(token)) matches++;
  }

  const denominator = Math.sqrt(jdTokens.length * candTokens.length);
  if (denominator === 0) return 50;

  const rawSim = (matches / denominator) * 2.5;
  const finalScore = Math.min(98, Math.max(30, Math.round(rawSim * 100)));
  return finalScore;
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set(['and', 'the', 'for', 'with', 'a', 'an', 'in', 'to', 'of', 'at', 'by', 'from', 'on', 'or', 'is', 'are', 'was', 'be', 'been', 'as', 'work', 'using', 'our', 'team', 'company', 'role']);
  return text
    .replace(/[^\w\s]/gi, ' ')
    .split(/\s+/)
    .map(w => w.toLowerCase())
    .filter(w => w.length > 2 && !stopWords.has(w));
}
