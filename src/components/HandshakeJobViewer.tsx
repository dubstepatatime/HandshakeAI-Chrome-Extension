import React, { useState } from 'react';
import {
  Briefcase,
  Building,
  MapPin,
  Clock,
  DollarSign,
  Tag,
  Code,
  Sparkles,
  ExternalLink,
  Search,
  Bookmark,
  Send,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { MockJob, MOCK_HANDSHAKE_JOBS } from '../extensionSource';

interface HandshakeJobViewerProps {
  currentJob: MockJob;
  onSelectJob: (job: MockJob) => void;
}

export const HandshakeJobViewer: React.FC<HandshakeJobViewerProps> = ({
  currentJob,
  onSelectJob,
}) => {
  const [showScraperInspect, setShowScraperInspect] = useState<boolean>(true);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customCompany, setCustomCompany] = useState<string>('');
  const [customAbout, setCustomAbout] = useState<string>('');
  const [isEditingCustom, setIsEditingCustom] = useState<boolean>(false);

  const handleApplyCustom = () => {
    if (!customTitle && !customAbout) return;
    const custom: MockJob = {
      id: 'custom-' + Date.now(),
      jobTitle: customTitle || 'Custom Cybersecurity Role',
      companyName: customCompany || 'Custom Employer',
      location: 'Custom Location',
      employmentType: 'Full-time',
      salary: 'Competitive',
      deadline: 'Open',
      tags: ['Custom', 'Cybersecurity'],
      aboutRole: customAbout || 'No description provided.',
    };
    onSelectJob(custom);
    setIsEditingCustom(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0f19] border border-[#1e293b] rounded-xl overflow-hidden shadow-xl">
      {/* Mock Handshake Top Browser / Header */}
      <div className="bg-[#111827] border-b border-[#1e293b] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Handshake Logo Emblem */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#d8354c] text-white flex items-center justify-center font-bold text-xs tracking-tighter shadow-sm">
              H
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">Handshake</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
              app.joinhandshake.com/stu/jobs
            </span>
          </div>
        </div>

        {/* Scraper Inspector Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowScraperInspect(!showScraperInspect)}
            className={`text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 transition cursor-pointer border ${
              showScraperInspect
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-medium'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>{showScraperInspect ? 'DOM Scraper Hooks Active' : 'Show Scraper Hooks'}</span>
          </button>
        </div>
      </div>

      {/* Role Picker Tabs */}
      <div className="bg-[#0f172a] border-b border-[#1e293b] px-4 py-2 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Sample Roles:
        </span>
        {MOCK_HANDSHAKE_JOBS.map((job) => {
          const isSelected = currentJob.id === job.id;
          return (
            <button
              key={job.id}
              onClick={() => {
                setIsEditingCustom(false);
                onSelectJob(job);
              }}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border-slate-700/60'
              }`}
            >
              <Briefcase className="w-3 h-3" />
              <span>{job.jobTitle.split('(')[0].trim()}</span>
            </button>
          );
        })}

        <button
          onClick={() => setIsEditingCustom(true)}
          className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
            isEditingCustom
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
              : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border-slate-700/60'
          }`}
        >
          <Sliders className="w-3 h-3" />
          <span>+ Custom Job / Paste</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        {isEditingCustom ? (
          <div className="max-w-2xl mx-auto space-y-4 bg-[#111827] border border-[#1e293b] p-5 rounded-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Test Custom Handshake Job Posting
            </h3>
            <p className="text-xs text-slate-400">
              Paste the text from any Handshake job posting to test how content.js and Gemini evaluate it.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Job Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Information Security Associate"
                  className="w-full bg-[#0d131f] border border-[#1e293b] focus:border-cyan-500 rounded px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Employer</label>
                <input
                  type="text"
                  value={customCompany}
                  onChange={(e) => setCustomCompany(e.target.value)}
                  placeholder="e.g. CyberDefense Corp"
                  className="w-full bg-[#0d131f] border border-[#1e293b] focus:border-cyan-500 rounded px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">About the Role / Description</label>
                <textarea
                  value={customAbout}
                  onChange={(e) => setCustomAbout(e.target.value)}
                  rows={8}
                  placeholder="Paste the job responsibilities, qualifications, and requirements..."
                  className="w-full bg-[#0d131f] border border-[#1e293b] focus:border-cyan-500 rounded p-3 text-xs leading-relaxed text-slate-300 outline-none resize-y"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditingCustom(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyCustom}
                  className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Load into Simulator
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-5">
            {/* Job Header Card */}
            <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-5 relative overflow-hidden">
              {showScraperInspect && (
                <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-[10px] text-cyan-300 font-mono">
                  <span>scraped by content.js</span>
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div>
                  {/* Job Title Hook */}
                  <div className="relative inline-block">
                    <h1
                      data-hook="job-title"
                      className={`text-xl font-extrabold text-white tracking-tight ${
                        showScraperInspect ? 'outline-2 outline-cyan-400 outline-dashed p-1 rounded -m-1' : ''
                      }`}
                    >
                      {currentJob.jobTitle}
                    </h1>
                    {showScraperInspect && (
                      <span className="text-[9px] font-mono text-cyan-400 absolute -top-4 left-0">
                        [data-hook="job-title"]
                      </span>
                    )}
                  </div>

                  {/* Company Name Hook */}
                  <div className="mt-2.5 relative inline-block">
                    <div
                      data-hook="employer-name"
                      className={`text-sm font-semibold text-cyan-400 flex items-center gap-1.5 ${
                        showScraperInspect ? 'outline-2 outline-cyan-400 outline-dashed p-1 rounded -m-1' : ''
                      }`}
                    >
                      <Building className="w-4 h-4" />
                      <span>{currentJob.companyName}</span>
                    </div>
                    {showScraperInspect && (
                      <span className="text-[9px] font-mono text-cyan-400 absolute -top-4 left-0">
                        [data-hook="employer-name"]
                      </span>
                    )}
                  </div>
                </div>

                {/* Handshake Quick Actions */}
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1 hover:text-white cursor-pointer">
                    <Bookmark className="w-3.5 h-3.5" />
                    Save
                  </button>
                  <button className="px-4 py-1.5 rounded-lg bg-[#d8354c] hover:bg-[#b92b3f] text-white text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer">
                    <Send className="w-3.5 h-3.5" />
                    Apply on Handshake
                  </button>
                </div>
              </div>

              {/* Meta Badges */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {currentJob.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {currentJob.employmentType}
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <DollarSign className="w-3.5 h-3.5" />
                  {currentJob.salary}
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {currentJob.deadline}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {currentJob.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700 flex items-center gap-1"
                  >
                    <Tag className="w-2.5 h-2.5 text-cyan-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* About the Role Container Hook */}
            <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-5 relative">
              {showScraperInspect && (
                <div className="mb-2 inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/30">
                  <span>[data-hook="job-description"]</span> &bull; <span>Extracted by content.js</span>
                </div>
              )}

              <div
                data-hook="job-description"
                className={`prose prose-invert max-w-none text-xs leading-relaxed text-slate-300 whitespace-pre-line ${
                  showScraperInspect ? 'outline-2 outline-cyan-400 outline-dashed p-3 rounded' : ''
                }`}
              >
                {currentJob.aboutRole}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
