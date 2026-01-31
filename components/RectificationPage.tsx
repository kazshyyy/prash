import React from 'react';
import { AnalysisResult } from '../types';
import ComparisonView from './ComparisonView';
import { ArrowLeft, Download, Check } from 'lucide-react';

interface RectificationPageProps {
  result: AnalysisResult;
  onBack: () => void;
}

const RectificationPage: React.FC<RectificationPageProps> = ({ result, onBack }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 p-8 md:p-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors mb-4 text-sm"
            >
                <ArrowLeft className="w-4 h-4" /> Return to Risk Grid
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Rectification Dashboard
            </h1>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 hover:border-slate-900 rounded-lg text-sm font-bold transition-colors">
            <Download className="w-4 h-4" /> Export Audit Report
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Col: Change Log Summary */}
        <div className="lg:col-span-1">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sticky top-8">
                <div className="mb-6">
                    <span className="block text-4xl font-bold text-emerald-600 mb-1">{result.rectification.loadReductionPercentage}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Total Load Reduction</span>
                </div>

                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-200 pb-2">Change Log</h3>
                <div className="space-y-4">
                    {result.rectification.changeLog.map((log, idx) => (
                        <div key={idx} className="flex gap-3">
                            <div className="mt-1">
                                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">{log}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right Col: Comparison View */}
        <div className="lg:col-span-3">
            <ComparisonView data={result.rectification} />
        </div>

      </div>
    </div>
  );
};

export default RectificationPage;