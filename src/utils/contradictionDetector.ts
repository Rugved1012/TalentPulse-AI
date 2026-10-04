import type { CandidateResume, AnomalyFlag } from '../types';
import { TECH_RELEASE_DATABASE, CURRENT_YEAR } from './technologyReleaseDates';

export function detectResumeAnomalies(resume: CandidateResume): AnomalyFlag[] {
  const flags: AnomalyFlag[] = [];

  // 1. Check for Technology Timeline Anachronisms (Impossible Years of Experience)
  for (const key in TECH_RELEASE_DATABASE) {
    const tech = TECH_RELEASE_DATABASE[key];
    const techNames = [tech.name.toLowerCase(), ...tech.aliases.map(a => a.toLowerCase())];
    
    for (const tName of techNames) {
      const regex1 = new RegExp(`(\\d{1,2})\\+?\\s*(?:years|yrs)(?:\\s+of)?(?:\\s+\\w+)*\\s+${escapeRegex(tName)}`, 'gi');
      const regex2 = new RegExp(`${escapeRegex(tName)}\\s*(?:for|with|experience)?\\s*(\\d{1,2})\\+?\\s*(?:years|yrs)`, 'gi');

      let match: RegExpExecArray | null;
      while ((match = regex1.exec(resume.rawText)) !== null) {
        const claimedYears = parseInt(match[1], 10);
        const maxPossible = CURRENT_YEAR - tech.releaseYear;
        if (claimedYears > maxPossible) {
          flags.push({
            id: `anach-${tech.name}-${claimedYears}`,
            type: 'TIMELINE_ANACHRONISM',
            severity: 'CRITICAL',
            title: `Impossible ${tech.name} Experience Claim`,
            description: `Candidate claims ${claimedYears} years of experience with ${tech.name}, but ${tech.name} was initially released in ${tech.releaseYear} (max possible: ${maxPossible} years).`,
            claim: `Claimed: ${claimedYears} years of ${tech.name}`,
            evidence: `Source snippet: "${match[0]}"`
          });
        }
      }

      while ((match = regex2.exec(resume.rawText)) !== null) {
        const claimedYears = parseInt(match[1], 10);
        const maxPossible = CURRENT_YEAR - tech.releaseYear;
        if (claimedYears > maxPossible) {
          flags.push({
            id: `anach-${tech.name}-${claimedYears}-reverse`,
            type: 'TIMELINE_ANACHRONISM',
            severity: 'CRITICAL',
            title: `Impossible ${tech.name} Experience Claim`,
            description: `Candidate claims ${claimedYears} years with ${tech.name}, which exceeds the technology's age (${tech.name} released in ${tech.releaseYear}).`,
            claim: `Claimed: ${claimedYears} years of ${tech.name}`,
            evidence: `Source snippet: "${match[0]}"`
          });
        }
      }
    }
  }

  // 2. Check Graduation Date vs Experience Claim
  if (resume.education.length > 0 && resume.experience.length > 0) {
    const earliestGraduation = Math.min(...resume.education.map(e => e.graduationYear || CURRENT_YEAR));
    const totalExpYearsFromWork = resume.experience.reduce((sum, exp) => {
      const duration = Math.max(1, (exp.endYear || CURRENT_YEAR) - exp.startYear);
      return sum + duration;
    }, 0);

    const totalExpClaimMatch = resume.rawText.match(/(\d{1,2})\+?\s*(?:years|yrs)(?:\s+of)?\s+(?:overall|total|professional)?\s*experience/i);
    if (totalExpClaimMatch) {
      const claimedTotalYears = parseInt(totalExpClaimMatch[1], 10);
      const yearsSinceGrad = CURRENT_YEAR - earliestGraduation;

      if (claimedTotalYears > (yearsSinceGrad + 3)) {
        flags.push({
          id: `grad-mismatch-${claimedTotalYears}`,
          type: 'GRADUATION_MISMATCH',
          severity: 'CRITICAL',
          title: 'Experience vs Graduation Timeline Contradiction',
          description: `Candidate claims ${claimedTotalYears} years of professional experience, but graduated college in ${earliestGraduation} (${yearsSinceGrad} years ago).`,
          claim: `Summary claims ${claimedTotalYears}+ years experience vs graduation year ${earliestGraduation}`,
          evidence: `Graduation: ${earliestGraduation} | Work History Duration: ${totalExpYearsFromWork} yrs`
        });
      }
    }
  }

  // 3. Overlapping Employment Period Check (Date Inflation)
  if (resume.experience.length >= 2) {
    const sortedExp = [...resume.experience].sort((a, b) => a.startYear - b.startYear);
    for (let i = 0; i < sortedExp.length - 1; i++) {
      const current = sortedExp[i];
      const next = sortedExp[i + 1];
      
      const currentEnd = current.endYear || CURRENT_YEAR;
      const overlapYears = currentEnd - next.startYear;

      const isCurrentPartTime = current.title.toLowerCase().includes('freelance') || current.title.toLowerCase().includes('consultant') || current.title.toLowerCase().includes('intern');
      const isNextPartTime = next.title.toLowerCase().includes('freelance') || next.title.toLowerCase().includes('consultant') || next.title.toLowerCase().includes('intern');

      if (overlapYears >= 2 && !isCurrentPartTime && !isNextPartTime) {
        flags.push({
          id: `overlap-${current.id}-${next.id}`,
          type: 'DATE_OVERLAP',
          severity: 'WARNING',
          title: 'Suspicious Work History Timeline Overlap',
          description: `Full-time roles "${current.title}" at ${current.company} (${current.startYear}-${current.endYear || 'Present'}) and "${next.title}" at ${next.company} (${next.startYear}-${next.endYear || 'Present'}) overlap by ${overlapYears} years.`,
          claim: `Dual concurrent full-time employment (${overlapYears} yrs overlap)`,
          evidence: `${current.company} (${current.startYear}-${current.endYear}) vs ${next.company} (${next.startYear}-${next.endYear})`
        });
      }
    }
  }

  // 4. Unsubstantiated Skill Claims
  if (resume.extractedSkills.length > 0 && resume.experience.length > 0) {
    const allBulletText = resume.experience
      .flatMap(exp => exp.description)
      .join(' ')
      .toLowerCase();

    const unsubstantiated: string[] = [];

    for (const skill of resume.extractedSkills) {
      const skillLower = skill.toLowerCase();
      if (skillLower.length > 3 && !allBulletText.includes(skillLower)) {
        unsubstantiated.push(skill);
      }
    }

    if (unsubstantiated.length >= 3) {
      flags.push({
        id: `unsubstantiated-skills-${unsubstantiated.length}`,
        type: 'UNSUBSTANTIATED_SKILL',
        severity: 'WARNING',
        title: 'Unsubstantiated Top Skills (Zero Evidence in Work History)',
        description: `Candidate prominently lists skills [${unsubstantiated.slice(0, 5).join(', ')}] in their skill section, but none of their work history descriptions demonstrate using these tools.`,
        claim: `Prominently claimed skills lack project/role evidence`,
        evidence: `Unsubstantiated: ${unsubstantiated.join(', ')}`
      });
    }
  }

  // 5. Seniority Title vs Years of Experience Mismatch
  const totalCalculatedExp = resume.experience.reduce((sum, e) => sum + Math.max(1, (e.endYear || CURRENT_YEAR) - e.startYear), 0);
  const seniorTitles = ['vp of', 'director', 'principal', 'head of', 'chief', 'lead architect'];
  const hasSeniorTitle = resume.experience.some(e => seniorTitles.some(st => e.title.toLowerCase().includes(st)));

  if (hasSeniorTitle && totalCalculatedExp < 3) {
    flags.push({
      id: `seniority-mismatch`,
      type: 'SENIORITY_MISMATCH',
      severity: 'WARNING',
      title: 'Executive/Senior Title Mismatch with Brief Work History',
      description: `Candidate holds a Senior/Executive title (e.g. Principal/Director) despite having under 3 total years (${totalCalculatedExp} yrs) of overall work history.`,
      claim: `Senior/Executive title with ${totalCalculatedExp} yrs total experience`,
      evidence: `Work history spans ${totalCalculatedExp} years total`
    });
  }

  // 6. Keyword Stuffing Check
  if (resume.rawText.length > 100) {
    const wordCount = resume.rawText.split(/\s+/).length;
    const skillDensity = (resume.extractedSkills.length / wordCount) * 100;
    
    if (resume.extractedSkills.length > 35 && skillDensity > 12) {
      flags.push({
        id: `keyword-stuffing`,
        type: 'KEYWORD_STUFFING',
        severity: 'INFO',
        title: 'Keyword Stuffing Detected',
        description: `Resume has an unnaturally high skill density (${resume.extractedSkills.length} skills listed in a ${wordCount}-word resume), suggesting automated resume padding.`,
        claim: `${resume.extractedSkills.length} skills listed in short resume`,
        evidence: `Skill density: ${skillDensity.toFixed(1)}%`
      });
    }
  }

  return flags;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
