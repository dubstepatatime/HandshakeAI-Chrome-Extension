import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Download,
  Terminal,
  Layers,
  FileText,
  PackageCheck,
} from 'lucide-react';
import { EXTENSION_FILES, ExtensionFile } from '../extensionSource';

interface CodebaseExplorerProps {
  onDownloadZip: () => void;
  isZipping?: boolean;
}

export const CodebaseExplorer: React.FC<CodebaseExplorerProps> = ({
  onDownloadZip,
  isZipping = false,
}) => {
  const fileKeys = Object.keys(EXTENSION_FILES);
  const [selectedFileName, setSelectedFileName] = useState<string>('manifest.json');
  const [copied, setCopied] = useState<boolean>(false);

  const activeFile: ExtensionFile = EXTENSION_FILES[selectedFileName] || EXTENSION_FILES['manifest.json'];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = activeFile.code.split('\n');

  return (
    <div className="flex-1 flex flex-col bg-[#0b0f19] border border-[#1e293b] rounded-xl overflow-hidden shadow-xl">
      {/* Top File Bar */}
      <div className="bg-[#111827] border-b border-[#1e293b] px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-xs text-white uppercase tracking-wider">
            Chrome Extension Codebase (Manifest V3)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onDownloadZip}
            disabled={isZipping}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-cyan-500/20 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isZipping ? 'Bundling...' : 'Download Extension (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* File Tabs */}
      <div className="bg-[#0f172a] border-b border-[#1e293b] px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
        {fileKeys.map((name) => {
          const isSelected = selectedFileName === name;
          return (
            <button
              key={name}
              onClick={() => setSelectedFileName(name)}
              className={`text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 transition cursor-pointer font-mono whitespace-nowrap border ${
                isSelected
                  ? 'bg-[#1e293b] text-cyan-300 border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/60'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>{name}</span>
            </button>
          );
        })}
      </div>

      {/* Active File Meta Sub-bar */}
      <div className="bg-[#131b2e] border-b border-[#1e293b] px-4 py-2 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-cyan-400 font-semibold">{activeFile.path}</span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-slate-400 text-[11px] truncate">{activeFile.description}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-400 font-mono">
            {lines.length} lines &bull; {(activeFile.code.length / 1024).toFixed(1)} KB
          </span>
          <button
            onClick={handleCopyCode}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1 transition cursor-pointer border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownloadSingle}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1 transition cursor-pointer border border-slate-700"
          >
            <Download className="w-3 h-3" />
            <span>Download {activeFile.name}</span>
          </button>
        </div>
      </div>

      {selectedFileName === 'manifest.json' && (
        <div className="bg-cyan-950/40 border-b border-cyan-500/20 px-4 py-2 text-xs text-cyan-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              <strong>Valid Manifest V3:</strong> When loading into <code>chrome://extensions</code>, select the folder containing this <code>manifest.json</code>.
            </span>
          </div>
          <a
            href="/api/extension/download-manifest"
            download="manifest.json"
            className="text-[11px] text-cyan-400 underline font-semibold hover:text-white"
          >
            Direct download manifest.json &nearr;
          </a>
        </div>
      )}

      {/* Code Viewer with Line Numbers */}
      <div className="flex-1 overflow-auto bg-[#0a0e17] font-mono text-[11.5px] leading-relaxed p-4 custom-scrollbar">
        <pre className="flex">
          {/* Line Numbers */}
          <div className="select-none text-slate-600 text-right pr-4 font-mono select-none">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          {/* Code */}
          <div className="text-slate-200 flex-1 overflow-x-auto whitespace-pre">
            <code>{activeFile.code}</code>
          </div>
        </pre>
      </div>
    </div>
  );
};
