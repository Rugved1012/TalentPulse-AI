# TalentPulse AI - AI / ML Resume & Job Matching System

TalentPulse AI is an enterprise-grade web platform and NLP scoring engine designed for recruiters to analyze resumes against custom job descriptions, rank candidates multi-dimensionally, explain match rationales, and detect unsupported or contradictory resume claims.

---

## 🚀 Live Demo

👉 **Live Web App:** [https://talentfinder-ai.netlify.app/](https://talentfinder-ai.netlify.app/)  
👉 **GitHub Repository:** [https://github.com/Rugved1012/TalentPulse-AI](https://github.com/Rugved1012/TalentPulse-AI)

---

## 🌟 Key Features

* **Resume Ingestion**: Drag-and-Drop support for PDF, DOCX, TXT, or raw text input with automated text extraction.
* **Job Description Studio**: Custom role title, required skills, preferred skills, and dynamic scoring weight distribution.
* **Information Extraction**: Automated NLP entity parser for candidate name, contact info, skills, work history timeline, education, and certifications.
* **Multi-Dimensional Candidate Scoring**:
  - Semantic Fit (30%)
  - Skill Coverage (40%)
  - Experience Alignment (15%)
  - Education Fit (15%)
  - Integrity Risk Penalty Assessment
* **Claim Contradiction & Anomaly Detection (Innovation Feature)**:
  - Timeline Anachronism validation (e.g., claiming 14 yrs of React experience when React was released in 2013).
  - Graduation year vs. overall experience contradiction detection.
  - Unsubstantiated top skill claims (prominent header skills lacking work history proof).
  - Employment date overlap detection.
* **Explainable Match Breakdown**:
  - Recharts 5-Dimensional Spider Radar Chart.
  - Required skills verification matrix with extracted evidence snippets.
  - AI executive match explanation & hiring recommendation.
* **Search, Filters & Comparison**:
  - Real-time search, min score slider, min experience slider, and required skill chip filters.
  - Side-by-side candidate comparison modal.
  - Recruiter talent pool analytics dashboard.

---

## 📋 System Requirements & Prerequisites

Before setting up the project locally, ensure your system meets the following requirements:

### Software Requirements
* **Node.js**: `v18.0.0` or higher (Recommended: Node.js v20+)
* **Package Manager**: `npm` (v9+) or `yarn` / `pnpm`
* **Python**: `3.9+` *(Optional: Required only for running the standalone backend NLP engine)*
* **Git**: `2.30.0+`
* **Supported Browsers**: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari

---

## ⚙️ Installation & Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Rugved1012/TalentPulse-AI.git
cd TalentPulse-AI
```

### 2. Install Dependencies
Install all required node packages using npm:
```bash
npm install
```

### 3. Run Development Server
Start the local Vite development server:
```bash
npm run dev
```
Once started, open your browser and navigate to:
```text
http://localhost:5173
```

### 4. Build for Production
To create an optimized production build:
```bash
npm run build
```
The output static assets will be generated in the `dist/` directory.

### 5. Run Standalone Python Anomaly Engine (Optional CLI)
To test the Python-based resume anomaly and contradiction detection engine directly:
```bash
python backend/engine.py --demo
```

---

## 📁 Project Structure

```text
TalentPulse-AI/
├── backend/
│   └── engine.py               # Standalone Python NLP & Anomaly Detection Engine
├── public/
│   ├── favicon.svg             # App favicon
│   ├── icons.svg               # SVG asset bundle
│   └── _redirects              # Netlify SPA routing configuration
├── src/
│   ├── assets/                 # Images & icons
│   ├── components/             # UI Components (Kanban, Modals, Charts, Filters)
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── CandidateCard.tsx
│   │   ├── CandidateComparisonModal.tsx
│   │   ├── CandidateDetailModal.tsx
│   │   ├── HiringPipelineKanban.tsx
│   │   ├── InterviewKitModal.tsx
│   │   ├── JobDescriptionStudio.tsx
│   │   ├── PythonEngineModal.tsx
│   │   └── ResumeUploader.tsx
│   ├── data/                   # Initial candidate & job sample dataset
│   ├── types/                  # TypeScript interface definitions
│   ├── utils/                  # Resume parsers, scoring engine, contradiction rules
│   ├── App.tsx                 # Main application component
│   └── main.tsx                # Application entry point
├── package.json                # Dependencies and npm scripts
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite bundle configuration
```

---

## 🛠️ Technology Stack

* **Frontend Framework:** React 19 + TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS v4 + Custom Glassmorphism CSS
* **Icons & Charts:** Lucide React, Recharts
* **Document Parsers:** Mammoth.js (DOCX), PDF.js (PDF)
* **Backend Engine:** Python 3 (Regex NLP & Anachronism Detection)
* **Hosting / Deployment:** Netlify (Continuous Deployment via Git)
