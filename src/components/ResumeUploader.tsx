import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Sparkles, X, FilePlus } from 'lucide-react';
import { parseResumeFile, parseResumeText } from '../utils/parser';
import type { CandidateResume } from '../types';

interface ResumeUploaderProps {
  onAddCandidates: (resumes: CandidateResume[]) => void;
  onClose: () => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onAddCandidates, onClose }) => {
  const [activeTab, setActiveTab] = useState<'FILE' | 'PASTE'>('FILE');
  const [pastedText, setPastedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const processFiles = async () => {
    if (uploadedFiles.length === 0 && !pastedText.trim()) return;

    setIsProcessing(true);
    const parsedResumes: CandidateResume[] = [];

    try {
      if (activeTab === 'FILE') {
        for (const file of uploadedFiles) {
          const res = await parseResumeFile(file);
          parsedResumes.push(res);
        }
      } else {
        if (pastedText.trim()) {
          const res = parseResumeText(pastedText, 'Pasted_Candidate_Resume.txt');
          parsedResumes.push(res);
        }
      }

      if (parsedResumes.length > 0) {
        onAddCandidates(parsedResumes);
        onClose();
      }
    } catch (err) {
      console.error('Error parsing uploaded files:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Upload Candidate Resumes</h2>
              <p className="text-xs text-slate-400">Support PDF, DOCX, TXT, or raw text input with automated NLP extraction</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 pt-3">
          <button
            onClick={() => setActiveTab('FILE')}
            className={`pb-3 text-xs font-semibold px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'FILE'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" /> Bulk File Drag & Drop
          </button>
          <button
            onClick={() => setActiveTab('PASTE')}
            className={`pb-3 text-xs font-semibold px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'PASTE'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FilePlus className="w-4 h-4" /> Paste Resume Text
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-4 text-xs text-slate-300">
          
          {activeTab === 'FILE' ? (
            <div>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 bg-slate-950/50 hover:bg-slate-950/80 rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Upload className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Click or Drag & Drop Resumes Here</p>
                  <p className="text-slate-500 text-[11px] mt-1">Supports PDF, DOCX, TXT format (Multiple files allowed)</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2 max-h-36 overflow-y-auto pr-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Selected Files ({uploadedFiles.length}):
                  </div>
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
                      <span className="truncate max-w-xs font-mono">{file.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
                        }}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Paste Raw Resume Text:</label>
              <textarea
                rows={10}
                placeholder="Paste full resume text here (Name, Email, Work Experience, Skills, Education)..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-slate-500 text-xs">
            NLP Parser will extract entities, work history timeline, and check claim integrity.
          </span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white font-semibold transition">
              Cancel
            </button>
            <button
              onClick={processFiles}
              disabled={isProcessing || (uploadedFiles.length === 0 && !pastedText.trim())}
              className={`px-5 py-2 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 ${
                isProcessing || (uploadedFiles.length === 0 && !pastedText.trim())
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-cyan-500/20 hover:brightness-110'
              }`}
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" /> Processing NLP...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" /> Extract & Match Candidates
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
