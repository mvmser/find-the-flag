// Home page component

import { t } from '../i18n';
import { useLanguage } from '../contexts/useLanguage';
import { LanguageToggle } from './LanguageToggle';

interface HomePageProps {
  onStartGame: () => void;
  onOpenSettings: () => void;
}

export function HomePage({ onStartGame, onOpenSettings }: HomePageProps) {
  const { language } = useLanguage();

  return (
    <div className="page home-page">
      <div className="language-toggle-container">
        <LanguageToggle />
      </div>
      
      <div className="home-content">
        <h1 className="home-title">{t('home.title', language)}</h1>
        <p className="home-subtitle">{t('home.subtitle', language)}</p>
        <button className="btn btn-primary btn-large" onClick={onStartGame}>
          {t('home.startGame', language)}
        </button>
        <button className="btn btn-secondary" onClick={onOpenSettings}>
          {t('home.settings', language)}
        </button>
      </div>
    </div>
  );
}
