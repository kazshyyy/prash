export type ConditionType = "ADHD" | "Dyslexia" | "Anxiety" | "Autism";
export type RiskLevel = "High" | "Medium" | "Low";

export interface RiskMeter {
  condition: ConditionType;
  level: RiskLevel;
  score: number;
  colorCode: string;
  summary: string;
}

export interface TriggerSentence {
  original: string;
  issueType: string;
  reasoning: string;
  microFix: string;
}

export interface ConditionDetail {
  triggerSentences: TriggerSentence[];
  barrierExplanation: string;
}

export interface RectificationData {
  originalContent: string; // Echoed back for reference
  rectifiedContent: string;
  changeLog: string[];
  loadReductionPercentage: string;
}

export interface AnalysisResult {
  overallScore: number;
  accessibilityInsight: string;
  riskMeters: RiskMeter[];
  detailedAnalysis: {
    [key in ConditionType]?: ConditionDetail;
  };
  rectification: RectificationData;
}

// Helper to determine color based on risk level
export const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case 'High': return '#EF4444'; // Red
    case 'Medium': return '#F59E0B'; // Yellow
    case 'Low': return '#10B981'; // Green
    default: return '#64748B'; // Slate
  }
};