// Home page component

import { t } from '../i18n';
import { useLanguage } from '../contexts/useLanguage';
import { LanguageToggle } from './LanguageToggle';

interface HomePageProps {
  onStartGame: () => void;
  onOpenSettings: () => void;
}

// Version number - update this when incrementing version
// Note: This is intentionally hardcoded to avoid bundling package.json metadata
// in the production build. When updating the version, change this constant AND
// package.json version.
const APP_VERSION = '0.4.0';

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
      
      <footer className="home-footer">
        <div>{t('home.madeBy', language)}</div>
        <div className="version">{t('home.version', language)} {APP_VERSION}</div>
      </footer>
    </div>
  );
}
