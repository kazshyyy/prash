import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import IngestionPage from './components/IngestionPage';
import DashboardPage from './components/DashboardPage';
import RectificationPage from './components/RectificationPage';
import { analyzeText } from './services/geminiService';
import { AnalysisResult } from './types';

type ViewState = 'LOGIN' | 'INGESTION' | 'DASHBOARD' | 'RECTIFICATION';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('LOGIN');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setCurrentView('INGESTION');
  };

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    try {
      const data = await analyzeText(text);
      setResult(data);
      setCurrentView('DASHBOARD');
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Analysis failed. Please try again. Ensure you have a valid API Key configured.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCurrentView('INGESTION');
  };

  return (
    <div className="font-sans antialiased text-slate-900 bg-white min-h-screen">
      
      {currentView === 'LOGIN' && (
        <LoginPage onLogin={handleLogin} />
      )}

      {currentView === 'INGESTION' && (
        <IngestionPage onAnalyze={handleAnalyze} isLoading={isLoading} />
      )}

      {currentView === 'DASHBOARD' && result && (
        <DashboardPage 
            result={result} 
            onNavigateRectification={() => setCurrentView('RECTIFICATION')} 
            onReset={handleReset}
        />
      )}

      {currentView === 'RECTIFICATION' && result && (
        <RectificationPage 
            result={result} 
            onBack={() => setCurrentView('DASHBOARD')} 
        />
      )}

    </div>
  );
};

export default App;