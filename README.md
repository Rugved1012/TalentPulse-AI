# TalentPulse AI - AI / ML Resume & Job Matching System

TalentPulse AI is a web platform and NLP engine designed for recruiters to analyze resumes against a job description, rank candidates multi-dimensionally, explain match rationales, and detect unsupported or contradictory resume claims.

---

## 🌟 Key Features

* **Resume Ingestion**: Drag-and-Drop support for PDF, DOCX, TXT, or raw text input.
* **Job Description Studio**: Custom role title, required skills, preferred skills, and scoring weight distribution.
* **Information Extraction**: Automated NLP entity parser for candidate name, contact, skills, work timeline, education, and certifications.
* **Multi-Dimensional Candidate Scoring**:
  - Semantic Fit (30%)
  - Skill Coverage (40%)
  - Experience Alignment (15%)
  - Education Fit (15%)
  - Integrity Risk Penalty
* **Claim Contradiction & Anomaly Detection (Innovation Feature)**:
  - Timeline Anachronism validation (e.g. 14 yrs React experience when React was released in 2013).
  - Graduation year vs overall experience contradiction detection.
  - Unsubstantiated top skill claims (skills in summary without work description proof).
  - Employment date overlap detection.
* **Explainable Match Breakdown**:
  - Recharts 5-Dimensional Spider Radar Chart.
  - Required skills verification matrix with quote evidence snippets.
  - AI executive match explanation & hiring recommendation.
* **Search, Filters & Comparison**:
  - Real-time search, min score slider, min experience slider, and required skill chip filter.
  - Candidate side-by-side comparison modal.
  - Recruiter talent pool analytics dashboard.

---

## 🛠️ Quick Start

### 1. Web Platform
```bash
npm install
npm run dev
```
Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.

### 2. Standalone Python Engine CLI
```bash
python backend/engine.py --demo
```
