import { Routes, Route, Navigate } from 'react-router-dom';
import { ChallengeProvider } from './context/ChallengeContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ChallengesPage from './pages/ChallengesPage';
import ChallengePage from './pages/ChallengePage';
import ApiDocsPage from './pages/ApiDocsPage';

function App() {
  return (
    <ThemeProvider>
      <ChallengeProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/challenge/:id" element={<ChallengePage />} />
            <Route path="/api-docs" element={<ApiDocsPage />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </ChallengeProvider>
    </ThemeProvider>
  );
}

export default App;
