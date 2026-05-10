import { useState } from 'react';
import AnalysisReport from '../components/AnalysisReport';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import Navbar from '../components/Navbar';
import RightInsights from '../components/RightInsights';
import SidebarTree from '../components/SidebarTree';
import { useAnalysisContext } from '../context/AnalysisContext';
import { useRepositoryAnalysis } from '../hooks/useRepositoryAnalysis';
import AppShell from '../layouts/AppShell';
import ProjectStructurePage from './ProjectStructurePage';

const AnalyzerPage = () => {
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [currentView, setCurrentView] = useState('dashboard');
  const { analysisResult, setAnalysisResult, mode, setMode } = useAnalysisContext();
  const { analyzeRepository, isLoading, error, setError } = useRepositoryAnalysis();

  const handleAnalyze = async (event) => {
    event.preventDefault();
    if (!repositoryUrl.trim()) {
      setError('Paste a public GitHub repository URL to begin.');
      return;
    }

    const result = await analyzeRepository({ repositoryUrl, mode });
    if (result) {
      setAnalysisResult(result);
      setCurrentView('dashboard');
    }
  };

  const handleExampleSelect = (url) => {
    setRepositoryUrl(url);
    setError('');
  };

  const navbar = (
    <Navbar
      repositoryUrl={repositoryUrl}
      onRepositoryUrlChange={setRepositoryUrl}
      onAnalyze={handleAnalyze}
      isLoading={isLoading}
      mode={mode}
      onModeChange={setMode}
      currentView={currentView}
      onNavigate={setCurrentView}
      hasAnalysis={Boolean(analysisResult)}
    />
  );

  if (currentView === 'structure' && analysisResult) {
    return (
      <AppShell navbar={navbar} fullWidth>
        <ProjectStructurePage result={analysisResult} onBack={() => setCurrentView('dashboard')} />
      </AppShell>
    );
  }

  if (!analysisResult && !isLoading) {
    return (
      <AppShell navbar={navbar} fullWidth>
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}
        <EmptyState onExampleSelect={handleExampleSelect} />
      </AppShell>
    );
  }

  return (
    <AppShell
      navbar={navbar}
      leftSidebar={<SidebarTree tree={analysisResult?.tree} importantFiles={analysisResult?.importantFiles} result={analysisResult} />}
      rightSidebar={<RightInsights result={analysisResult} />}
    >
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <LoadingState />
      ) : analysisResult ? (
        <AnalysisReport result={analysisResult} />
      ) : (
        <EmptyState onExampleSelect={handleExampleSelect} />
      )}
    </AppShell>
  );
};

export default AnalyzerPage;
