import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { HomePage } from './components/HomePage';
import { GamePage } from './components/GamePage';
import { SettingsPage } from './components/SettingsPage';
import { GameSettings } from './types';
import { loadSettings } from './utils/storage';
import './styles/App.css';

type Page = 'home' | 'game' | 'settings';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [settings, setSettings] = useState<GameSettings>(loadSettings());

  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings);
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
            onBack={() => setCurrentPage('home')}
            onSettingsChange={handleSettingsChange}
          />
        ) : (
          <GamePage 
            onGoHome={() => setCurrentPage('home')}
            settings={settings}
          />
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;
