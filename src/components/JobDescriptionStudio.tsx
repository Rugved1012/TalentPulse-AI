import React, { useState } from 'react';
import { X, Plus, Save, Sliders, AlertCircle } from 'lucide-react';
import type { JobDescription } from '../types';

interface JobDescriptionStudioProps {
  jd: JobDescription;
  onSave: (updatedJd: JobDescription) => void;
  onClose: () => void;
}

export const JobDescriptionStudio: React.FC<JobDescriptionStudioProps> = ({
  jd,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<JobDescription>({ ...jd });
  const [newReqSkill, setNewReqSkill] = useState('');
  const [newPrefSkill, setNewPrefSkill] = useState('');

  const handleWeightChange = (key: keyof JobDescription['weights'], val: number) => {
    setFormData(prev => ({
      ...prev,
      weights: {
        ...prev.weights,
        [key]: val
      }
    }));
  };

  const addRequiredSkill = () => {
    if (newReqSkill.trim() && !formData.requiredSkills.includes(newReqSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, newReqSkill.trim()]
      }));
      setNewReqSkill('');
    }
  };

  const removeRequiredSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skill)
    }));
  };

  const addPreferredSkill = () => {
    if (newPrefSkill.trim() && !formData.preferredSkills.includes(newPrefSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        preferredSkills: [...prev.preferredSkills, newPrefSkill.trim()]
      }));
      setNewPrefSkill('');
    }
  };

  const removePreferredSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      preferredSkills: prev.preferredSkills.filter(s => s !== skill)
    }));
  };

  const totalWeights = formData.weights.semantic + formData.weights.skills + formData.weights.experience + formData.weights.education;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Job Description Studio</h2>
              <p className="text-xs text-slate-400">Configure role requirements, required skills, and matching weightings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-300">
          
          {/* Title & Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Role Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Min/Max Experience & Education */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Min Experience (Years)</label>
              <input
                type="number"
                min="0"
                max="20"
                value={formData.experienceMinYears}
                onChange={(e) => setFormData(prev => ({ ...prev, experienceMinYears: parseInt(e.target.value, 10) || 0 }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Max Target Experience</label>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.experienceMaxYears}
                onChange={(e) => setFormData(prev => ({ ...prev, experienceMaxYears: parseInt(e.target.value, 10) || 5 }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Required Education Level</label>
              <select
                value={formData.requiredEducation}
                onChange={(e) => setFormData(prev => ({ ...prev, requiredEducation: e.target.value as any }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="High School">High School</option>
                <option value="Bachelor">Bachelor's Degree</option>
                <option value="Master">Master's Degree</option>
                <option value="PhD">Ph.D. / Doctorate</option>
              </select>
            </div>
          </div>

          {/* Required Skills Matrix */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Required Skills (Mandatory for High Match)</label>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="e.g. PyTorch, Docker, FastAPI..."
                value={newReqSkill}
                onChange={(e) => setNewReqSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addRequiredSkill()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={addRequiredSkill}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.requiredSkills.map(skill => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center gap-1.5"
                >
                  {skill}
                  <button onClick={() => removeRequiredSkill(skill)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Bonus Skills */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Preferred / Bonus Skills</label>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="e.g. Kubernetes, LangChain..."
                value={newPrefSkill}
                onChange={(e) => setNewPrefSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPreferredSkill()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={addPreferredSkill}
                className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.preferredSkills.map(skill => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center gap-1.5"
                >
                  {skill}
                  <button onClick={() => removePreferredSkill(skill)} className="hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Scoring Weight Sliders */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Scoring Weight Distribution</h3>
              <span className={`text-xs font-semibold ${totalWeights === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                Total Weight: {totalWeights}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Semantic Fit:</span>
                  <span className="font-mono text-cyan-400 font-bold">{formData.weights.semantic}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.weights.semantic}
                  onChange={(e) => handleWeightChange('semantic', parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Skill Coverage:</span>
                  <span className="font-mono text-indigo-400 font-bold">{formData.weights.skills}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.weights.skills}
                  onChange={(e) => handleWeightChange('skills', parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Experience Fit:</span>
                  <span className="font-mono text-emerald-400 font-bold">{formData.weights.experience}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.weights.experience}
                  onChange={(e) => handleWeightChange('experience', parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Education Fit:</span>
                  <span className="font-mono text-amber-400 font-bold">{formData.weights.education}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.weights.education}
                  onChange={(e) => handleWeightChange('education', parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Description Text */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Full Job Description Text</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {totalWeights !== 100 && (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Note: Weights sum to {totalWeights}%. System will normalize.
              </span>
            )}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(formData);
                onClose();
              }}
              className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/25 transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save & Recalculate Scores
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
