import sys
import json
import re
import io
from datetime import datetime

# Ensure standard stdout uses UTF-8 on Windows console
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Technology Release Database for Contradiction Detection
TECH_RELEASE_DB = {
    'react': {'name': 'React', 'year': 2013},
    'nextjs': {'name': 'Next.js', 'year': 2016},
    'vue': {'name': 'Vue.js', 'year': 2014},
    'angular': {'name': 'Angular', 'year': 2016},
    'typescript': {'name': 'TypeScript', 'year': 2012},
    'rust': {'name': 'Rust', 'year': 2015},
    'docker': {'name': 'Docker', 'year': 2013},
    'kubernetes': {'name': 'Kubernetes', 'year': 2014},
    'pytorch': {'name': 'PyTorch', 'year': 2016},
    'tensorflow': {'name': 'TensorFlow', 'year': 2015},
    'chatgpt': {'name': 'ChatGPT / GPT-4', 'year': 2022},
    'transformers': {'name': 'Transformers', 'year': 2018},
    'langchain': {'name': 'LangChain', 'year': 2022},
    'fastapi': {'name': 'FastAPI', 'year': 2018},
}

CURRENT_YEAR = 2026

def detect_anomalies(resume_text, skills, experience, education):
    """
    Detects unsupported, anachronistic, or contradictory claims in resumes.
    """
    flags = []

    # 1. Timeline Anachronisms (Impossible Tech Experience Years)
    for tech_key, info in TECH_RELEASE_DB.items():
        pattern1 = rf"(\d{{1,2}})\+?\s*(?:years|yrs)(?:\s+of)?(?:\s+\w+)*\s+{info['name']}"
        pattern2 = rf"{info['name']}\s*(?:for|with|experience)?\s*(\d{{1,2}})\+?\s*(?:years|yrs)"

        for pat in [pattern1, pattern2]:
            matches = re.finditer(pat, resume_text, re.IGNORECASE)
            for m in matches:
                claimed_yrs = int(m.group(1))
                max_possible = CURRENT_YEAR - info['year']
                if claimed_yrs > max_possible:
                    flags.append({
                        'type': 'TIMELINE_ANACHRONISM',
                        'severity': 'CRITICAL',
                        'title': f"Impossible {info['name']} Experience Claim",
                        'description': f"Claimed {claimed_yrs} yrs with {info['name']} (released in {info['year']}, max possible: {max_possible} yrs).",
                        'evidence': m.group(0)
                    })

    # 2. Graduation Date vs Experience Claim
    if education and experience:
        grad_years = [e.get('graduationYear', CURRENT_YEAR) for e in education if e.get('graduationYear')]
        earliest_grad = min(grad_years) if grad_years else CURRENT_YEAR
        
        m_tot = re.search(r"(\d{1,2})\+?\s*(?:years|yrs)(?:\s+of)?\s+(?:overall|total|professional)?\s*experience", resume_text, re.IGNORECASE)
        if m_tot:
            claimed_tot = int(m_tot.group(1))
            years_since_grad = CURRENT_YEAR - earliest_grad
            if claimed_tot > (years_since_grad + 3):
                flags.append({
                    'type': 'GRADUATION_MISMATCH',
                    'severity': 'CRITICAL',
                    'title': 'Experience vs Graduation Timeline Contradiction',
                    'description': f"Claims {claimed_tot} yrs total experience, but graduated college in {earliest_grad} ({years_since_grad} yrs ago).",
                    'evidence': f"Graduation: {earliest_grad} vs Claim: {claimed_tot} yrs"
                })

    # 3. Unsubstantiated Skill Claims (Header list vs Work descriptions)
    if skills and experience:
        desc_text = " ".join([b for exp in experience for b in exp.get('description', [])]).lower()
        unsubstantiated = [s for s in skills if len(s) > 3 and s.lower() not in desc_text]
        if len(unsubstantiated) >= 3:
            flags.append({
                'type': 'UNSUBSTANTIATED_SKILL',
                'severity': 'WARNING',
                'title': 'Unsubstantiated Top Skills',
                'description': f"Prominently lists {unsubstantiated[:4]} in skills, but zero proof in work history.",
                'evidence': f"Unsubstantiated: {', '.join(unsubstantiated)}"
            })

    return flags

