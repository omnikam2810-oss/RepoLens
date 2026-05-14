import { AnalysisProvider } from './context/AnalysisContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import AnalyzerPage from './pages/AnalyzerPage.jsx';

const App = () => (
  <ThemeProvider>
    <AnalysisProvider>
      <AnalyzerPage />
    </AnalysisProvider>
  </ThemeProvider>
);

export default App;
