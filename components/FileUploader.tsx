
import React, { useRef, useState } from 'react';
import { ProjectFile } from '../types';

interface FileUploaderProps {
  onFilesLoaded: (files: ProjectFile[]) => void;
  isLoading: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesLoaded, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    
    const loadedFiles: ProjectFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const text = await file.text();
      loadedFiles.push({
        name: file.name,
        path: file.webkitRelativePath || file.name,
        content: text,
        type: file.type
      });
    }
    
    onFilesLoaded(loadedFiles);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleFiles(e.target.files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div 
      className={`relative w-full max-w-3xl mx-auto p-12 border-2 border-dashed rounded-2xl transition-all duration-300 ${
        dragActive ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !isLoading && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        // @ts-ignore - webkitdirectory is standard for folder uploads
        webkitdirectory=""
        directory=""
        multiple
        className="hidden"
        onChange={handleChange}
        disabled={isLoading}
      />
      
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mb-2">
          <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up'} text-2xl`}></i>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Upload React Project Folder</h3>
          <p className="text-slate-400 mt-2">
            {isLoading ? "Analyzing project files..." : "Drag and drop your project folder here or click to browse"}
          </p>
          <div className="mt-4 flex gap-3 justify-center">
            <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300">React</span>
            <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300">Vite</span>
            <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300">CRA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
