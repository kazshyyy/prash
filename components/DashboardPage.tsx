import React, { useState } from 'react';
import { AnalysisResult, ConditionType, getRiskColor } from '../types';
import RiskCard from './RiskCard';
import { AlertCircle, ArrowRight, X, Activity } from 'lucide-react';

interface DashboardPageProps {
  result: AnalysisResult;
  onNavigateRectification: () => void;
  onReset: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ result, onNavigateRectification, onReset }) => {
  const [selectedCondition, setSelectedCondition] = useState<ConditionType | null>(null);

  const selectedDetail = selectedCondition ? result.detailedAnalysis[selectedCondition] : null;
  const selectedRiskLevel = selectedCondition ? result.riskMeters.find(r => r.condition === selectedCondition)?.level : 'Low';
  const riskColor = selectedRiskLevel ? getRiskColor(selectedRiskLevel) : '#94A3B8';

  return (
    <div className="min-h-screen bg-white text-slate-900 p-8 md:p-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b-2 border-slate-100 pb-8">
        <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-widest">
                    Report Generated
                </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-3">Cognitive Load Audit</h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">{result.accessibilityInsight}</p>
        </div>
        <div className="text-right mt-6 md:mt-0">
            <div className="text-6xl font-bold text-slate-900 mb-1 font-mono">{result.overallScore}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Accessibility Score</div>
        </div>
      </div>

      {/* 2x2 Risk Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {result.riskMeters.map((meter) => (
          <RiskCard 
            key={meter.condition}
            data={meter}
            isSelected={false}
            onClick={() => setSelectedCondition(meter.condition)}
          />
        ))}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center">
        <button 
            onClick={onReset}
            className="text-slate-500 font-bold hover:text-slate-900 transition-colors text-sm"
        >
            ← Upload New Content
        </button>
        <button
            onClick={onNavigateRectification}
            className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-lg font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl"
        >
            View Rectification Dashboard <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Linguistic Audit View (Modal) */}
      {selectedCondition && selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div 
                className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b-2 border-slate-100">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                             <Activity className="w-4 h-4" style={{ color: riskColor }} />
                             <span className="text-xs font-bold uppercase tracking-widest" style={{ color: riskColor }}>
                                Linguistic Audit
                             </span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">
                           {selectedCondition} Profile
                        </h3>
                    </div>
                    <button 
                        onClick={() => setSelectedCondition(null)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-8 overflow-y-auto bg-slate-50">
                    <div className="mb-8 p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Clinical Barrier</span>
                        <p className="text-slate-700 font-medium leading-relaxed">
                            {selectedDetail.barrierExplanation}
                        </p>
                    </div>

                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-200 pb-2">Flagged Content</h4>
                    
                    <div className="space-y-6">
                        {selectedDetail.triggerSentences.map((trigger, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-red-500">
                                        {trigger.issueType}
                                    </span>
                                </div>
                                
                                <div className="mb-4 pl-4 border-l-4 border-red-100">
                                    <p className="text-slate-800 font-medium text-lg italic">"{trigger.original}"</p>
                                </div>

                                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">Recommended Micro-Fix</span>
                                    <p className="text-slate-700 font-medium">{trigger.microFix}</p>
                                </div>
                            </div>
                        ))}

                        {selectedDetail.triggerSentences.length === 0 && (
                            <div className="text-center py-12 text-slate-400 font-medium">
                                No high-risk barriers detected for this profile.
                            </div>
                        )}
                    </div>
                </div>

                 {/* Modal Footer */}
                 <div className="p-6 border-t-2 border-slate-100 bg-white flex justify-end">
                    <button 
                        onClick={() => setSelectedCondition(null)}
                        className="px-6 py-3 bg-white border-2 border-slate-200 hover:border-slate-900 rounded-lg text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors"
                    >
                        Close Audit
                    </button>
                 </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;