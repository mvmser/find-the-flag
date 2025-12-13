// Score sharing page component

import { t } from '../i18n';
import { useLanguage } from '../contexts/useLanguage';
import { LanguageToggle } from './LanguageToggle';
import { formatTime } from '../utils';

interface ScorePageProps {
  username: string;
  score: number;
  total?: number;
  timeInSeconds?: number;
  onPlayNow: () => void;
}

export function ScorePage({ username, score, total, timeInSeconds, onPlayNow }: ScorePageProps) {
  const { language } = useLanguage();

  return (
    <div className="page score-page">
      <div className="language-toggle-container">
        <LanguageToggle />
      </div>
      
      <div className="score-content">
        <h1 className="score-title">{t('score.lookAtMyScore', language)}</h1>
        
        <div className="score-card">
          <div className="score-card-username">{username || 'Anonymous'}</div>
          <div className="score-card-details">
            {total ? (
              <>
                <div className="score-card-stat">
                  {t('score.hasCorrectAnswers', language)
                    .replace('{score}', score.toString())
                    .replace('{total}', total.toString())}
                </div>
                {timeInSeconds && timeInSeconds > 0 && (
                  <div className="score-card-stat">
                    {t('score.inTime', language)
                      .replace('{time}', formatTime(timeInSeconds))}
                  </div>
                )}
              </>
            ) : (
              <div className="score-card-stat">
                {t('score.achieved', language)} {score}
              </div>
            )}
          </div>
        </div>
        
        <button className="btn btn-primary btn-large" onClick={onPlayNow}>
          {t('score.playNow', language)}
        </button>
      </div>
    </div>
  );
}
