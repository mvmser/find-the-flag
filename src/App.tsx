import { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { HomePage } from './components/HomePage';
import { GamePage } from './components/GamePage';
import { SettingsPage } from './components/SettingsPage';
import { ScorePage } from './components/ScorePage';
import { GameSettings } from './types';
import { loadSettings } from './utils/storage';
import './styles/App.css';

type Page = 'home' | 'game' | 'settings' | 'score';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [settings, setSettings] = useState<GameSettings>(loadSettings());
  const [sharedScore, setSharedScore] = useState<{ username: string; score: number } | null>(null);

  useEffect(() => {
    // Check URL parameters for shared score
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');
    const score = params.get('score');
    
    if (username && score) {
      const scoreValue = parseInt(score, 10);
      // Validate username and score
      const sanitizedUsername = username.trim().substring(0, 20);
      if (!isNaN(scoreValue) && scoreValue >= 0 && sanitizedUsername) {
        setSharedScore({ username: sanitizedUsername, score: scoreValue });
        setCurrentPage('score');
      }
    }
  }, []);

  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings);
  };

  const handleGoHome = () => {
    // Clear URL parameters when going home
    window.history.pushState({}, '', window.location.pathname);
    setCurrentPage('home');
  };

  return (
    <LanguageProvider>
      <div className="app">
        {currentPage === 'home' ? (
          <HomePage 
            onStartGame={() => setCurrentPage('game')} 
            onOpenSettings={() => setCurrentPage('settings')}
          />
        ) : currentPage === 'settings' ? (
          <SettingsPage 
            onBack={handleGoHome}
            onSettingsChange={handleSettingsChange}
          />
        ) : currentPage === 'score' && sharedScore ? (
          <ScorePage
            username={sharedScore.username}
            score={sharedScore.score}
            onPlayNow={handleGoHome}
          />
        ) : (
          <GamePage 
            onGoHome={handleGoHome}
            settings={settings}
          />
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;
