import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { HomePage } from './components/HomePage';
import { GamePage } from './components/GamePage';
import './styles/App.css';

type Page = 'home' | 'game';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  return (
    <LanguageProvider>
      <div className="app">
        {currentPage === 'home' ? (
          <HomePage onStartGame={() => setCurrentPage('game')} />
        ) : (
          <GamePage onGoHome={() => setCurrentPage('home')} />
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;
