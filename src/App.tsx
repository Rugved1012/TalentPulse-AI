import React, { useState, useMemo } from 'react';
import { 
  Search, 
  RotateCcw, 
  ShieldAlert, 
  ShieldCheck, 
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  Zap,
  Filter,
  LayoutGrid,
  Kanban
} from 'lucide-react';
import { SAMPLE_JOB_DESCRIPTIONS, SAMPLE_CANDIDATES } from './data/sampleData';
import type { CandidateResume, JobDescription, CandidateEvaluation, FilterState } from './types';
import { evaluateCandidate } from './utils/scoringEngine';

import { Header } from './components/Header';
import { CandidateCard } from './components/CandidateCard';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { JobDescriptionStudio } from './components/JobDescriptionStudio';
import { ResumeUploader } from './components/ResumeUploader';
import { CandidateComparisonModal } from './components/CandidateComparisonModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { PythonEngineModal } from './components/PythonEngineModal';
import { InterviewKitModal } from './components/InterviewKitModal';
import { HiringPipelineKanban } from './components/HiringPipelineKanban';

export const App: React.FC = () => {
  // State
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>(SAMPLE_JOB_DESCRIPTIONS);
  const [activeJd, setActiveJd] = useState<JobDescription>(SAMPLE_JOB_DESCRIPTIONS[0]);
  const [candidates, setCandidates] = useState<CandidateResume[]>(SAMPLE_CANDIDATES);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'GRID' | 'KANBAN'>('GRID');
  
  // Modals
  const [showUploader, setShowUploader] = useState(false);
  const [showJdStudio, setShowJdStudio] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showPythonModal, setShowPythonModal] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [activeCandidateDetail, setActiveCandidateDetail] = useState<CandidateResume | null>(null);
  const [activeInterviewKit, setActiveInterviewKit] = useState<CandidateResume | null>(null);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    minScore: 0,
    minExperienceYears: 0,
    selectedSkills: [],
    selectedEducation: [],
    integrityFilter: 'ALL',
    recommendationFilter: 'ALL',
    sortBy: 'SCORE_DESC'
  });

  // Calculate Evaluations for all candidates against active JD
  const evaluationsMap = useMemo(() => {
    const map = new Map<string, CandidateEvaluation>();
    candidates.forEach(cand => {
      const evaluation = evaluateCandidate(cand, activeJd);
      map.set(cand.id, evaluation);
    });
    return map;
  }, [candidates, activeJd]);

  // Filtered & Sorted Candidate List
  const filteredCandidates = useMemo(() => {
    return candidates.filter(cand => {
      const evalObj = evaluationsMap.get(cand.id);
      if (!evalObj) return false;

      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = cand.name.toLowerCase().includes(q);
        const matchSkills = cand.extractedSkills.some(s => s.toLowerCase().includes(q));
        const matchTitle = cand.experience.some(e => e.title.toLowerCase().includes(q) || e.company.toLowerCase().includes(q));
        if (!matchName && !matchSkills && !matchTitle) return false;
      }

      // 2. Min Score Filter
      if (evalObj.overallScore < filters.minScore) return false;

      // 3. Min Experience Years Filter
      if (evalObj.calculatedExperienceYears < filters.minExperienceYears) return false;

      // 4. Integrity Filter
      if (filters.integrityFilter === 'VERIFIED_ONLY' && evalObj.anomalies.length > 0) return false;
      if (filters.integrityFilter === 'FLAGGED_ONLY' && evalObj.anomalies.length === 0) return false;

      // 5. Selected Required Skills Checklist Filter
      if (filters.selectedSkills.length > 0) {
        const hasAllSelected = filters.selectedSkills.every(reqSkill =>
          evalObj.matchedSkills.some(s => s.skill === reqSkill && s.status === 'MATCHED')
        );
        if (!hasAllSelected) return false;
      }

      return true;
    }).sort((a, b) => {
      const evalA = evaluationsMap.get(a.id);
      const evalB = evaluationsMap.get(b.id);
      if (!evalA || !evalB) return 0;

      switch (filters.sortBy) {
        case 'SCORE_DESC':
          return evalB.overallScore - evalA.overallScore;
        case 'SCORE_ASC':
          return evalA.overallScore - evalB.overallScore;
        case 'EXP_DESC':
          return evalB.calculatedExperienceYears - evalA.calculatedExperienceYears;
        case 'INTEGRITY_DESC':
          return evalA.integrityScore - evalB.integrityScore;
        case 'NAME_ASC':
          return a.name.localeCompare(b.name);
        default:
          return evalB.overallScore - evalA.overallScore;
      }
    });
  }, [candidates, evaluationsMap, filters]);

  // Handlers
  const handleAddCandidates = (newResumes: CandidateResume[]) => {
    setCandidates(prev => [...newResumes, ...prev]);
  };

  const handleUpdateJd = (updatedJd: JobDescription) => {
    setActiveJd(updatedJd);
    setJobDescriptions(prev => prev.map(j => j.id === updatedJd.id ? updatedJd : j));
  };

  const handleToggleCompare = (candId: string) => {
    setSelectedCompareIds(prev => 
      prev.includes(candId) ? prev.filter(id => id !== candId) : [...prev, candId]
    );
  };

  const handleToggleSkillFilter = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter(s => s !== skill)
        : [...prev.selectedSkills, skill]
    }));
  };

  const handleUpdateStage = (candId: string, newStage: CandidateResume['pipelineStage']) => {
    setCandidates(prev => prev.map(c => c.id === candId ? { ...c, pipelineStage: newStage } : c));
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      minScore: 0,
      minExperienceYears: 0,
      selectedSkills: [],
      selectedEducation: [],
      integrityFilter: 'ALL',
      recommendationFilter: 'ALL',
      sortBy: 'SCORE_DESC'
    });
  };

  const reloadSampleDataset = () => {
    setCandidates(SAMPLE_CANDIDATES);
    setSelectedCompareIds([]);
    resetFilters();
  };

  const flaggedCount = useMemo(() => {
    return candidates.filter(c => {
      const ev = evaluationsMap.get(c.id);
      return ev && ev.anomalies.length > 0;
    }).length;
  }, [candidates, evaluationsMap]);

  const strongHireCount = useMemo(() => {
    return candidates.filter(c => {
      const ev = evaluationsMap.get(c.id);
      return ev && ev.hiringRecommendation === 'STRONG_HIRE';
    }).length;
  }, [candidates, evaluationsMap]);

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navigation Header */}
      <Header
        jobDescriptions={jobDescriptions}
        activeJd={activeJd}
        onSelectJd={setActiveJd}
        onOpenUploader={() => setShowUploader(true)}
        onOpenJdStudio={() => setShowJdStudio(true)}
        onOpenAnalytics={() => setShowAnalytics(true)}
        onOpenPythonModal={() => setShowPythonModal(true)}
        onOpenComparison={() => setShowComparison(true)}
        candidateCount={candidates.length}
        flaggedCount={flaggedCount}
        selectedCompareCount={selectedCompareIds.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Active Role & Quick Test Presets Banner */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 bg-slate-900/50 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Target Role Profile
                </span>
                <span className="text-xs text-slate-400 font-mono">Min Exp: <strong className="text-white">{activeJd.experienceMinYears}+ yrs</strong></span>
                <span className="text-xs text-slate-400 font-mono">Education: <strong className="text-white">{activeJd.requiredEducation} Degree</strong></span>
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                {activeJd.title}
              </h2>
              <p className="text-xs text-slate-400 max-w-3xl line-clamp-2 leading-relaxed">
                {activeJd.description}
              </p>
            </div>

            {/* Quick Test Preset Buttons & View Mode Toggle */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
              
              {/* Grid vs Kanban Toggle */}
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mr-2">
                <button
                  onClick={() => setViewMode('GRID')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 ${
                    viewMode === 'GRID' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" /> Evaluation Grid
                </button>
                <button
                  onClick={() => setViewMode('KANBAN')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 ${
                    viewMode === 'KANBAN' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Kanban className="w-3.5 h-3.5" /> Pipeline Kanban
                </button>
              </div>

              <button
                onClick={() => setFilters(prev => ({ ...prev, integrityFilter: 'FLAGGED_ONLY' }))}
                className="px-3 py-1.5 text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 rounded-xl border border-amber-500/30 transition flex items-center gap-1.5"
                title="Test claim contradiction detection cases"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Test Contradictions
              </button>
              
              <button
                onClick={() => setFilters(prev => ({ ...prev, minScore: 80, integrityFilter: 'VERIFIED_ONLY' }))}
                className="px-3 py-1.5 text-xs font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 rounded-xl border border-emerald-500/30 transition flex items-center gap-1.5"
                title="Filter top strong hires"
              >
                <Award className="w-3.5 h-3.5 text-emerald-400" /> Strong Hires
              </button>

              <button
                onClick={reloadSampleDataset}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                title="Reset test resumes"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" /> Reset
              </button>
            </div>

          </div>
        </div>

        {/* Talent Pool Summary Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">Total Applicants</span>
              <span className="text-xl font-black font-mono text-white">{candidates.length}</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">Strong Hires</span>
              <span className="text-xl font-black font-mono text-emerald-400">{strongHireCount}</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">Anomaly Flagged</span>
              <span className="text-xl font-black font-mono text-amber-400">{flaggedCount}</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold block">Top Match Score</span>
              <span className="text-xl font-black font-mono text-cyan-400">
                {evaluationsMap.size > 0 ? Math.max(...Array.from(evaluationsMap.values()).map(e => e.overallScore)) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* View Mode Switching: GRID vs KANBAN */}
        {viewMode === 'KANBAN' ? (
          <HiringPipelineKanban
            candidates={candidates}
            evaluationsMap={evaluationsMap}
            onUpdateStage={handleUpdateStage}
            onViewDetails={setActiveCandidateDetail}
          />
        ) : (
          <>
            {/* Search, Interactive Skill Chips & Filter Bar */}
            <div className="glass-panel rounded-3xl p-5 border border-slate-800 bg-slate-900/60 space-y-4">
              
              <div className="flex flex-col md:flex-row items-center gap-3">
                
                {/* Live Search Input */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search candidate name, skill, job title, or company..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition shadow-inner"
                  />
                </div>

                {/* Claim Integrity Filter Tabs */}
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-2xl p-1 w-full md:w-auto">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, integrityFilter: 'ALL' }))}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                      filters.integrityFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All ({candidates.length})
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, integrityFilter: 'VERIFIED_ONLY' }))}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1 ${
                      filters.integrityFilter === 'VERIFIED_ONLY' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, integrityFilter: 'FLAGGED_ONLY' }))}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1 ${
                      filters.integrityFilter === 'FLAGGED_ONLY' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Flagged ({flaggedCount})
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2 w-full md:w-auto">
                  <span className="text-[11px] font-semibold text-slate-400 shrink-0">Sort By:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                    className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="SCORE_DESC" className="bg-slate-900">Match Score (High to Low)</option>
                    <option value="EXP_DESC" className="bg-slate-900">Experience (Years)</option>
                    <option value="INTEGRITY_DESC" className="bg-slate-900">Claim Integrity Risk</option>
                    <option value="NAME_ASC" className="bg-slate-900">Candidate Name (A-Z)</option>
                  </select>
                </div>

              </div>

              {/* Interactive Skill Chips Checklist Filter Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3 text-cyan-400" /> Required Skills Filter:
                </span>
                {activeJd.requiredSkills.map(skill => {
                  const isSelected = filters.selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => handleToggleSkillFilter(skill)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-md shadow-cyan-500/20'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {isSelected ? <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> : <XCircle className="w-3.5 h-3.5 text-slate-600" />}
                      {skill}
                    </button>
                  );
                })}
              </div>

              {/* Secondary Filter Sliders */}
              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center text-xs">
                
                {/* Min Score Slider */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Min Overall Score:</span>
                    <span className="font-mono text-cyan-400 font-bold">{filters.minScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="95"
                    value={filters.minScore}
                    onChange={(e) => setFilters(prev => ({ ...prev, minScore: parseInt(e.target.value, 10) }))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                {/* Min Experience Slider */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Min Experience Years:</span>
                    <span className="font-mono text-indigo-400 font-bold">{filters.minExperienceYears} yrs</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={filters.minExperienceYears}
                    onChange={(e) => setFilters(prev => ({ ...prev, minExperienceYears: parseInt(e.target.value, 10) }))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                {/* Reset Filters button */}
                <div className="flex justify-end items-center gap-3">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Showing <strong className="text-white font-bold">{filteredCandidates.length}</strong> of {candidates.length} candidates
                  </span>
                  {(filters.minScore > 0 || filters.minExperienceYears > 0 || filters.searchQuery || filters.integrityFilter !== 'ALL' || filters.selectedSkills.length > 0) && (
                    <button
                      onClick={resetFilters}
                      className="px-2.5 py-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 underline"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

              </div>

            </div>

            {/* Candidate Evaluation Grid */}
            {filteredCandidates.length === 0 ? (
              <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800 space-y-3">
                <Users className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">No Candidates Match Active Filters</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Try adjusting your score sliders, clearing skill filter chips, or relaxing experience requirements.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl shadow transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCandidates.map((cand, idx) => {
                  const evalObj = evaluationsMap.get(cand.id)!;
                  return (
                    <CandidateCard
                      key={cand.id}
                      candidate={cand}
                      evaluation={evalObj}
                      rank={idx + 1}
                      isSelectedForCompare={selectedCompareIds.includes(cand.id)}
                      onToggleCompare={handleToggleCompare}
                      onViewDetails={setActiveCandidateDetail}
                      onOpenInterviewKit={setActiveInterviewKit}
                      onSkillClick={handleToggleSkillFilter}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}

      </main>

      {/* Modals */}
      {showUploader && (
        <ResumeUploader
          onAddCandidates={handleAddCandidates}
          onClose={() => setShowUploader(false)}
        />
      )}

      {showJdStudio && (
        <JobDescriptionStudio
          jd={activeJd}
          onSave={handleUpdateJd}
          onClose={() => setShowJdStudio(false)}
        />
      )}

      {activeCandidateDetail && (
        <CandidateDetailModal
          candidate={activeCandidateDetail}
          evaluation={evaluationsMap.get(activeCandidateDetail.id)!}
          jd={activeJd}
          onClose={() => setActiveCandidateDetail(null)}
        />
      )}

      {activeInterviewKit && (
        <InterviewKitModal
          candidate={activeInterviewKit}
          evaluation={evaluationsMap.get(activeInterviewKit.id)!}
          jd={activeJd}
          onClose={() => setActiveInterviewKit(null)}
        />
      )}

      {showComparison && (
        <CandidateComparisonModal
          candidates={candidates.filter(c => selectedCompareIds.includes(c.id))}
          evaluations={candidates.filter(c => selectedCompareIds.includes(c.id)).map(c => evaluationsMap.get(c.id)!)}
          jd={activeJd}
          onClose={() => setShowComparison(false)}
        />
      )}

      {showAnalytics && (
        <AnalyticsDashboard
          candidates={candidates}
          evaluations={Array.from(evaluationsMap.values())}
          jd={activeJd}
          onClose={() => setShowAnalytics(false)}
        />
      )}

      {showPythonModal && (
        <PythonEngineModal
          onClose={() => setShowPythonModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        TalentPulse AI • AI / ML Resume & Job Matching System
      </footer>

    </div>
  );
};
export default App;
