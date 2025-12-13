// Score sharing page component

import { t } from '../i18n';
import { useLanguage } from '../contexts/useLanguage';
import { LanguageToggle } from './LanguageToggle';

interface ScorePageProps {
  username: string;
  score: number;
  onPlayNow: () => void;
}

export function ScorePage({ username, score, onPlayNow }: ScorePageProps) {
  const { language } = useLanguage();

  return (
    <div className="page score-page">
      <div className="language-toggle-container">
        <LanguageToggle />
      </div>
      
      <div className="score-content">
        <h1 className="score-title">{t('score.congrats', language)}</h1>
        <div className="score-achievement">
          <div className="score-username">{username || 'Anonymous'}</div>
          <div className="score-text">{t('score.achieved', language)}</div>
          <div className="score-value">{score}</div>
        </div>
        <button className="btn btn-primary btn-large" onClick={onPlayNow}>
          {t('score.playNow', language)}
        </button>
      </div>
    </div>
  );
}
