
import React, { useState } from 'react';

const DeploymentGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const setupCmd = "npx create-next-app@latest . --typescript --tailwind --eslint";

  const copyCmd = () => {
    navigator.clipboard.writeText(setupCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-12 p-8 bg-slate-800/40 border border-slate-700 rounded-2xl max-w-5xl mx-auto backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center shadow-inner">
            <i className="fas fa-server"></i>
          </div>
          <div>
            <h4 className="text-xl font-bold text-white">Advanced Deployment Guide</h4>
            <p className="text-xs text-slate-500">Choose your hosting environment</p>
          </div>
        </div>
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
          <span className="px-3 py-1 text-[10px] font-bold text-blue-400 uppercase tracking-widest">v15.2 Optimized</span>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Side: Local & Vercel */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-slate-900/40 p-5 rounded-xl border border-slate-700/50">
            <h5 className="text-blue-400 font-bold mb-4 flex items-center text-sm uppercase tracking-wider">
              <i className="fas fa-laptop-code mr-3"></i> Step 1: Local Setup
            </h5>
            <p className="text-[11px] text-slate-400 mb-3">প্রথমে পিসিতে প্রজেক্টটি তৈরি করে ডাউনলোড করা ফাইলগুলো রিপ্লেস করুন।</p>
            <div className="relative group mb-2">
              <div className="bg-black/60 rounded-lg p-3 font-mono text-[10px] text-blue-300 border border-blue-500/10">
                {setupCmd}
              </div>
              <button onClick={copyCmd} className="absolute right-2 top-2 text-slate-500 hover:text-white">
                <i className={`fas ${copied ? 'fa-check text-green-500' : 'fa-copy'}`}></i>
              </button>
            </div>
          </section>

          <section className="bg-slate-900/40 p-5 rounded-xl border border-slate-700/50">
            <h5 className="text-orange-400 font-bold mb-4 flex items-center text-sm uppercase tracking-wider">
              <i className="fab fa-cpanel mr-3 text-lg"></i> Step 2: cPanel Deployment (Shared Hosting)
            </h5>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 bg-orange-500/20 text-orange-400 rounded text-[10px] flex items-center justify-center font-bold">A</span>
                <p className="text-[11px] text-slate-300">আপনার পিসিতে <code>npm run build</code> কমান্ড দিয়ে প্রজেক্টটি বিল্ড করুন। এতে একটি <code>.next</code> ফোল্ডার তৈরি হবে।</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 bg-orange-500/20 text-orange-400 rounded text-[10px] flex items-center justify-center font-bold">B</span>
                <p className="text-[11px] text-slate-300"><code>.next</code>, <code>public</code>, <code>package.json</code>, এবং <code>node_modules</code> ফাইলগুলো জিপ করে সিপ্যানেলের <strong>File Manager</strong>-এ আপলোড করুন।</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 bg-orange-500/20 text-orange-400 rounded text-[10px] flex items-center justify-center font-bold">C</span>
                <p className="text-[11px] text-slate-300">সিপ্যানেলে <strong>"Setup Node.js App"</strong> এ গিয়ে <strong>Create Application</strong> দিন। Application root-এ আপনার ফোল্ডার পাথ দিন।</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 bg-orange-500/20 text-orange-400 rounded text-[10px] flex items-center justify-center font-bold">D</span>
                <p className="text-[11px] text-slate-300">Startup file হিসেবে <code>node_modules/next/dist/bin/next</code> অথবা একটি <code>server.js</code> ফাইল ব্যবহার করুন।</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Side: Pro Tips */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 rounded-2xl p-6 shadow-xl">
            <h5 className="text-blue-300 font-black mb-4 text-xs uppercase tracking-widest flex items-center">
              <i className="fas fa-lightbulb mr-2"></i> Expert Recommendation
            </h5>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
              নেক্সট জেএস-এর জন্য <strong>Vercel</strong> বা <strong>Netlify</strong> সেরা। কিন্তু যদি সিপ্যানেল ব্যবহার করতেই হয়, তবে নিশ্চিত করুন আপনার হোস্টিংয়ে Node.js সাপোর্ট আছে।
            </p>
            <a href="https://vercel.com/docs" target="_blank" className="block text-center py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 rounded-lg text-[10px] font-bold text-white transition-all">
              Vercel Documentation
            </a>
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-700 rounded-2xl">
            <h5 className="text-slate-400 font-bold mb-3 text-[10px] uppercase tracking-widest">Required Modules</h5>
            <div className="flex flex-wrap gap-2">
              {['next', 'react', 'react-dom', 'typescript', 'tailwind'].map(tag => (
                <span key={tag} className="px-2 py-1 bg-slate-800 rounded text-[9px] text-slate-500 font-mono border border-slate-700">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentGuide;
