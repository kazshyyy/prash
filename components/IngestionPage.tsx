import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, FileCheck, X } from 'lucide-react';

interface IngestionPageProps {
  onAnalyze: (text: string) => Promise<void>;
  isLoading: boolean;
}

const IngestionPage: React.FC<IngestionPageProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setFileName(file.name);
    if (file.type === "text/plain") {
        const textContent = await file.text();
        setText(textContent);
    } else {
        setText(`[SYSTEM: Content of ${file.name} ready for parsing]\n\n(Note: PDF/DOCX content extraction simulates here.)`);
    }
  };

  const clearFile = () => {
    setFileName(null);
    setText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
      <div className="w-full max-w-5xl">
        
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">
               Universal Content Ingestion
            </h1>
            <p className="text-slate-500 text-lg">
                Paste raw text or upload documents for structural auditing.
            </p>
        </div>

        <div className="w-full relative">
            <div 
                className={`w-full relative transition-all duration-200 ease-out mb-8 rounded-xl
                    ${isDragOver ? 'scale-[1.01] ring-4 ring-slate-200' : ''}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste text or drag & drop documents here..."
                    className={`w-full h-[60vh] bg-slate-50 text-slate-900 p-8 rounded-xl border-2 border-dashed resize-none text-lg leading-relaxed focus:outline-none focus:border-slate-900 transition-all font-mono
                        ${isDragOver ? 'border-slate-400 bg-slate-100' : 'border-slate-300 hover:border-slate-400'}
                        ${fileName ? 'pt-20' : ''}
                    `}
                    spellCheck="false"
                />
                
                {/* File Received Indicator */}
                {fileName && (
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                            <FileCheck className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-bold text-slate-900">File Received: {fileName}</span>
                        </div>
                        <button 
                            onClick={clearFile}
                            className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-red-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Placeholder Hint when empty */}
                {text.length === 0 && !isDragOver && !fileName && (
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="flex flex-col items-center text-slate-300">
                           <FileText className="w-16 h-16 mb-4" />
                           <span className="text-lg font-bold">Drag & Drop Documents</span>
                           <span className="text-sm font-medium mt-1">.TXT, .PDF, .DOCX supported</span>
                        </div>
                   </div>
                )}
                
                <div className="absolute bottom-6 right-6">
                     <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 rounded-lg bg-white border-2 border-slate-200 hover:border-slate-400 text-slate-500 hover:text-slate-900 transition-colors shadow-sm"
                        title="Browse Files"
                     >
                        <Upload className="w-6 h-6" />
                     </button>
                     <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden"
                        accept=".txt,.pdf,.docx"
                        onChange={handleFileSelect}
                     />
                </div>
            </div>
        </div>

        <div className="flex justify-center">
            <button
                onClick={() => onAnalyze(text)}
                disabled={!text.trim() || isLoading}
                className={`
                    min-w-[240px] px-8 py-5 rounded-lg font-bold text-lg tracking-wide transition-all shadow-xl
                    ${!text.trim() || isLoading 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                        : 'bg-slate-900 text-white hover:bg-black hover:-translate-y-1'
                    }
                `}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analyzing Structure...</span>
                    </div>
                ) : (
                    <span>Analyze Structure</span>
                )}
            </button>
        </div>

      </div>
    </div>
  );
};

export default IngestionPage;