def evaluate_candidate(candidate, jd):
    """
    Evaluates candidate against job description and returns detailed scoring breakdown.
    """
    raw_text = candidate.get('rawText', '')
    cand_skills = candidate.get('extractedSkills', [])
    exp_list = candidate.get('experience', [])
    edu_list = candidate.get('education', [])

    anomalies = detect_anomalies(raw_text, cand_skills, exp_list, edu_list)

    # Integrity score
    integrity_score = 100
    for a in anomalies:
        if a['severity'] == 'CRITICAL': integrity_score -= 25
        elif a['severity'] == 'WARNING': integrity_score -= 12

    integrity_score = max(0, integrity_score)

    # Skill match
    req_skills = jd.get('requiredSkills', [])
    matched_skills = [s for s in req_skills if any(s.lower() in cs.lower() for cs in cand_skills) or s.lower() in raw_text.lower()]
    missing_skills = [s for s in req_skills if s not in matched_skills]

    skill_cov = (len(matched_skills) / len(req_skills)) * 100 if req_skills else 100
    skill_score = round(min(100, skill_cov))

    # Experience match
    tot_years = sum([max(1, exp.get('endYear', CURRENT_YEAR) - exp.get('startYear', CURRENT_YEAR)) for exp in exp_list])
    min_exp = jd.get('experienceMinYears', 3)
    exp_score = 100 if tot_years >= min_exp else max(20, round(100 - (min_exp - tot_years) * 25))

    # Semantic similarity approximation
    jd_tokens = set(re.findall(r'\w+', (jd.get('description', '') + ' ' + ' '.join(req_skills)).lower()))
    cand_tokens = set(re.findall(r'\w+', raw_text.lower()))
    common = jd_tokens.intersection(cand_tokens)
    semantic_score = min(98, max(30, round((len(common) / max(1, len(jd_tokens))) * 100 * 1.5)))

    # Overall score calculation
    raw_score = (semantic_score * 0.3) + (skill_score * 0.4) + (exp_score * 0.15) + (85 * 0.15)
    if integrity_score < 70:
        raw_score = raw_score * (integrity_score / 100)

    overall_score = round(min(100, max(0, raw_score)))

    # Recommendation
    if integrity_score < 60:
        recommendation = "NEEDS_VERIFICATION (Critical Anomaly Flagged)"
    elif overall_score >= 80:
        recommendation = "STRONG_HIRE"
    elif overall_score >= 65:
        recommendation = "CONSIDER"
    else:
        recommendation = "REJECT"

    return {
        'candidateName': candidate.get('name'),
        'overallScore': overall_score,
        'semanticScore': semantic_score,
        'skillScore': skill_score,
        'experienceScore': exp_score,
        'integrityScore': integrity_score,
        'calculatedExperienceYears': tot_years,
        'matchedSkills': matched_skills,
        'missingSkills': missing_skills,
        'anomaliesCount': len(anomalies),
        'anomalies': anomalies,
        'hiringRecommendation': recommendation
    }

def run_demo():
    print("==================================================")
    print("TALENTPULSE AI: RESUME & JOB MATCHING NLP ENGINE")
    print("==================================================\n")

    jd_sample = {
        'title': 'Senior AI / ML Engineer',
        'requiredSkills': ['Python', 'PyTorch', 'Transformers', 'RAG', 'Vector Databases', 'Docker', 'FastAPI'],
        'experienceMinYears': 4,
        'description': 'Architect production LLM RAG pipelines using PyTorch, HuggingFace transformers, Pinecone vector database, and FastAPI microservices.'
    }

    candid_samples = [
        {
            'name': 'Dr. Sarah Chen',
            'rawText': 'Dr. Sarah Chen. Senior AI Research Engineer with 6 years experience. Built production RAG pipelines with PyTorch, Hugging Face Transformers, Pinecone, FastAPI, Docker on AWS.',
            'extractedSkills': ['Python', 'PyTorch', 'Transformers', 'RAG', 'Vector Databases', 'Docker', 'FastAPI'],
            'experience': [{'startYear': 2020, 'endYear': 2026, 'description': ['Architected production RAG pipeline using PyTorch, Hugging Face Transformers, and Pinecone vector database.']}],
            'education': [{'graduationYear': 2020}]
        },
        {
            'name': 'David Miller (Contradiction Case)',
            'rawText': 'David Miller. Boasting 14 years of React experience and 10 years of PyTorch experience building RAG apps. Graduated college in 2021.',
            'extractedSkills': ['Python', 'React', 'PyTorch', 'Docker'],
            'experience': [{'startYear': 2022, 'endYear': 2026, 'description': ['Utilized 14 years of React experience and 10 years of PyTorch experience.']}],
            'education': [{'graduationYear': 2021}]
        }
    ]

    for cand in candid_samples:
        res = evaluate_candidate(cand, jd_sample)
        print(f"[*] Candidate: {res['candidateName']}")
        print(f"    Overall Score: {res['overallScore']}% | Integrity Score: {res['integrityScore']}%")
        print(f"    Skill Match: {res['skillScore']}% | Semantic Fit: {res['semanticScore']}%")
        print(f"    Matched Skills: {res['matchedSkills']}")
        print(f"    Missing Skills: {res['missingSkills']}")
        print(f"    Recommendation: {res['hiringRecommendation']}")
        if res['anomalies']:
            print(f"    [!] ANOMALY DETECTED ({len(res['anomalies'])}):")
            for a in res['anomalies']:
                print(f"        - [{a['severity']}] {a['title']}: {a['description']}")
        print("-" * 50)

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--demo':
        run_demo()
    else:
        print("Run with '--demo' to test the Python NLP scoring & anomaly detection engine.")
