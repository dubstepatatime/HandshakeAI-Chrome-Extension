import React from 'react';
import {
  X,
  Download,
  FolderArchive,
  Chrome,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadZip: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  onDownloadZip,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#111827] border border-[#1e293b] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Chrome className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                How to Install the Chrome Extension
              </h2>
              <p className="text-xs text-slate-400">Step-by-step setup in under 60 seconds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="space-y-3.5 text-xs">
          {/* Step 1 */}
          <div className="flex gap-3 p-3 rounded-xl bg-[#0b0f19] border border-[#1e293b]">
            <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5">
              1
            </div>
            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                Download and Extract the Extension ZIP
              </div>
              <p className="text-slate-400 text-[11.5px] leading-relaxed">
                Click below to download the compiled bundle containing <code>manifest.json</code>,{' '}
                <code>content.js</code>, <code>popup.html</code>, and icons. Extract the .zip into a folder on your computer.
              </p>
              <button
                onClick={onDownloadZip}
                className="mt-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Download extension.zip
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-3 p-3 rounded-xl bg-[#0b0f19] border border-[#1e293b]">
            <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5">
              2
            </div>
            <div className="space-y-1">
              <div className="font-bold text-white">Enable Developer Mode in Chrome</div>
              <p className="text-slate-400 text-[11.5px] leading-relaxed">
                In Google Chrome, navigate to{' '}
                <span className="font-mono text-cyan-400 bg-slate-900 px-1 py-0.5 rounded border border-slate-700">
                  chrome://extensions
                </span>{' '}
                and toggle the switch labeled <strong>"Developer mode"</strong> in the top-right corner.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-3 p-3 rounded-xl bg-[#0b0f19] border border-[#1e293b]">
            <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5">
              3
            </div>
            <div className="space-y-1">
              <div className="font-bold text-white">Click "Load Unpacked" and Select Folder</div>
              <p className="text-slate-400 text-[11.5px] leading-relaxed">
                Click <strong>"Load unpacked"</strong> and choose the folder where <code>manifest.json</code> is located.
              </p>
            </div>
          </div>
        </div>

        {/* Troubleshooting "Manifest file is missing or unreadable" */}
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 space-y-1.5">
          <div className="font-bold flex items-center gap-1.5 text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            Seeing "Manifest file is missing or unreadable"?
          </div>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-200/90 leading-relaxed">
            <li>
              <strong>Did you unzip?</strong> Chrome cannot load a <code>.zip</code> file directly. Right-click and choose <em>"Extract All"</em> (Windows) or double-click to unzip (Mac).
            </li>
            <li>
              <strong>Folder selection:</strong> In the folder dialog, click inside the unzipped folder. Make sure you select the folder containing <code>manifest.json</code> (not your general Downloads folder).
            </li>
            <li>
              <strong>Standalone file:</strong> Need just the manifest? You can{' '}
              <a
                href="/api/extension/download-manifest"
                download="manifest.json"
                className="underline font-bold text-white hover:text-cyan-300"
              >
                download manifest.json directly
              </a>
              .
            </li>
          </ul>
        </div>

        {/* Pro Tip */}
        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong>Ready to apply on Handshake:</strong> Visit{' '}
            <span className="font-mono text-white">app.joinhandshake.com</span>, open any cybersecurity job posting, and click the extension icon to view your match score and generate a custom cover letter draft!
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
