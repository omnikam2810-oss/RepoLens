import { AnalysisProvider } from './context/AnalysisContext.jsx';
import AnalyzerPage from './pages/AnalyzerPage.jsx';

const App = () => (
  <AnalysisProvider>
    <AnalyzerPage />
  </AnalysisProvider>
);

export default App;
