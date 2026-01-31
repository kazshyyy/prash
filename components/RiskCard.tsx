import React from 'react';
import { RiskMeter, getRiskColor } from '../types';
import { Activity, Zap, Brain, Eye } from 'lucide-react';

interface RiskCardProps {
  data: RiskMeter;
  isSelected: boolean;
  onClick: () => void;
}

const RiskCard: React.FC<RiskCardProps> = ({ data, isSelected, onClick }) => {
  const getIcon = () => {
    switch (data.condition) {
      case 'ADHD': return <Zap className="w-5 h-5" />;
      case 'Dyslexia': return <Eye className="w-5 h-5" />;
      case 'Anxiety': return <Activity className="w-5 h-5" />;
      case 'Autism': return <Brain className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const riskColor = getRiskColor(data.level);
  
  return (
    <div 
      onClick={onClick}
      className={`relative p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer bg-white shadow-sm hover:shadow-md
        ${isSelected 
          ? 'ring-2 ring-offset-2' 
          : 'hover:border-slate-300'
        }
      `}
      style={{ 
        borderColor: isSelected ? riskColor : '#E2E8F0',
        borderTopColor: riskColor,
        borderTopWidth: '6px'
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-slate-100 text-slate-700">
            {getIcon()}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{data.condition}</h3>
            <span 
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: riskColor }}
            >
              {data.level} Risk
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold font-mono text-slate-900">{data.score}</div>
        </div>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        {data.summary}
      </p>

      <div className="mt-4 flex items-center text-xs font-bold text-slate-500 uppercase tracking-widest group">
        View Audit <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
      </div>
    </div>
  );
};

export default RiskCard;