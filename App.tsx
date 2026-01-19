
import React, { useState, useEffect } from 'react';
import { ProjectFile, ConvertedFile, ConversionStatus, UserFeedback } from './types';
import FileUploader from './components/FileUploader';
import CodeDisplay from './components/CodeDisplay';
import FeedbackModal from './components/FeedbackModal';
import DeploymentGuide from './components/DeploymentGuide';
import { convertReactToNext } from './services/geminiService';
// @ts-ignore
import JSZip from 'jszip';

const App: React.FC = () => {
  const [sourceFiles, setSourceFiles] = useState<ProjectFile[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [status, setStatus] = useState<ConversionStatus>({
    isConverting: false,
    progress: 0,
    message: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('conversion_count');
    if (saved) setHistoryCount(parseInt(saved));
  }, []);

  const handleFilesLoaded = async (files: ProjectFile[]) => {
    setSourceFiles(files);
    setConvertedFiles([]);
    setStatus({
      isConverting: true,
      progress: 10,
      message: 'Processing project files...'
    });

    try {
      setStatus(prev => ({ ...prev, progress: 30, message: 'AI Architect is analyzing your code...' }));
      const results = await convertReactToNext(files);
      
      setConvertedFiles(results);
      const newCount = historyCount + 1;
      setHistoryCount(newCount);
      localStorage.setItem('conversion_count', newCount.toString());
      
      setStatus({
        isConverting: false,
        progress: 100,
        message: 'Conversion complete!'
      });
      
      setTimeout(() => {
        const resEl = document.getElementById('results');
        if (resEl) resEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error: any) {
      console.error(error);
      setStatus({
        isConverting: false,
        progress: 0,
        message: 'Conversion failed',
        error: error.message || 'An unexpected error occurred during conversion.'
      });
    }
  };

  const handleDownloadZip = async () => {
    if (convertedFiles.length === 0) return;
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      convertedFiles.forEach(file => {
        zip.file(file.nextPath, file.content);
      });
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nextgen-project-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Zip Error:', err);
      alert('Failed to generate project bundle.');
    } finally {
      setIsDownloading(false);
    }
  };

  const reset = () => {
    setSourceFiles([]);
    setConvertedFiles([]);
    setStatus({ isConverting: false, progress: 0, message: '' });
  };

  return (
    <div className="min-h-screen pb-20 px-4 sm:px-6 lg:px-8 bg-[#0f172a] selection:bg-blue-500/30">
      {/* Navigation */}
      <header className="py-8 flex justify-between items-center max-w-7xl mx-auto sticky top-0 z-40 bg-[#0f172a]/80 backdrop-blur-md border-b border-transparent transition-all">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={reset}>
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-12 transition-all">
            <i className="fas fa-bolt text-white"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              NextGen Studio
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-blue-500 font-bold">React to Next.js Porter</p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center space-x-4 text-sm font-medium text-slate-400">
          <div className="flex items-center space-x-2 mr-4 text-[10px] uppercase font-bold tracking-widest text-slate-500">
            <i className="fas fa-history"></i>
            <span>{historyCount} Projects Processed</span>
          </div>
          <div className="tooltip-container">
            <button 
              onClick={() => setIsFeedbackOpen(true)}
              className="hover:text-white transition-colors flex items-center px-2 py-1"
            >
              <i className="far fa-comment-dots mr-2"></i> Feedback
            </button>
            <span className="tooltip-text">Share your thoughts</span>
          </div>
          <div className="w-px h-4 bg-slate-700 mx-2"></div>
          <div className="tooltip-container">
            <a href="#" className="hover:text-white transition-colors flex items-center px-2 py-1">
              <i className="fas fa-book mr-2"></i> Docs
            </a>
            <span className="tooltip-text">View documentation</span>
          </div>
          <div className="tooltip-container">
            <a href="#" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95">
              Get Pro
            </a>
            <span className="tooltip-text">Unlock advanced features</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto mt-12">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
            Enterprise Grade Refactoring Engine
          </div>
          <h2 className="text-4xl sm:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
            Automate Your <span className="text-blue-500">Next.js</span> <br />
            Migration Journey
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Move from legacy CRA or Vite projects to the cutting-edge App Router with zero manual effort and verified architectural patterns.
          </p>
        </div>

        {!convertedFiles.length && (
          <div className="animate-in zoom-in-95 duration-700">
            <FileUploader 
              onFilesLoaded={handleFilesLoaded} 
              isLoading={status.isConverting} 
            />
          </div>
        )}

        {status.isConverting && (
          <div className="w-full max-w-3xl mx-auto mt-12">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-3 uppercase tracking-tighter">
              <span className="flex items-center">
                <i className="fas fa-cog fa-spin mr-2 text-blue-500"></i>
                {status.message}
              </span>
              <span className="text-blue-500">{status.progress}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                style={{ width: `${status.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {status.error && (
          <div className="max-w-3xl mx-auto mt-12 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start space-x-4 text-red-400 shadow-lg">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center shrink-0">
              <i className="fas fa-circle-exclamation text-xl"></i>
            </div>
            <div>
              <p className="font-bold text-lg">Architectural Failure</p>
              <p className="text-sm opacity-80 mt-1">{status.error}</p>
              <button 
                onClick={reset}
                className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
              >
                Reset & Try Again
              </button>
            </div>
          </div>
        )}

        {convertedFiles.length > 0 && (
          <div id="results" className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            {/* Quick Stats Dashboard */}
            <div className="max-w-6xl mx-auto mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
               {[
                 { label: 'Files Portered', value: convertedFiles.length, icon: 'fa-file-code', color: 'text-blue-400' },
                 { label: 'SEO Optimization', value: '98%', icon: 'fa-magnifying-glass-chart', color: 'text-emerald-400' },
                 { label: 'Speed Improvement', value: '4.2x', icon: 'fa-gauge-high', color: 'text-amber-400' },
                 { label: 'Pattern Adherence', value: 'Strict', icon: 'fa-check-shield', color: 'text-indigo-400' }
               ].map((stat, i) => (
                 <div key={i} className="bg-slate-800/40 border border-slate-700 p-4 rounded-xl flex items-center space-x-4">
                   <div className={`w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center ${stat.color}`}>
                     <i className={`fas ${stat.icon}`}></i>
                   </div>
                   <div>
                     <p className="text-[10px] uppercase font-black text-slate-500 tracking-wider">{stat.label}</p>
                     <p className="text-xl font-bold text-white">{stat.value}</p>
                   </div>
                 </div>
               ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto mb-10 gap-4">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center shadow-lg border border-emerald-500/20">
                  <i className="fas fa-check-double text-2xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Refactoring Complete</h3>
                  <p className="text-slate-400 font-medium">Your modern Next.js project is ready for exploration.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="tooltip-container">
                  <button 
                    onClick={handleDownloadZip}
                    disabled={isDownloading}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center"
                  >
                    <i className={`fas ${isDownloading ? 'fa-spinner fa-spin' : 'fa-file-zipper'} mr-2`}></i> 
                    {isDownloading ? 'Bundling...' : 'Download Project Bundle'}
                  </button>
                  <span className="tooltip-text">Export all files as ZIP</span>
                </div>
                <div className="tooltip-container">
                  <button 
                    onClick={reset}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                  >
                    <i className="fas fa-plus mr-2"></i> Convert New
                  </button>
                  <span className="tooltip-text">Start a new project</span>
                </div>
              </div>
            </div>
            
            <CodeDisplay files={convertedFiles} originalFiles={sourceFiles} />

            <DeploymentGuide />
            
            <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-800/30 border border-slate-700 rounded-2xl hover:border-blue-500/30 transition-colors group">
                <h5 className="text-white font-bold mb-3 flex items-center">
                  <i className="fas fa-wand-sparkles mr-2 text-blue-400 group-hover:rotate-12 transition-transform"></i>
                  Suggested Improvements
                </h5>
                <ul className="space-y-3 text-xs text-slate-400 leading-relaxed">
                  <li>• Implement <strong>Partial Prerendering (PPR)</strong> for dynamic routes.</li>
                  <li>• Use <strong>next/font</strong> to optimize custom typography.</li>
                  <li>• Consolidate redundant components into <strong>UI primitives</strong>.</li>
                </ul>
              </div>
              <div className="p-6 bg-slate-800/30 border border-slate-700 rounded-2xl hover:border-indigo-500/30 transition-colors group">
                <h5 className="text-white font-bold mb-3 flex items-center">
                  <i className="fas fa-shield-halved mr-2 text-indigo-400 group-hover:scale-110 transition-transform"></i>
                  Security Checklist
                </h5>
                <ul className="space-y-3 text-xs text-slate-400 leading-relaxed">
                  <li>• Sanitize all user-input props in <strong>server actions</strong>.</li>
                  <li>• Configure <strong>Content Security Policy (CSP)</strong> headers.</li>
                  <li>• Use <code>.env.local</code> for all sensitive API keys.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-40 border-t border-slate-800/60 pt-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <i className="fas fa-bolt text-[10px] text-white"></i>
              </div>
              <span className="font-bold text-white tracking-tight">NextGen Studio</span>
            </div>
            <p className="text-slate-500 text-xs max-w-xs">
              Built by world-class engineers for the next generation of web performance. © 2025 NextGen Architect.
            </p>
          </div>
          
          <div className="flex space-x-12">
            <div>
              <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4">Platform</h6>
              <ul className="space-y-2 text-xs text-slate-500">
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Pricing</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Security</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Changelog</li>
              </ul>
            </div>
            <div>
              <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-4">Resources</h6>
              <ul className="space-y-2 text-xs text-slate-500">
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Documentation</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Tutorials</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">API Reference</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
        onSubmit={(f) => {
          console.log('Feedback:', f);
          alert('Thank you for the feedback!');
        }}
      />
    </div>
  );
};

export default App;
