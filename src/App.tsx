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
  if (import.meta.env.DEV) {
    console.log('[App] Initializing App component...');
  }
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [settings, setSettings] = useState<GameSettings>(loadSettings());
  const [sharedScore, setSharedScore] = useState<{ 
    username: string; 
    score: number;
    total?: number;
    timeInSeconds?: number;
  } | null>(null);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('[App] Checking for shared score in URL...');
    }
    // Check URL parameters for shared score
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    
    if (data) {
      if (import.meta.env.DEV) {
        console.log('[App] Shared score data found, decoding...');
      }
      const decoded = decodeScoreData(data);
      if (decoded) {
        if (import.meta.env.DEV) {
          console.log('[App] Shared score decoded successfully');
        }
        setSharedScore({ 
          username: decoded.username, 
          score: decoded.score,
          total: decoded.total,
          timeInSeconds: decoded.timeInSeconds
        });
        setCurrentPage('score');
      } else {
        console.warn('[App] Failed to decode shared score data');
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
