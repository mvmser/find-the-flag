import { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { HomePage } from './components/HomePage';
import { GamePage } from './components/GamePage';
import { SettingsPage } from './components/SettingsPage';
import { ScorePage } from './components/ScorePage';
import { GameSettings } from './types';
import { loadSettings, decodeScoreData } from './utils/storage';
import './styles/App.css';

type Page = 'home' | 'game' | 'settings' | 'score';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [settings, setSettings] = useState<GameSettings>(loadSettings());
  const [sharedScore, setSharedScore] = useState<{ 
    username: string; 
    score: number;
    total?: number;
    timeInSeconds?: number;
  } | null>(null);

  useEffect(() => {
    // Check URL parameters for shared score
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    
    if (data) {
      const decoded = decodeScoreData(data);
      if (decoded) {
        setSharedScore({ 
          username: decoded.username, 
          score: decoded.score,
          total: decoded.total,
          timeInSeconds: decoded.timeInSeconds
        });
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
    setSharedScore(null);
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
            total={sharedScore.total}
            timeInSeconds={sharedScore.timeInSeconds}
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
