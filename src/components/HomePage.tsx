// Home page component

import { t } from '../i18n';
import { LanguageToggle } from './LanguageToggle';

interface HomePageProps {
  onStartGame: () => void;
}

export function HomePage({ onStartGame }: HomePageProps) {
  return (
    <div className="page home-page">
      <div className="language-toggle-container">
        <LanguageToggle />
      </div>
      
      <div className="home-content">
        <h1 className="home-title">{t('home.title')}</h1>
        <p className="home-subtitle">{t('home.subtitle')}</p>
        <button className="btn btn-primary btn-large" onClick={onStartGame}>
          {t('home.startGame')}
        </button>
      </div>
    </div>
  );
}
