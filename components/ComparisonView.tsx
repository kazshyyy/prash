import React, { useState } from 'react';
import { RectificationData } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface ComparisonViewProps {
  data: RectificationData;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'compare' | 'changelog'>('compare');

  return (
    <div className="w-full bg-white border-2 border-slate-200 rounded-xl overflow-hidden mt-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-100 bg-slate-50">
        <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setActiveTab('compare')}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'compare' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Visual Comparison
          </button>
          <button 
            onClick={() => setActiveTab('changelog')}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'changelog' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Structure Log
          </button>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Cognitive Load Reduction</span>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold border border-emerald-200">
            {data.loadReductionPercentage}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-0">
        {activeTab === 'compare' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x-2 divide-slate-100 min-h-[500px]">
            {/* Original */}
            <div className="p-8 bg-slate-50/50">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Original Content</h4>
              </div>
              <p className="text-slate-800 leading-loose whitespace-pre-wrap font-sans text-base">
                {data.originalContent || "No original content available."}
              </p>
            </div>

            {/* Rectified */}
            <div className="p-8 bg-white">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Rectified Content</h4>
              </div>
              <p className="text-slate-900 leading-loose whitespace-pre-wrap font-sans text-base font-medium">
                {data.rectifiedContent}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-8 bg-white">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Structural Interventions</h4>
            <div className="grid grid-cols-1 gap-4">
              {data.changeLog.map((change, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <span className="text-slate-800 font-medium">{change}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonView;