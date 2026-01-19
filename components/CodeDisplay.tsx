
import React, { useState, useEffect, useRef } from 'react';
import { ConvertedFile, ProjectFile } from '../types';

declare var Prism: any;

interface CodeDisplayProps {
  files: ConvertedFile[];
  originalFiles: ProjectFile[];
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ files, originalFiles }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showOriginal, setShowOriginal] = useState(false);
  const activeFile = files[selectedIndex];
  const codeRef = useRef<HTMLElement>(null);

  // Find the original file matching the current active conversion
  const originalFile = originalFiles.find(f => f.path === activeFile.originalPath);

  useEffect(() => {
    if (codeRef.current && typeof Prism !== 'undefined') {
      Prism.highlightElement(codeRef.current);
    }
  }, [selectedIndex, activeFile, showOriginal]);

  if (files.length === 0) return null;

  const copyToClipboard = () => {
    const textToCopy = showOriginal ? originalFile?.content : activeFile.content;
    if (!textToCopy) return;
    
    navigator.clipboard.writeText(textToCopy);
    const btn = document.getElementById('copy-btn');
    if (btn) {
      const originalContent = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check mr-2 text-green-400"></i> Copied';
      setTimeout(() => btn.innerHTML = originalContent, 2000);
    }
  };

  const handleCopyAll = () => {
    const allContent = files.map(f => `// File: ${f.nextPath}\n${f.content}`).join('\n\n' + '='.repeat(40) + '\n\n');
    navigator.clipboard.writeText(allContent);
    const btn = document.getElementById('copy-all-btn');
    if (btn) {
      const originalContent = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check mr-2 text-green-400"></i> All Copied';
      setTimeout(() => btn.innerHTML = originalContent, 2000);
    }
  };

  const getLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts': return 'typescript';
      case 'tsx': return 'tsx';
      case 'js': return 'javascript';
      case 'jsx': return 'jsx';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'html': return 'html';
      case 'yml':
      case 'yaml': return 'yaml';
      case 'md': return 'markdown';
      default: return 'javascript';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 flex flex-col lg:flex-row gap-6 h-[750px]">
      {/* File Sidebar */}
      <div className="w-full lg:w-80 bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden flex flex-col shadow-xl">
        <div className="p-4 bg-slate-900/50 border-b border-slate-700 flex justify-between items-center">
          <h4 className="text-sm font-semibold text-slate-300 flex items-center">
            <i className="fas fa-folder-tree mr-2 text-blue-400"></i>
            Project Explorer
          </h4>
          <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-400">{files.length} files</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {files.map((file, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedIndex(idx);
                setShowOriginal(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-all border-l-4 ${
                selectedIndex === idx 
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-inner font-bold' 
                  : 'border-transparent text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <div className="truncate font-mono">{file.nextPath}</div>
              <div className={`text-[10px] mt-1 flex items-center ${selectedIndex === idx ? 'text-blue-300' : 'opacity-60'}`}>
                <i className="fas fa-reply fa-rotate-180 mr-1 opacity-40"></i>
                {file.originalPath}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col shadow-2xl relative">
        <div className="p-3 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1.5 mr-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            </div>
            
            {/* Toggle Switch */}
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
              <button 
                onClick={() => setShowOriginal(false)}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${!showOriginal ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Next.js
              </button>
              <button 
                onClick={() => setShowOriginal(true)}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${showOriginal ? 'bg-amber-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Original
              </button>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!showOriginal && (
              <button 
                id="copy-all-btn"
                onClick={handleCopyAll}
                className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg transition-all flex items-center text-slate-300 font-medium active:scale-95"
              >
                <i className="fas fa-copy mr-2"></i> Copy All
              </button>
            )}
            <button 
              id="copy-btn"
              onClick={copyToClipboard}
              className={`text-xs px-4 py-2 rounded-lg transition-all flex items-center text-white font-bold active:scale-95 shadow-lg ${showOriginal ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'}`}
            >
              <i className="far fa-copy mr-2"></i> Copy {showOriginal ? 'Original' : 'Next.js'}
            </button>
          </div>
        </div>
        
        <div className={`px-6 py-3 border-b border-slate-800 flex items-start space-x-3 ${showOriginal ? 'bg-amber-900/10' : 'bg-blue-900/10'}`}>
          <i className={`fas ${showOriginal ? 'fa-history text-amber-400' : 'fa-magic text-blue-400'} mt-1 text-xs`}></i>
          <p className={`text-[13px] italic leading-relaxed ${showOriginal ? 'text-amber-300/90' : 'text-blue-300/90'}`}>
            {showOriginal ? `Showing original React source code from: ${activeFile.originalPath}` : activeFile.explanation}
          </p>
        </div>

        <div className="flex-1 overflow-auto bg-[#011627] relative group">
          <pre className={`line-numbers language-${getLanguage(showOriginal ? originalFile?.path || 'js' : activeFile.nextPath)} h-full p-6`}>
            <code ref={codeRef} className={`language-${getLanguage(showOriginal ? originalFile?.path || 'js' : activeFile.nextPath)}`}>
              {showOriginal ? originalFile?.content || '// File content not found' : activeFile.content}
            </code>
          </pre>
        </div>
        
        <div className="absolute bottom-4 right-6 pointer-events-none opacity-20">
          <span className="text-4xl font-black text-slate-600 select-none">
            {showOriginal ? 'ORIGINAL' : 'NEXT.JS'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CodeDisplay;
